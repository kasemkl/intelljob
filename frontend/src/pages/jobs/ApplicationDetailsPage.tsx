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
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import {
  useApplicationService,
  Application,
} from "../../services/applicationService";
import { toast } from "react-toastify";
import { MDBBtnGroup } from "mdb-react-ui-kit";

interface ApplicationDetailsPageProps {}

const ApplicationDetailsPage: React.FC<ApplicationDetailsPageProps> = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState<string>("matching");
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
      const apps = Array.isArray(response.data.applications)
        ? response.data.applications
        : [];
      setApplications(sortApplications(apps, sortCriteria));
    } catch (error: any) {
      toast.error("Failed to fetch applications");
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const [activeButton, setActiveButton] = useState<string>("matching");

  const sortApplications = (apps: any[], criteria: string) => {
    return apps.sort((a, b) => {
      if (criteria === "matching") {
        return (b.similarity_score || 0) - (a.similarity_score || 0);
      } else if (criteria === "quiz_score") {
        return (b.quiz_score || 0) - (a.quiz_score || 0);
      } else if (criteria === "combined") {
        const aCombined = (a.similarity_score || 0) + (a.quiz_score || 0);
        const bCombined = (b.similarity_score || 0) + (b.quiz_score || 0);
        return bCombined - aCombined;
      }
      return 0;
    });
  };

  const handleSortByMatching = () => {
    setSortCriteria("matching");
    setActiveButton("matching");
    setApplications(sortApplications([...applications], "matching"));
  };

  const handleSortByQuizScore = () => {
    setSortCriteria("quiz_score");
    setActiveButton("quiz_score");
    setApplications(sortApplications([...applications], "quiz_score"));
  };

  const handleSortByCombined = () => {
    setSortCriteria("combined");
    setActiveButton("combined");
    setApplications(sortApplications([...applications], "combined"));
  };

  return (
    <MDBContainer className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Applications for Job ID: {jobId}</h2>
        <MDBBtnGroup>
          <MDBBtn
            color={activeButton === "matching" ? "success" : "primary"}
            onClick={handleSortByMatching}
          >
            Sort by Matching
          </MDBBtn>
          <MDBBtn
            color={activeButton === "quiz_score" ? "success" : "primary"}
            onClick={handleSortByQuizScore}
          >
            Sort by Quiz Score
          </MDBBtn>
          <MDBBtn
            color={activeButton === "combined" ? "success" : "primary"}
            onClick={handleSortByCombined}
          >
            Sort by Combined
          </MDBBtn>
        </MDBBtnGroup>
      </div>
      <MDBTable align="middle" hover responsive>
        <MDBTableHead>
          <tr>
            <th scope="col">Applicant</th>
            <th scope="col">Applied Date</th>
            <th scope="col">Status</th>
            <th scope="col">Matching</th>
            <th scope="col">Quiz Score</th>
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
              <td>{Math.round(app.quiz_score || 0)}%</td>
              <td>
                <MDBBtn
                  color="link"
                  size="sm"
                  onClick={() => navigate(`/applications/${app.id}`)}
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
