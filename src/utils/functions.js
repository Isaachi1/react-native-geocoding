/**
 * Encodes a bounds object into a URL encoded-string.
 */
function encodeBounds(bounds) {
  const { southwest, northeast } = bounds;
  return `${encodeURIComponent(southwest.lat)},${encodeURIComponent(
    southwest.lng
  )}|${encodeURIComponent(northeast.lat)},${encodeURIComponent(northeast.lng)}`;
}

/**
 * Encodes a component so it can be used safely inside a URL.
 */
function encodeComponent(key, value) {
  if (key === "bounds") return encodeBounds(value);
  return encodeURIComponent(value);
}

/**
 * Convert an object into query parameters.
 * @param {Object} object Object to convert.
 * @returns {string} Encoded query parameters.
 */
function toQueryParams(object) {
  return Object.keys(object)
    .filter((key) => !!object[key])
    .map((key) => key + "=" + encodeComponent(key, object[key]))
    .join("&");
}

module.exports = { encodeBounds, encodeComponent, toQueryParams };
