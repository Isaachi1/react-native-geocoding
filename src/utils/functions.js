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

function formatQueryParams(queryParams, params) {
  // (latitude, longitude)
  if (!isNaN(params[0]) && !isNaN(params[1]))
    queryParams = { latlng: `${params[0]},${params[1]}` };

  // [latitude, longitude]
  if (params[0] instanceof Array)
    queryParams = { latlng: `${params[0][0]},${params[0][1]}` };

  // {latitude, longitude}  or {lat, lng}
  if (params[0] instanceof Object)
    queryParams = {
      latlng: `${params[0].lat || params[0].latitude},${
        params[0].lng || params[0].longitude
      }`,
    };

  // address, {bounds: {northeast: {lat, lng}, southwest: {lan, lng}}}
  if (typeof params[0] === "string" && params[1] instanceof Object)
    queryParams = { address: params[0], bounds: params[1] };

  // address
  if (typeof params[0] === "string") queryParams = { address: params[0] };

  // --- start geocoding ---

  // check query params
  if (!queryParams)
    // no query params, means parameters where invalid
    throw {
      code: Errors.INVALID_PARAMETERS,
      message: "Invalid parameters : \n" + JSON.stringify(params, null, 2),
    };

  return queryParams;
}

module.exports = {
  encodeBounds,
  encodeComponent,
  toQueryParams,
  formatQueryParams,
};
