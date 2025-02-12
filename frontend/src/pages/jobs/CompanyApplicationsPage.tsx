import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBBtn,
  MDBSpinner,
  MDBCollapse,
} from "mdb-react-ui-kit";
import {
  useApplicationService,
  Application,
} from "../../services/applicationService";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { jobService } from "../../services/jobService";
import { useNavigate } from "react-router-dom";
import MyPieChart from "./../../ui/MyPieChart";

const CompanyApplicationsPage: React.FC = () => {
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openJobId, setOpenJobId] = useState<number | null>(null);
  const applicationService = useApplicationService();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [user?.user_id]);

  const fetchApplications = async () => {
    if (!user?.user_id) return;

    try {
      // First get all jobs posted by the company
      const jobsResponse = await jobService.getByCompanyId(user.profile_id);

      // Then get applications for each job
      const applicationsPromises = jobsResponse.data.map((job) =>
        applicationService.getCompanyApplications(job.id)
      );

      const applicationsResponses = await Promise.all(applicationsPromises);

      // Combine all applications
      const allApplications = applicationsResponses.map((response, index) => ({
        job_details: jobsResponse.data[index],
        applications: Array.isArray(response.data) ? response.data : [],
      }));

      setJobApplications(allApplications);
    } catch (error: any) {
      toast.error("Failed to fetch applications");
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobApplications = (jobId: number) => {
    setOpenJobId((prevOpenJobId) => (prevOpenJobId === jobId ? null : jobId));
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/jobs/${jobId}/applications`);
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
      <h2 className="mb-4">Job Posts</h2>
      {jobApplications.map((job) => (
        <MDBCard
          key={job.job_details.id}
          className="mb-3"
          onClick={() => handleJobClick(job.job_details.id)}
          style={{ cursor: "pointer" }}
        >
          <MDBCardBody>
            <h4 className="mb-3">{job.job_details.title}</h4>
            <p>{job.job_details.description}</p>
          </MDBCardBody>
        </MDBCard>
      ))}
    </MDBContainer>
  );
};

export default CompanyApplicationsPage;
