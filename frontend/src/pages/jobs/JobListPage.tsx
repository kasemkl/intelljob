import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Job } from "../../types/job";

import { jobService } from "../../services/jobService";

import JobCard from "../../components/jobs/JobCard";

import { useAuth } from "../../contexts/AuthContext";

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBSpinner,
  MDBIcon,
  MDBTypography,
} from "mdb-react-ui-kit";

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getAllJobs();

        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <MDBContainer>
        <MDBCard className="shadow-0 border-0">
          <MDBCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <MDBTypography tag="h2" className="mb-1">
                  Available Jobs
                </MDBTypography>

                <p className="text-muted mb-0">
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
                </p>
              </div>

              {user?.role === "company" && (
                <MDBBtn
                  onClick={() => navigate("/jobs/create")}
                  className="d-flex align-items-center"
                  rounded
                >
                  <i className="bx bx-plus me-2"></i>
                  Post New Job
                </MDBBtn>
              )}
            </div>

            {jobs.length === 0 ? (
              <MDBCard className="text-center shadow-0 border">
                <MDBCardBody className="py-5">
                  <i className="bx bx-briefcase bx-lg text-muted mb-3"></i>

                  <MDBTypography tag="h4" className="mb-3">
                    No jobs available
                  </MDBTypography>

                  <p className="text-muted mb-0">
                    Check back later for new opportunities.
                  </p>
                </MDBCardBody>
              </MDBCard>
            ) : (
              <MDBRow className="g-4">
                {jobs.map((job) => (
                  <MDBCol key={job.id} md="6" lg="4">
                    <JobCard job={job} />
                  </MDBCol>
                ))}
              </MDBRow>
            )}
          </MDBCardBody>
        </MDBCard>

        {jobs.length > 0 && (
          <div className="text-center mt-4">
            <MDBBtn color="light" className="shadow-0">
              Load More Jobs
            </MDBBtn>
          </div>
        )}
      </MDBContainer>
    </div>
  );
};

export default JobListPage;
