import SpaceWeatherTile from '../SpaceWeatherTile';

export default function SpaceWeatherTileExample() {
  return (
    <div className="bg-background p-6">
      <div className="grid grid-cols-3 gap-4 max-w-4xl">
        <SpaceWeatherTile
          scale="R"
          title="Radio Blackouts"
          current={{
            level: "elevated",
            value: 1,
            description: "Minor"
          }}
          past24h={{
            max: 2,
            events: 3
          }}
        />
        <SpaceWeatherTile
          scale="S"
          title="Radiation Storms"
          current={{
            level: "normal",
            value: 0,
            description: "None"
          }}
          past24h={{
            max: 1,
            events: 1
          }}
        />
        <SpaceWeatherTile
          scale="G"
          title="Geomagnetic Storms"
          current={{
            level: "high",
            value: 3,
            description: "Strong"
          }}
          past24h={{
            max: 3,
            events: 2
          }}
        />
      </div>
    </div>
  );
}