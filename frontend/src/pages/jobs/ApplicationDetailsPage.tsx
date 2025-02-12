import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBSpinner,
  MDBBadge,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import {
  useApplicationService,
  Application,
} from "../../services/applicationService";
import { toast } from "react-toastify";

interface ApplicationDetailsPageProps {}

const ApplicationDetailsPage: React.FC<ApplicationDetailsPageProps> = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const applicationService = useApplicationService();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getCompanyApplications(
        Number(jobId)
      );
      setApplications(
        Array.isArray(response.data.applications)
          ? response.data.applications
          : []
      );
    } catch (error: any) {
      toast.error("Failed to fetch applications");
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (applicationId: number) => {
    navigate(`/applications/${applicationId}`);
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
      <h2 className="mb-4">Applications for Job ID: {jobId}</h2>
      <MDBTable align="middle" hover responsive>
        <MDBTableHead>
          <tr>
            <th scope="col">Applicant</th>
            <th scope="col">Applied Date</th>
            <th scope="col">Status</th>
            <th scope="col">Matching</th>
            <th scope="col">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>
                {app.job_seeker_details?.first_name}{" "}
                {app.job_seeker_details?.last_name}
              </td>
              <td>{new Date(app.applied_at).toLocaleDateString()}</td>
              <td>
                <MDBBadge
                  color={
                    app.status === "accepted"
                      ? "success"
                      : app.status === "rejected"
                      ? "danger"
                      : "primary"
                  }
                  pill
                >
                  {app.status}
                </MDBBadge>
              </td>
              <td>{Math.round(app.similarity_score || 0)}%</td>
              <td>
                <MDBBtn
                  color="link"
                  size="sm"
                  onClick={() => handleViewDetails(app.id)}
                >
                  View Details
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
};

export default ApplicationDetailsPage;
