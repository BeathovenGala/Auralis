import 'dotenv/config';

// Use the standard fetch API available in Node.js 18+
async function fetchNOAAData() {
  console.log(`[Worker] Fetching real-time data from NOAA...`);

  try {
    // Fetch solar wind plasma data (speed, temperature, density)
    // Provides an array of arrays: [time_tag, density, speed, temperature]
    const plasmaResponse = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json');
    const plasmaData = await plasmaResponse.json();
    
    // Fetch magnetic field data (bt, bz, etc.)
    // Provides an array of arrays: [time_tag, bx, by, bz, lon, lat, bt]
    const magResponse = await fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json');
    const magData = await magResponse.json();

    // Fetch Kp index data
    const kpResponse = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
    const kpData = await kpResponse.json();

    // The first element of these arrays are the column headers.
    // The last element is the most recent data point.

    const latestPlasma = plasmaData[plasmaData.length - 1]; // [time_tag, density, speed, temperature]
    const latestMag = magData[magData.length - 1]; // [time_tag, bx, by, bz, lon, lat, bt]
    const latestKp = kpData[kpData.length - 1]; // [time_tag, kp]

    // Construct the payload mapping NOAA data to Auralis schema
    // Note: Dst index is not provided directly in real-time by NOAA in a simple JSON format.
    // We will leave it undefined/null or proxy it if necessary, but the schema allows it to be optional.
    
    // We must ensure the values are valid numbers.
    const payload = {
      timestamp: new Date(latestPlasma[0]), // Using plasma time tag as primary
      scalar_b: latestMag && latestMag[6] !== null ? parseFloat(latestMag[6]) : null,
      sw_plasma_speed: latestPlasma && latestPlasma[2] !== null ? parseFloat(latestPlasma[2]) : null,
      sw_plasma_temperature: latestPlasma && latestPlasma[3] !== null ? parseFloat(latestPlasma[3]) : null,
      kp_index: latestKp && latestKp[1] !== null ? parseFloat(latestKp[1]) : null,
      source: "NOAA/SWPC",
      quality: "good"
    };

    console.log(`[Worker] Prepared payload:`, payload);

    return payload;
  } catch (error) {
    console.error(`[Worker] Error fetching data from NOAA:`, error.message);
    return null;
  }
}

async function postToAuralis(payload) {
  if (!payload) return;

  const port = process.env.PORT || "5000";
  const url = `http://localhost:${port}/api/omni2/ingest`;

  console.log(`[Worker] Sending POST request to ${url}...`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`[Worker] Successfully posted data to Auralis:`, result);
    } else {
      const errorText = await response.text();
      console.error(`[Worker] Failed to post data to Auralis. Status: ${response.status}. Error: ${errorText}`);
    }
  } catch (error) {
    console.error(`[Worker] Error connecting to local Auralis instance:`, error.message);
  }
}

async function runWorker() {
  const payload = await fetchNOAAData();
  await postToAuralis(payload);
}

// Run immediately on start
runWorker();

// Then run periodically (e.g. every 30 minutes = 30 * 60 * 1000 ms)
const THIRTY_MINUTES = 30 * 60 * 1000;
setInterval(runWorker, THIRTY_MINUTES);

console.log(`[Worker] NOAA Data Ingestion Worker started. Polling every 30 minutes.`);
