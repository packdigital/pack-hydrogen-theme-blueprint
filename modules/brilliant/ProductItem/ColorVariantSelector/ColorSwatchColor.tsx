export function ColorSwatchColor({colorSwatch}: {colorSwatch: string[]}) {
  return (
    <div className="relative size-6 shrink-0 overflow-hidden rounded-full border border-gray-200">
      <div className="flex size-full">
        {colorSwatch.map((color, idx) => (
          <div
            key={`${color}-${idx}`}
            className="h-full"
            style={{
              backgroundColor: color,
              width: `${100 / colorSwatch.length}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
