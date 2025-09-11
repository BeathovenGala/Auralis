import TimeSeriesChart from '../TimeSeriesChart';

export default function TimeSeriesChartExample() {
  // todo: remove mock functionality - replace with real time series data
  const bzThresholds = [
    { value: -5, label: 'Warning', color: '#f59e0b' },
    { value: -10, label: 'Alert', color: '#ef4444' },
  ];

  const dstThresholds = [
    { value: -50, label: 'Minor Storm', color: '#f59e0b' },
    { value: -100, label: 'Moderate Storm', color: '#ef4444' },
  ];

  return (
    <div className="bg-background p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TimeSeriesChart
          title="IMF Bz Component"
          parameter="bz"
          unit="nT"
          thresholds={bzThresholds}
        />
        <TimeSeriesChart
          title="Solar Wind Speed"
          parameter="solar_wind_speed"
          unit="km/s"
        />
        <TimeSeriesChart
          title="Dst Index"
          parameter="dst"
          unit="nT"
          thresholds={dstThresholds}
        />
        <TimeSeriesChart
          title="Kp Index"
          parameter="kp"
          unit=""
        />
      </div>
    </div>
  );
}