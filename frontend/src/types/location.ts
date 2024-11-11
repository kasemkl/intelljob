// Location model based on backend structure
export interface Location {
  id: number; // Unique identifier for the location
  city: string; // City name
  state: string; // State name
  country: string; // Country name
  createdAt: string; // Date of location entry creation
  updatedAt: string; // Date of last update
}
