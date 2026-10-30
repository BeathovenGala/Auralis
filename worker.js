import "dotenv/config";
import { mkdir, readFile, appendFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 15 * 1000;
const DEFAULT_ARCHIVE_DIR = path.join(__dirname, "data", "daily");

const POLL_INTERVAL_MS = Number.parseInt(
  process.env.WORKER_POLL_INTERVAL_MS || `${DEFAULT_INTERVAL_MS}`,
  10,
);
const FETCH_TIMEOUT_MS = Number.parseInt(
  process.env.WORKER_HTTP_TIMEOUT_MS || `${DEFAULT_TIMEOUT_MS}`,
  10,
);
const ARCHIVE_DIR = process.env.WORKER_ARCHIVE_DIR || DEFAULT_ARCHIVE_DIR;
const APP_PORT = process.env.PORT || "5000";
const APP_BASE_URL = process.env.WORKER_APP_BASE_URL || `http://127.0.0.1:${APP_PORT}`;

const SOURCE_CONFIG = {
  plasma: {
    name: "NOAA_SWPC_PLASMA",
    url: "https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json",
    columns: ["time_tag", "density", "speed", "temperature"],
  },
  magnetic: {
    name: "NOAA_SWPC_MAG",
    url: "https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json",
    columns: ["time_tag", "bx", "by", "bz", "lon", "lat", "bt"],
  },
  kp: {
    name: "NOAA_SWPC_KP",
    url: "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
    columns: ["time_tag", "kp_index"],
  },
};

let isRunning = false;
let lastArchivedEntryKey = "";

function log(message, meta) {
  const timestamp = new Date().toISOString();
  if (meta !== undefined) {
    console.log(`[Worker ${timestamp}] ${message}`, meta);
    return;
  }

  console.log(`[Worker ${timestamp}] ${message}`);
}

function logError(message, error) {
  console.error(`[Worker ${new Date().toISOString()}] ${message}`, error);
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseFloat(`${value}`);
  return Number.isFinite(parsed) ? parsed : null;
}

function getArchiveDate(date) {
  return date.toISOString().slice(0, 10);
}

function getArchivePath(date) {
  return path.join(ARCHIVE_DIR, `${getArchiveDate(date)}.jsonl`);
}

function rowToObject(columns, row) {
  const entry = {};

  columns.forEach((column, index) => {
    entry[column] = row[index] ?? null;
  });

  return entry;
}

function getLatestDataRow(rows) {
  if (!Array.isArray(rows) || rows.length < 2) {
    throw new Error("Feed did not return any data rows");
  }

  for (let index = rows.length - 1; index >= 1; index -= 1) {
    const row = rows[index];
    if (Array.isArray(row) && row.length > 0 && row.some((value) => value !== null && value !== "")) {
      return row;
    }
  }

  throw new Error("Feed rows were empty");
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Auralis-Ingest-Worker/1.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchSource(source) {
  const startedAt = Date.now();
  const rows = await fetchJson(source.url);
  const latestRow = getLatestDataRow(rows);

  return {
    ...rowToObject(source.columns, latestRow),
    fetched_at: new Date().toISOString(),
    latency_ms: Date.now() - startedAt,
    source_name: source.name,
    source_url: source.url,
  };
}

function buildNormalizedEntry(raw) {
  const plasmaTime = raw.plasma.time_tag ? new Date(raw.plasma.time_tag) : null;
  const magneticTime = raw.magnetic.time_tag ? new Date(raw.magnetic.time_tag) : null;
  const kpTime = raw.kp.time_tag ? new Date(raw.kp.time_tag) : null;

  const timestamps = [plasmaTime, magneticTime, kpTime].filter(Boolean);
  const observedAt = timestamps.length
    ? new Date(Math.max(...timestamps.map((date) => date.getTime())))
    : new Date();
  const ingestedAt = new Date();

  const entryKey = [
    raw.plasma.time_tag || "na",
    raw.magnetic.time_tag || "na",
    raw.kp.time_tag || "na",
  ].join("|");

  const quality = timestamps.length === 3 ? "good" : "partial";

  return {
    entry_key: entryKey,
    archive_date: getArchiveDate(observedAt),
    observed_at: observedAt.toISOString(),
    ingested_at: ingestedAt.toISOString(),
    source: "NOAA/SWPC",
    quality,
    omni2: {
      timestamp: observedAt.toISOString(),
      scalar_b: toNumber(raw.magnetic.bt),
      sw_plasma_speed: toNumber(raw.plasma.speed),
      sw_plasma_temperature: toNumber(raw.plasma.temperature),
      kp_index: toNumber(raw.kp.kp_index),
      source: "NOAA/SWPC",
      quality,
    },
    raw: {
      plasma: {
        time_tag: raw.plasma.time_tag,
        density: toNumber(raw.plasma.density),
        speed: toNumber(raw.plasma.speed),
        temperature: toNumber(raw.plasma.temperature),
        latency_ms: raw.plasma.latency_ms,
      },
      magnetic: {
        time_tag: raw.magnetic.time_tag,
        bx: toNumber(raw.magnetic.bx),
        by: toNumber(raw.magnetic.by),
        bz: toNumber(raw.magnetic.bz),
        bt: toNumber(raw.magnetic.bt),
        lon: toNumber(raw.magnetic.lon),
        lat: toNumber(raw.magnetic.lat),
        latency_ms: raw.magnetic.latency_ms,
      },
      kp: {
        time_tag: raw.kp.time_tag,
        kp_index: toNumber(raw.kp.kp_index),
        latency_ms: raw.kp.latency_ms,
      },
    },
  };
}

async function ensureArchiveDir() {
  await mkdir(ARCHIVE_DIR, { recursive: true });
}

async function loadLastArchivedEntryKey() {
  await ensureArchiveDir();

  const archivePath = getArchivePath(new Date());

  try {
    const content = await readFile(archivePath, "utf8");
    const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
    const lastLine = lines[lines.length - 1];

    if (!lastLine) {
      return "";
    }

    const parsed = JSON.parse(lastLine);
    return typeof parsed.entry_key === "string" ? parsed.entry_key : "";
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return "";
    }

    logError("Failed to read existing archive file", error);
    return "";
  }
}

async function appendEntryToArchive(entry) {
  await ensureArchiveDir();
  const archivePath = getArchivePath(new Date(entry.observed_at));
  await appendFile(archivePath, `${JSON.stringify(entry)}\n`, "utf8");
}

async function postToAuralis(payload) {
  const response = await fetch(`${APP_BASE_URL}/api/omni2/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ingest failed with ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function collectSources() {
  const [plasma, magnetic, kp] = await Promise.all([
    fetchSource(SOURCE_CONFIG.plasma),
    fetchSource(SOURCE_CONFIG.magnetic),
    fetchSource(SOURCE_CONFIG.kp),
  ]);

  return { plasma, magnetic, kp };
}

async function runWorkerCycle() {
  if (isRunning) {
    log("Skipping cycle because the previous poll is still running");
    return;
  }

  isRunning = true;

  try {
    const raw = await collectSources();
    const entry = buildNormalizedEntry(raw);

    if (entry.entry_key === lastArchivedEntryKey) {
      log(`No new stream sample yet for key ${entry.entry_key}`);
      return;
    }

    await postToAuralis(entry.omni2);
    await appendEntryToArchive(entry);

    lastArchivedEntryKey = entry.entry_key;

    log(`Stored entry ${entry.entry_key} in Postgres and ${entry.archive_date}.jsonl`);
  } catch (error) {
    logError("Worker cycle failed", error);
  } finally {
    isRunning = false;
  }
}

async function startWorker() {
  lastArchivedEntryKey = await loadLastArchivedEntryKey();

  log("NOAA stream worker starting", {
    poll_interval_ms: POLL_INTERVAL_MS,
    archive_dir: ARCHIVE_DIR,
    app_base_url: APP_BASE_URL,
  });

  await runWorkerCycle();
  setInterval(runWorkerCycle, POLL_INTERVAL_MS);
}

startWorker().catch((error) => {
  logError("Worker startup failed", error);
  process.exitCode = 1;
});
