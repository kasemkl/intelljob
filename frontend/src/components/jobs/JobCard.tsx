import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBBadge,
  MDBRipple,
  MDBTypography,
  MDBIcon,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { Job } from "../../types/job";
import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import { Company } from "../../types/company";
import locationService from "../../services/locationService";
import { City } from "../../services/locationService";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = React.memo(({ job }) => {
  const navigate = useNavigate();
  const api = useAxios();
  const [company, setCompany] = useState<Company | null>(null);
  const [location, setLocation] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isSubscribed = true;

    const fetchDetails = async () => {
      try {
        const [companyRes, locationData] = await Promise.all([
          api.get(`/api/users-management/companiesByCompanyId/${job.companyId}/`, {
            signal: controller.signal
          }),
          locationService.getCity(job.locationId)
        ]);
        
        if (isSubscribed) {
          setCompany(companyRes.data);
          setLocation(locationData);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error("Error fetching details:", error);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [job.companyId, job.locationId]);

  if (loading) {
    return <MDBCard className="h-100 shadow-3">
      <MDBCardBody className="d-flex justify-content-center align-items-center">
        <MDBSpinner size="sm" />
      </MDBCardBody>
    </MDBCard>;
  }

  // Format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format salary range
  const formatSalaryRange = (range: string) => {
    return range.replace("-", " - $").startsWith("$") ? range : `$${range}`;
  };

  return (
    <MDBCard
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="h-100 shadow-3 hover-shadow cursor-pointer"
    >
      <MDBRipple
        rippleColor="light"
        rippleTag="div"
        className="bg-image hover-overlay"
      >
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <MDBTypography tag="h5" className="text-truncate" color="primary">
              {job.title}
            </MDBTypography>
            {job.status === "ACTIVE" && (
              <MDBBadge color="success" pill>
                Active
              </MDBBadge>
            )}
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <MDBIcon fas icon="building" className="me-2 text-primary" />
              <small className="text-muted">
                {company ? company.profile_id : "Loading..."}
                {company?.industry && ` • ${company.industry}`}
              </small>
            </div>

            <div className="d-flex align-items-center mb-2">
              <MDBIcon
                fas
                icon="map-marker-alt"
                className="me-2 text-primary"
              />
              <small className="text-muted">
                {location
                  ? `${location.name}, ${location.country_name}`
                  : "Loading..."}
              </small>
            </div>

            <div className="d-flex align-items-center">
              <MDBIcon fas icon="dollar-sign" className="me-2 text-success" />
              <small className="text-success fw-bold">
                {formatSalaryRange(job.salaryRange)}
              </small>
            </div>

            {job.categories.length > 0 && (
              <div className="d-flex align-items-center mt-2 flex-wrap gap-1">
                {job.categories.map((category) => (
                  <MDBBadge
                    key={category.id}
                    color="info"
                    className="me-1"
                    style={{color:'var(--text-light)!important'}}
                  >
                    {category.name}
                  </MDBBadge>
                ))}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <small className="text-muted">
              Posted {formatDate(job.createdAt)}
            </small>
            <div className="d-flex align-items-center text-primary">
              <small
                className="fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                View Details
              </small>
              <MDBIcon fas icon="arrow-right" className="ms-1" />
            </div>
          </div>
        </MDBCardBody>
      </MDBRipple>
    </MDBCard>
  );
});

export default JobCard;
