export const getEffectiveColor = (
  colorOverride?: undefined | string | (() => string)
) => {
  if (!colorOverride) {
    return colorOverride;
  }

  if (typeof colorOverride === "string") {
    return colorOverride;
  }

  return colorOverride();
};

export const getEffectiveRadius = (
  radiusOverride?: number | (() => number)
) => {
  if (!radiusOverride || typeof radiusOverride === "number") {
    return radiusOverride;
  }

  return radiusOverride();
};
