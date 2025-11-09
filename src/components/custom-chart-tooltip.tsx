"use client";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: number) => string;
}

export function CustomChartTooltip({
  active,
  payload,
  label,
  formatter = (value) => value.toString(),
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg animate-in fade-in zoom-in duration-200">
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">
                {entry.name}:
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: entry.color }}>
              {formatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
