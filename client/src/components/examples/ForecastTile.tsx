import ForecastTile from '../ForecastTile';
import { addDays } from "date-fns";

export default function ForecastTileExample() {
  const baseDate = new Date();
  
  // todo: remove mock functionality - replace with real forecast data
  const mockForecasts = [
    { scale: 'R' as const, low: 15, medium: 5, high: 1 },
    { scale: 'S' as const, low: 10, medium: 2, high: 0 },
    { scale: 'G' as const, low: 25, medium: 8, high: 2 },
  ];

  return (
    <div className="bg-background p-6">
      <div className="grid grid-cols-3 gap-4 max-w-4xl">
        <ForecastTile
          day={1}
          date={addDays(baseDate, 1)}
          forecasts={mockForecasts}
          confidence="high"
          trend="up"
        />
        <ForecastTile
          day={2}
          date={addDays(baseDate, 2)}
          forecasts={[
            { scale: 'R', low: 20, medium: 8, high: 2 },
            { scale: 'S', low: 15, medium: 4, high: 1 },
            { scale: 'G', low: 30, medium: 12, high: 4 },
          ]}
          confidence="medium"
          trend="stable"
        />
        <ForecastTile
          day={3}
          date={addDays(baseDate, 3)}
          forecasts={[
            { scale: 'R', low: 10, medium: 3, high: 0 },
            { scale: 'S', low: 8, medium: 2, high: 0 },
            { scale: 'G', low: 18, medium: 6, high: 1 },
          ]}
          confidence="low"
          trend="down"
        />
      </div>
    </div>
  );
}