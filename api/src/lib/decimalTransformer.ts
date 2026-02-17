import { ValueTransformer } from "typeorm";

export const decimalTransformer: ValueTransformer = {
  to: (value: number | string | null | undefined) => {
    if (value === null || value === undefined) {
      return value;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  },
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) {
      return 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  },
};
