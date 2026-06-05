export const format1 = (n: number) =>
  Number.isFinite(n) ? n.toFixed(1) : "--";
export const format0 = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toString() : "--";
