import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBSelect,
} from "mdb-react-ui-kit";
import locationService, { City } from "../services/locationService";

interface CompanyInfoProps {
  companyDetails: {
    industry: string;
    company_size: number;
    location_id: number;
  };
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({
  companyDetails,
  isEditing,
  onInputChange,
}) => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await locationService.getAllCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <MDBCard>
      <MDBCardBody>
        <h5 className="mb-4">Company Information</h5>
        <MDBRow>
          <MDBCol md="6">
            <MDBInput
              label="Industry"
              name="industry"
              value={companyDetails.industry}
              onChange={onInputChange}
              disabled={!isEditing}
              className="mb-4"
            />
          </MDBCol>
          <MDBCol md="6">
            <MDBInput
              label="Company Size"
              name="company_size"
              type="number"
              value={companyDetails.company_size}
              onChange={onInputChange}
              disabled={!isEditing}
              className="mb-4"
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12">
            <select
              name="location_id"
              value={companyDetails.location_id}
              onChange={onInputChange}
              disabled={!isEditing}
              className="form-select mb-4"
            >
              <option value="">Select Location</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country_name}
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
};

export default CompanyInfo;
