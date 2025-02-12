import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBSpinner,
  MDBBadge,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../services/jobService";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { JobData } from "../../types/job";

const CompanyJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCompanyJobs();
  }, [user?.profile_id]);

  const fetchCompanyJobs = async () => {
    if (!user?.profile_id) return;
    try {
      const response = await jobService.getByCompanyId(user.profile_id);
      setJobs(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to fetch company jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobService.deleteJob(jobId);
        toast.success("Job deleted successfully");
        fetchCompanyJobs();
      } catch (error) {
        toast.error("Failed to delete job");
        console.error("Error deleting job:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <MDBSpinner />
      </div>
    );
  }

  return (
    <MDBContainer className="py-5">
      <MDBCard>
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Job Postings</h2>
            <MDBBtn
              onClick={() => navigate("/jobs/create")}
              className="d-flex align-items-center"
            >
              <MDBIcon fas icon="plus" className="me-2" />
              Post New Job
            </MDBBtn>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-5">
              <MDBIcon
                far
                icon="folder-open"
                size="3x"
                className="text-muted mb-3"
              />
              <h5>No jobs posted yet</h5>
              <p className="text-muted">
                Start posting jobs to find the perfect candidates.
              </p>
            </div>
          ) : (
            <MDBRow className="g-4">
              {jobs.map((job) => (
                <MDBCol key={job.id} md="6" lg="4">
                  <MDBCard className="h-100">
                    <MDBCardBody>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="mb-0">{job.title}</h5>
                        <MDBBadge
                          color={
                            job.status === "ACTIVE" ? "success" : "warning"
                          }
                          pill
                        >
                          {job.status}
                        </MDBBadge>
                      </div>
                      {job.location && (
                        <p className="text-muted small mb-3">
                          <MDBIcon fas icon="map-marker-alt" className="me-2" />
                          {job.location}
                        </p>
                      )}
                      <p className="text-muted small mb-3">
                        <MDBIcon fas icon="clock" className="me-2" />
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-truncate mb-3">{job.description}</p>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {job.categories.map((category) => (
                          <MDBBadge
                            key={category.id}
                            color="info"
                            className="text-dark"
                          >
                            {category.name}
                          </MDBBadge>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between mt-auto">
                        <MDBBtn
                          color="link"
                          size="sm"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          View Details
                        </MDBBtn>
                        <div>
                          <MDBBtn
                            color="link"
                            size="sm"
                            onClick={() => navigate(`/jobs/edit/${job.id}`)}
                            className="me-2"
                          >
                            Edit
                          </MDBBtn>
                          <MDBBtn
                            color="link"
                            size="sm"
                            className="text-danger"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            Delete
                          </MDBBtn>
                        </div>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))}
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default CompanyJobsPage;
