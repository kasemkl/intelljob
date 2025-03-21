import React, { useEffect, useState } from "react";

import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBSpinner,
  MDBFile,
} from "mdb-react-ui-kit";

import { toast } from "react-toastify";

import useAxios from "../hooks/useAxios";

import PersonalInfo from "../components/PersonalInfo";

import locationService, { City } from "../services/locationService";

import "../styles/company-profile.css";
import defaultProfileImg from '../assets/default_profile_photo.jpg'
interface CompanyProfileData {
  user: number;

  profile_id: string;

  industry: string;

  company_size: number;

  location_id: number | null;

  location_details: City | null;
}

interface UserDetails {
  first_name: string;

  last_name: string;

  email: string;

  profile_picture?: File | null;
}

const CompanyProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [cities, setCities] = useState<City[]>([]);

  const api = useAxios();

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProfile(), fetchUserDetails(), fetchCities()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const fetchCities = async () => {
    try {
      const citiesData = await locationService.getAllCities();

      setCities(citiesData);
    } catch (error) {
      toast.error("Error fetching cities");

      console.error("Error fetching cities:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/api/users-management/users/${userId}/`);

      setUserDetails({
        first_name: response.data.first_name,

        last_name: response.data.last_name,

        email: response.data.email,

        profile_picture: response.data.profile_picture,
      });
    } catch (error) {
      toast.error("Error fetching user details");

      console.error("Error fetching user details:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get<CompanyProfileData>(
        `/api/users-management/companiesByUserId/${userId}/`
      );

      if (response.data.location_id) {
        const cityDetails = cities.find(
          (city) => city.id === response.data.location_id
        );
        response.data.location_details = cityDetails || null;
      }

      setProfile(response.data);
    } catch (error: any) {
      toast.error("Error fetching company profile");
      console.error("Error fetching company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (!profile) return;

    if (
      name.includes("first_name") ||
      name.includes("last_name") ||
      name.includes("email")
    ) {
      setUserDetails((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          [name]: value,
        };
      });
    } else {
      setProfile((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          [name]: name === "company_size" ? parseInt(value) || 0 : value,
        };
      });
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = parseInt(e.target.value);

    const selectedCity = cities.find((city) => city.id === locationId);

    setProfile((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        location_id: locationId || null,

        location_details: selectedCity
          ? {
              id: selectedCity.id,

              name: selectedCity.name,

              country: selectedCity.country,

              country_name: selectedCity.country_name,
            }
          : null,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserDetails((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profile_picture: file,
        };
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (userDetails) {
        formData.append("first_name", userDetails.first_name);
        formData.append("last_name", userDetails.last_name);
        formData.append("email", userDetails.email);
        formData.append("role", "company");
        if (userDetails.profile_picture) {
          formData.append("profile_picture", userDetails.profile_picture);
        }

        await api.put(`/api/users-management/users/${userId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (profile) {
        const profileData = {
          user: userId,
          profile_id: profile.profile_id,
          industry: profile.industry || "",
          company_size: profile.company_size || 0,
          location_id: profile.location_id,
        };

        const response = await api.put(
          `/api/users-management/companiesByUserId/${userId}/`,
          profileData
        );

        if (response.status === 200) {
          const updatedProfile = response.data;
          if (updatedProfile.location_id) {
            const cityDetails = cities.find(
              (city) => city.id === updatedProfile.location_id
            );
            updatedProfile.location_details = cityDetails || null;
          }
          setProfile(updatedProfile);
          toast.success("Profile updated successfully");
          setIsEditing(false);
        }
      }
    } catch (error: any) {
      toast.error("Error updating profile");
      console.error("Error updating company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <MDBSpinner />
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="company-profile">
      <div className="profile-header mb-4">
        <h4 className="profile-title">Company Profile</h4>

        <div className="profile-actions">
          <MDBBtn
            color={isEditing ? "danger" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
            className="me-2 edit-btn"
          >
            <i className={`fas ${isEditing ? "fa-times" : "fa-edit"} me-2`}></i>

            {isEditing ? "Cancel" : "Edit Profile"}
          </MDBBtn>

          {isEditing && (
            <MDBBtn color="success" onClick={handleSave} className="save-btn">
              <i className="fas fa-save me-2"></i>
              Save Changes
            </MDBBtn>
          )}
        </div>
      </div>

      <PersonalInfo
        userDetails={userDetails}
        isEditing={isEditing}
        onInputChange={handleInputChange}
      />

      {/* <MDBCard className="mt-4 info-card">
        <MDBCardBody>
          <h5 className="info-section-title">
            <i className="fas fa-user-circle me-2"></i>
            Profile Picture
          </h5>
          {isEditing ? (
            <MDBFile
              label="Choose a profile picture"
              onChange={handleFileChange}
            />
          ) : (
            <img
              src={userDetails?.profile_picture || defaultProfileImg}
              alt="Profile"
              className="profile-picture"
            />
          )}
        </MDBCardBody>
      </MDBCard> */}

      <MDBCard className="mt-4 info-card">
        <MDBCardBody>
          <h5 className="info-section-title">
            <i className="fas fa-building me-2"></i>
            Company Information
          </h5>

          <div className="info-grid">
            <MDBRow>
              <MDBCol md="6">
                <div className="info-field">
                  <label className="info-label">
                    <i className="fas fa-industry me-2"></i>
                    Industry
                  </label>

                  {isEditing ? (
                    <div className="form-outline">
                      <input
                        type="text"
                        className="form-control info-input"
                        name="industry"
                        value={profile?.industry || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <div className="info-value">
                      {profile?.industry || "Not specified"}
                    </div>
                  )}
                </div>
              </MDBCol>

              <MDBCol md="6">
                <div className="info-field">
                  <label className="info-label">
                    <i className="fas fa-users me-2"></i>
                    Company Size
                  </label>

                  {isEditing ? (
                    <div className="form-outline">
                      <input
                        type="number"
                        className="form-control info-input"
                        name="company_size"
                        value={profile?.company_size || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <div className="info-value">
                      {profile?.company_size
                        ? `${profile.company_size} employees`
                        : "Not specified"}
                    </div>
                  )}
                </div>
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md="12">
                <div className="info-field">
                  <label className="info-label">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Location
                  </label>

                  {isEditing ? (
                    <select
                      className="form-select info-select"
                      name="location_id"
                      value={profile?.location_id || ""}
                      onChange={handleLocationChange}
                    >
                      <option value="">Select Location</option>

                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}, {city.country_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="info-value location-value">
                      {profile?.location_details ? (
                        <>
                          {/* <i className="fas fa-map-marker-alt me-2"></i> */}
                          {profile.location_details.name},{" "}
                          {profile.location_details.country_name}
                        </>
                      ) : (
                        <span className="text-muted">No location set</span>
                      )}
                    </div>
                  )}
                </div>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default CompanyProfile;
