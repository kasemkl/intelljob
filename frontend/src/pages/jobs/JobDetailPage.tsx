import React, { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { jobService } from "../../services/jobService";

import { Job } from "../../types/job";

import { toast } from "react-toastify";

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBBadge,
  MDBRow,
  MDBCol,
  MDBSpinner,
} from "mdb-react-ui-kit";

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<Job | null>(null);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;

        const response = await jobService.getJob(parseInt(id));

        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);

        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  if (!job) {
    return (
      <MDBContainer className="py-5">
        <MDBCard>
          <MDBCardBody className="text-center">
            <h3>Job not found</h3>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    );
  }

  return (
    <div className="bg-light py-5">
      <MDBContainer>
        <MDBBtn
          color="link"
          className="mb-4 p-0"
          onClick={() => navigate("/jobs")}
        >
          <i className="bx bx-left-arrow-alt me-2"></i>
          Back to Jobs
        </MDBBtn>

        <MDBCard>
          <MDBCardBody>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="mb-2">{job.title}</h2>

                <div className="text-muted">
                  <span className="fw-bold">{job.company_name}</span>

                  <span className="mx-2">•</span>

                  <span>{job.location_name}</span>
                </div>
              </div>

              <MDBBadge color="success" pill>
                ${job.salary.toLocaleString()}/year
              </MDBBadge>
            </div>

            <MDBRow className="g-4 mb-4">
              <MDBCol md="4">
                <MDBCard className="h-100">
                  <MDBCardBody className="d-flex align-items-center">
                    <i className="bx bx-briefcase text-primary me-2"></i>

                    <span>Full Time</span>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="4">
                <MDBCard className="h-100">
                  <MDBCardBody className="d-flex align-items-center">
                    <i className="bx bx-map text-primary me-2"></i>

                    <span>{job.location_name}</span>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="4">
                <MDBCard className="h-100">
                  <MDBCardBody className="d-flex align-items-center">
                    <i className="bx bx-dollar-circle text-primary me-2"></i>

                    <span>${job.salary.toLocaleString()}/year</span>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>

            <div className="mb-4">
              <h4 className="mb-3">Description</h4>

              <div className="text-muted">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="mb-3">Requirements</h4>

              <div className="text-muted">
                {job.requirements.split("\n").map((requirement, index) => (
                  <p key={index}>{requirement}</p>
                ))}
              </div>
            </div>

            <div className="border-top pt-4 d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Posted on {new Date(job.posted_date).toLocaleDateString()}
              </small>

              <MDBBtn>Apply Now</MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default JobDetailPage;
