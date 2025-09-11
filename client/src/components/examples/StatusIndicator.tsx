import StatusIndicator from '../StatusIndicator';

export default function StatusIndicatorExample() {
  return (
    <div className="bg-background p-6 space-y-6">
      <div className="flex gap-4">
        <StatusIndicator level="normal" scale="R" value={0} description="Quiet" size="lg" />
        <StatusIndicator level="elevated" scale="S" value={1} description="Minor" size="lg" />
        <StatusIndicator level="high" scale="G" value={2} description="Moderate" size="lg" />
        <StatusIndicator level="severe" scale="R" value={3} description="Strong" size="lg" />
        <StatusIndicator level="extreme" scale="S" value={4} description="Severe" size="lg" />
      </div>
    </div>
  );
}