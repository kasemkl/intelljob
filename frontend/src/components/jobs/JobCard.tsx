import React from "react";

import { useNavigate } from "react-router-dom";

import { Job } from "../../types/job";

import {
  MDBCard,
  MDBCardBody,
  MDBBadge,
  MDBRipple,
  MDBTypography,
} from "mdb-react-ui-kit";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();

  return (
    <MDBCard
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="h-100 shadow-2-soft hover-shadow cursor-pointer"
    >
      <MDBRipple
        rippleColor="light"
        rippleTag="div"
        className="bg-image hover-overlay"
      >
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <MDBTypography tag="h5" className="card-title mb-0 text-truncate">
              {job.title}
            </MDBTypography>

            <MDBBadge color="success" pill className="ms-2">
              New
            </MDBBadge>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-buildings me-2 text-primary"></i>

              <small>{job.company_name}</small>
            </div>

            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-map me-2 text-primary"></i>

              <small>{job.location_name}</small>
            </div>

            <div className="d-flex align-items-center">
              <i className="bx bx-dollar-circle me-2 text-primary"></i>

              <small className="text-success fw-bold">
                ${job.salary.toLocaleString()}/year
              </small>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <small className="text-muted">
              Posted {new Date(job.posted_date).toLocaleDateString()}
            </small>

            <div className="d-flex align-items-center text-primary">
              <small className="fw-bold">View Details</small>

              <i className="bx bx-right-arrow-alt ms-1"></i>
            </div>
          </div>
        </MDBCardBody>
      </MDBRipple>
    </MDBCard>
  );
};

export default JobCard;
