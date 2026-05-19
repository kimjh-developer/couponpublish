export const BASE_W = 1054;
export const BASE_H = 1492;

export const buildCouponCode = (prefix: string, index: number) =>
  `${prefix}-${index}`;

export const isValidCouponIndex = (
  index: number,
  startIndex: number,
  total: number,
) =>
  Number.isInteger(index) &&
  index >= startIndex &&
  index < startIndex + total;

export const allCouponIndices = (startIndex: number, total: number): number[] =>
  Array.from({ length: total }, (_, i) => startIndex + i);
