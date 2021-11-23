const Errors = require("./Errors");
const { toQueryParams } = require("./utils/functions");

/**
 * Module to use google's geocoding & reverse geocoding.
 */
class Geocoder {
  /**
   * Initialize the module.
   * @param {String} apiKey The api key of your application in google.
   * @param {Object} [options] extra options for your geocoding request.
   * @see https://developers.google.com/maps/documentation/geocoding/intro#geocoding
   */
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.options = options;
  }

  /**
   * @returns {boolean} True if the module has been initiated. False otherwise.
   */
  get isInit() {
    return !!this.apiKey;
  }

  /**
   * Do <a href="https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding">(reverse) geocoding</a>, converting geographic coordinates into a human-readable address & vice-versa.
   * Accepted parameters:
   * <ul>
   *     <li>from(Number latitude, Number longitude)</li>
   *     <li>from(Array [latitude, longitude])</li>
   *     <li>from(Object {latitude, longitude})</li>
   *     <li>from(Object {lat, lng})</li>
   *     <li>from(String address)</li>
   * </ul>
   * @returns {Promise.<Object>} Object containing informations about the place at the coordinates.
   * @see https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses
   */
  async from(...params) {
    // check api key
    if (!this.isInit)
      throw {
        code: Errors.NOT_INITIATED,
        message:
          "Geocoder isn't initialized. Call Geocoder.init function (only once), passing it your app's api key as parameter.",
      };

    // --- convert parameters ---
    let queryParams;

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

    queryParams = { key: this.apiKey, ...this.options, ...queryParams };
    // build url
    const url = `https://maps.google.com/maps/api/geocode/json?${toQueryParams(
      queryParams
    )}`;

    let response, data;

    // fetch
    try {
      response = await fetch(url);
    } catch (error) {
      throw {
        code: Errors.FETCHING,
        message: "Error while fetching. Check your network.",
        origin: error,
      };
    }

    // parse
    try {
      data = await response.json();
    } catch (error) {
      throw {
        code: Errors.PARSING,
        message:
          "Error while parsing response's body into JSON. The response is in the error's 'origin' field. Try to parse it yourself.",
        origin: response,
      };
    }

    // check response's data
    if (data.status !== "OK")
      throw {
        code: Errors.SERVER,
        message:
          "Error from the server while geocoding. The received datas are in the error's 'origin' field. Check it for more informations.",
        origin: data,
      };

    return data;
  }
}

module.exports = Geocoder;
