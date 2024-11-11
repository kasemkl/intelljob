import locationApi from "./api/locationApi";

export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  name: string;
  country: number;
  country_name: string;
}

class LocationService {
  async getAllCountries(): Promise<Country[]> {
    const response = await locationApi.get("/locations/countries/");
    return response.data;
  }

  async getCountry(id: number): Promise<Country> {
    const response = await locationApi.get(`/locations/countries/${id}/`);
    return response.data;
  }

  async getAllCities(): Promise<City[]> {
    const response = await locationApi.get("/locations/cities/");
    return response.data;
  }

  async getCitiesByCountry(countryId: number): Promise<City[]> {
    const response = await locationApi.get(
      `/locations/cities/?country=${countryId}`
    );
    return response.data;
  }

  async getCity(id: number): Promise<City> {
    const response = await locationApi.get(`/locations/cities/${id}/`);
    return response.data;
  }
}

export default new LocationService();
