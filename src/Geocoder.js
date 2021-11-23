const Errors = require("./Errors");
const { toQueryParams, formatQueryParams } = require("./utils/functions");

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

    queryParams = {
      key: this.apiKey,
      ...this.options,
      ...queryParams,
      ...formatQueryParams(queryParams, params),
    };
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
