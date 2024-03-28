export const roundToTwoDecimalPlaces = (mark: number) =>
    Math.round((mark + Number.EPSILON) * 100) / 100;
