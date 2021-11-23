/**
 * All possible errors.
 */
module.exports = {
  /**
   * Module hasn't been initiated. Call {@link Geocoder}.
   */
  NOT_INITIATED: 0,

  /**
   * Parameters are invalid.
   */
  INVALID_PARAMETERS: 1,

  /**
   * Error wile fetching to server.
   * The error.origin property contains the original fetch error.
   */
  FETCHING: 2,

  /**
   * Error while parsing server response.
   * The error.origin property contains the response.
   */
  PARSING: 3,

  /**
   * Error from the server.
   * The error.origin property contains the response's body.
   */
  SERVER: 4,
};
