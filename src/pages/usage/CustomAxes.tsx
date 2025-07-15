const CustomAxes = ({ xAxisMap, yAxisMap, offset, width, height }: any) => {
  const yTicks = yAxisMap?.[0]?.ticks ?? [0, 60, 120, 180, 240, 300];
  const xTicks = xAxisMap?.[0]?.ticks ?? [];

  return (
    <>
      {/* Y축 눈금선 및 라벨 */}
      {yTicks.map((tick: number, i: number) => {
        const y = yAxisMap[0].scale(tick);
        return (
          <g key={`y-tick-${i}`}>
            <line
              x1={offset.left}
              x2={width - offset.right}
              y1={y}
              y2={y}
              stroke="#E5E5E5"
              strokeDasharray="4 2"
            />
            <text
              x={offset.left - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={12}
              fill="#999"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* X축 라벨 */}
      {xTicks.map((tick: { value: string }, i: number) => {
        const scale = xAxisMap[0].scale as (val: string) => number;
        const bandSize = xAxisMap[0].bandSize ?? 0;
        const x = scale(tick.value) + bandSize / 2;
        const y = height - offset.bottom;

        return (
          <text
            key={`x-tick-${i}`}
            x={x}
            y={y + 16}
            textAnchor="start"
            fontSize={12}
            fill="#999"
          >
            {tick.value}
          </text>
        );
      })}
    </>
  );
};

export default CustomAxes;
