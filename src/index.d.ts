declare module "react-native-geocoding" {
  export interface LatLng {
    lat: number;
    lng: number;
  }

  export interface PlusCode {
    compound_code: string;
    global_code: string;
  }

  export interface GeocoderResponse {
    plus_code: PlusCode;
    results: {
      address_components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[];
      formatted_address: string;
      geometry: {
        bounds: {
          northeast: LatLng;
          southwest: LatLng;
        };
        location: LatLng;
        location_type: "APPROXIMATE" | "ROOFTOP" | string;
        viewport: {
          northeast: LatLng;
          southwest: LatLng;
        };
      };
      place_id: string;
      types: string[];
      plus_code: PlusCode;
    }[];
    status: "OK" | string;
  }

  type fromParams =
    | number
    | number[]
    | LatLng
    | { latitude: number; longitude: number }
    | string;

  class Geocoder {
    constructor(apiKey: string, options?: Object);
    isInit(): boolean;
    from(...params: fromParams[]): Promise<GeocoderResponse>;
  }

  export default Geocoder;
}
