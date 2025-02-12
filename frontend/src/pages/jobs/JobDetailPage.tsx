import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/jobService";
import { Job } from "../../types/job";
import { toast } from "react-toastify";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBadge,
  MDBBtn,
  MDBTypography,
  MDBSpinner,
} from "mdb-react-ui-kit";
import useAxios from "../../hooks/useAxios";
import { Company } from "../../types/company";
import locationService from "../../services/locationService";
import { useApplicationService } from "../../services/applicationService";
import { useAuth } from "../../contexts/AuthContext";
import cvParsingApi from "../../services/api/cvParsingApi";
import { Pie, Cell, Tooltip, Legend } from "recharts";
import MyPieChart from "./../../ui/MyPieChart";
import { City } from "../../types/city";

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [location, setLocation] = useState<City | null>(null);
  const api = useAxios();
  const { user } = useAuth();
  const applicationService = useApplicationService();
  const [applying, setApplying] = useState(false);
  const [similarity, setSimilarity] = useState<number | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const jobResponse = await jobService.getJob(parseInt(id));
        setJob(jobResponse.data as Job);

        // Fetch company and location details
        const [companyRes, locationData] = await Promise.all([
          api.get(
            `/api/users-management/companiesByCompanyId/${jobResponse.data.companyId}/`
          ),
          locationService.getCity(jobResponse.data.locationId),
        ]);

        setCompany(companyRes.data);
        setLocation(locationData);

        // Fetch embeddings and calculate similarity using cvParsingApi
        const jobSeekerEmbeddingResponse = await cvParsingApi.post(
          "/generate-embedding/",
          {
            text: "job seeker profile data here", // Replace with actual data
          }
        );
        const jobEmbeddingResponse = await cvParsingApi.post(
          "/generate-embedding/",
          {
            text: jobResponse.data.description, // Use job description
          }
        );
        const similarityResponse = await cvParsingApi.post(
          "/calculate-similarity/",
          {
            jobSeeker_embedding: jobSeekerEmbeddingResponse.data.embedding,
            job_embedding: jobEmbeddingResponse.data.embedding,
          }
        );
        setSimilarity(similarityResponse.data.similarity_percentage);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user?.user_id || !job?.id) {
      toast.error("Please log in to apply");
      return;
    }

    try {
      setApplying(true);
      await applicationService.applyForJob(job.id, user.user_id, similarity);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

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
            <MDBTypography tag="h4">Job not found</MDBTypography>
            <MDBBtn
              className="secondary-button"
              onClick={() => navigate("/jobs")}
            >
              Back to Jobs
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    );
  }

  // Format salary range
  const formatSalaryRange = (range: string) => {
    return range.replace("-", " - $").startsWith("$") ? range : `$${range}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const pieData = [
    { name: "Match", value: similarity || 0 },
    { name: "Remaining", value: 100 - (similarity || 0) },
  ];

  const COLORS = ["var(--button-primary)", "#bcbec0ff"];

  return (
    <MDBContainer className="py-5">
      <MDBCard className="shadow-0">
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <MDBTypography tag="h2" className="mb-1">
                {job.title}
              </MDBTypography>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">
                  Posted {formatDate(job.postDate)}
                </small>
                {job.status === "ACTIVE" && (
                  <MDBBadge color="success" pill>
                    Active
                  </MDBBadge>
                )}
              </div>
            </div>
            <MDBBtn
              className="secondary-button"
              onClick={() => navigate("/jobs")}
            >
              Back to Jobs
            </MDBBtn>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div className="d-flex align-items-center mb-2">
                <i className="bx bx-buildings me-2 text-primary"></i>
                <span>
                  {company ? (
                    <>
                      {company.profile_id}
                      {company.industry && ` • ${company.industry}`}
                      {company.company_size &&
                        ` • ${company.company_size} employees`}
                    </>
                  ) : (
                    "Loading company details..."
                  )}
                </span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <i className="bx bx-map me-2 text-primary"></i>
                <span>
                  {location
                    ? `${location.name}, ${location.country_name}`
                    : "Loading location details..."}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bx bx-dollar-circle me-2 text-primary"></i>
                <span className="text-success fw-bold">
                  {formatSalaryRange(job.salaryRange)}
                </span>
              </div>
            </div>
            {similarity !== null && (
              <div className="text-center">
                <MDBTypography tag="h5" className="mb-3">
                  Profile Match
                </MDBTypography>
                <MyPieChart
                  data={pieData}
                  COLORS={COLORS}
                  width={150}
                  height={150}
                />
              </div>
            )}
          </div>

          {job.categories.length > 0 && (
            <div className="mb-4">
              <MDBTypography tag="h5" className="mb-3">
                Categories
              </MDBTypography>
              <div className="d-flex flex-wrap gap-2">
                {job.categories.map((category) => (
                  <MDBBadge
                    key={category.id}
                    color="light"
                    className="text-dark"
                  >
                    {category.name}
                  </MDBBadge>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <MDBTypography tag="h5" className="mb-3">
              Description
            </MDBTypography>
            <div className="mb-4">
              <p className="text-muted">{job.description}</p>
            </div>
          </div>

          {job.requirements.length > 0 && (
            <div className="mb-4">
              <MDBTypography tag="h5" className="mb-3">
                Requirements
              </MDBTypography>
              <ul className="list-unstyled">
                {job.requirements.map((req, index) => (
                  <li key={index} className="mb-2">
                    <i className="bx bx-check-circle me-2 text-success"></i>
                    {req.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 text-center">
            {user?.role === "job_seeker" && (
              <MDBBtn color="primary" onClick={handleApply} disabled={applying}>
                {applying ? (
                  <>
                    <MDBSpinner size="sm" className="me-2" />
                    Applying...
                  </>
                ) : (
                  "Apply Now"
                )}
              </MDBBtn>
            )}
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default JobDetailPage;
