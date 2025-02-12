import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBSpinner,
} from "mdb-react-ui-kit";
import {
  useApplicationService,
  Application,
} from "../../services/applicationService";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const JobApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const applicationService = useApplicationService();
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.user_id) return;

      try {
        const response = await applicationService.getUserApplications(
          user.user_id
        );
        setApplications(response.data);
      } catch (error) {
        toast.error("Failed to fetch applications");
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.user_id]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "primary";
      case "reviewed":
        return "info";
      case "accepted":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "warning";
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
          <h2 className="mb-4">My Job Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-file-alt fa-3x mb-3 text-muted"></i>
              <h5>No applications yet</h5>
              <p className="text-muted">
                Start applying for jobs to see your applications here.
              </p>
            </div>
          ) : (
            <MDBTable align="middle" hover responsive>
              <MDBTableHead>
                <tr>
                  <th scope="col">Job Title</th>
                  <th scope="col">Company</th>
                  <th scope="col">Applied Date</th>
                  <th scope="col">Status</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.job_details?.title}</td>
                    <td>{application.job_details?.company_name}</td>
                    <td>
                      {new Date(application.applied_at).toLocaleDateString()}
                    </td>
                    <td>
                      <MDBBadge
                        color={getStatusBadgeColor(application.status)}
                        pill
                      >
                        {application.status}
                      </MDBBadge>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default JobApplicationsPage;
