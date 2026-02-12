export const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    width="12"
    height="18"
    viewBox="0 0 6 9"
    fill="none"
    style={{
      transform: direction === "right" ? "rotate(180deg)" : "none",
    }}
  >
    <path
      d="M0.0898415 3.90144L4.54723 0.186954C5.06829 -0.247263 5.85938 0.123261 5.85938 0.801532V7.38546C5.85938 8.06374 5.06829 8.43426 4.54723 8.00004L0.0898414 4.28555C-0.0300971 4.1856 -0.030097 4.00139 0.0898415 3.90144Z"
      fill="#717171"
    />
  </svg>
);
