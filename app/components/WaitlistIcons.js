/* #genai */
"use client";

// Glyphs for the curved input's icon slot. CurvedInput places these inside a
// group that is already translated and rotated onto the arc, so everything is
// drawn around the origin. Chip dimensions mirror the component's own maths.
export const chipSize = (barHeight) => {
  const chipH = Math.min(34, Math.max(16, barHeight * 0.34));
  return { chipH, chipW: chipH * 1.25 };
};

const Chip = ({ chipW, chipH, fill, children }) => (
  <>
    <rect
      x={-chipW / 2}
      y={-chipH / 2}
      width={chipW}
      height={chipH}
      rx={chipH * 0.27}
      fill={fill}
    />
    {children}
  </>
);

export const StepIcon = ({ step, barHeight, fill = "#c01018" }) => {
  const { chipW, chipH } = chipSize(barHeight);
  const ew = chipW * 0.5;
  const eh = chipH * 0.5;
  const sw = Math.max(1.1, chipH * 0.075);
  const stroke = {
    fill: "none",
    stroke: "#ffffff",
    strokeWidth: sw,
    strokeLinejoin: "round",
    strokeLinecap: "round",
  };

  if (step === "name") {
    return (
      <Chip chipW={chipW} chipH={chipH} fill={fill}>
        <circle cx={0} cy={-eh * 0.24} r={eh * 0.28} {...stroke} />
        <path
          d={`M ${-ew * 0.42} ${eh * 0.52} Q 0 ${-eh * 0.04} ${ew * 0.42} ${eh * 0.52}`}
          {...stroke}
        />
      </Chip>
    );
  }

  if (step === "phone") {
    return (
      <Chip chipW={chipW} chipH={chipH} fill={fill}>
        <rect
          x={-ew * 0.34}
          y={-eh * 0.66}
          width={ew * 0.68}
          height={eh * 1.32}
          rx={eh * 0.22}
          {...stroke}
        />
        <path d={`M ${-ew * 0.1} ${eh * 0.42} L ${ew * 0.1} ${eh * 0.42}`} {...stroke} />
      </Chip>
    );
  }

  if (step === "done") {
    return (
      <Chip chipW={chipW} chipH={chipH} fill={fill}>
        <path
          d={`M ${-ew * 0.42} ${eh * 0.02} L ${-ew * 0.08} ${eh * 0.4} L ${ew * 0.44} ${-eh * 0.42}`}
          {...stroke}
        />
      </Chip>
    );
  }

  return (
    <Chip chipW={chipW} chipH={chipH} fill={fill}>
      <rect x={-ew / 2} y={-eh / 2} width={ew} height={eh} rx={1.4} {...stroke} />
      <path
        d={`M ${-ew / 2} ${-eh / 2 + sw * 0.4} L 0 ${eh * 0.14} L ${ew / 2} ${-eh / 2 + sw * 0.4}`}
        {...stroke}
      />
    </Chip>
  );
};
