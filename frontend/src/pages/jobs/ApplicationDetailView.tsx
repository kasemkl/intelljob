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
} from "mdb-react-ui-kit";
import {
  useApplicationService,
  Application,
} from "../../services/applicationService";
import { toast } from "react-toastify";

interface ApplicationDetailsPageProps {}

const ApplicationDetailsPage: React.FC<ApplicationDetailsPageProps> = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const applicationService = useApplicationService();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    if (!applicationId) return;

    try {
      const response = await applicationService.getApplicationDetails(
        parseInt(applicationId)
      );
      setApplication(response.data);
    } catch (error) {
      toast.error("Failed to fetch application details");
      console.error("Error fetching application details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!application) return;

    try {
      await applicationService.updateApplicationStatus(
        application.id,
        newStatus
      );
      toast.success("Application status updated successfully");
      fetchApplicationDetails();
    } catch (error) {
      toast.error("Failed to update application status");
      console.error("Error updating application status:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <MDBSpinner />
      </div>
    );
  }

  if (!application) {
    return (
      <MDBContainer className="py-5">
        <div className="text-center">
          <h3>Application not found</h3>
          <MDBBtn onClick={() => navigate(-1)}>Go Back</MDBBtn>
        </div>
      </MDBContainer>
    );
  }

  const details = application.job_seeker_details;

  return (
    <MDBContainer className="py-5">
      <MDBCard>
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Application Details</h2>
            <MDBBtn onClick={() => navigate(-1)}>Back to Applications</MDBBtn>
          </div>

          {/* Job Information */}
          <section className="mb-5">
            <h4 className="text-primary mb-3">Job Information</h4>
            <MDBCard>
              <MDBCardBody>
                <h5>{application.job_details?.title}</h5>
                <p className="mb-2">
                  Description: {application.job_details?.description}
                </p>
                <p className="mb-2">
                  Requirements: {application.job_details?.requirements}
                </p>
                <p className="mb-2">
                  Status:
                  <MDBBadge
                    className="ms-2"
                    color={
                      application.status === "accepted"
                        ? "success"
                        : application.status === "rejected"
                        ? "danger"
                        : "primary"
                    }
                  >
                    {application.status}
                  </MDBBadge>
                </p>
                <p className="mb-2">
                  Applied:{" "}
                  {new Date(application.applied_at).toLocaleDateString()}
                </p>
              </MDBCardBody>
            </MDBCard>
          </section>

          {/* Applicant Information */}
          <MDBRow>
            <MDBCol size="12">
              {/* Basic Information */}
              <section className="mb-4">
                <h4 className="text-primary mb-3">Basic Information</h4>
                <MDBCard>
                  <MDBCardBody>
                    <div className="d-flex align-items-center mb-3">
                      {details.profile_picture && (
                        <img
                          src={details.profile_picture}
                          alt="Profile"
                          className="rounded-circle me-3"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div>
                        <h3 className="mb-2">{`${details.first_name} ${details.last_name}`}</h3>
                        <p className="mb-2">{details.email}</p>
                        {details.linkedin_url && (
                          <a
                            href={details.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="fab fa-linkedin me-2"></i>LinkedIn
                            Profile
                          </a>
                        )}
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </section>

              {/* Skills */}
              {details.skills.length > 0 && (
                <section className="mb-4">
                  <h4 className="text-primary mb-3">Skills</h4>
                  <MDBCard>
                    <MDBCardBody>
                      <div className="d-flex flex-wrap gap-2">
                        {details.skills.map((skill, index) => (
                          <MDBBadge
                            key={index}
                            color="info"
                            className="px-3 py-2"
                          >
                            {skill.name} (Level: {skill.level})
                          </MDBBadge>
                        ))}
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </section>
              )}

              {/* Experience */}
              {details.experience.length > 0 && (
                <section className="mb-4">
                  <h4 className="text-primary mb-3">Work Experience</h4>
                  {details.experience.map((exp, index) => (
                    <MDBCard key={index} className="mb-3">
                      <MDBCardBody>
                        <h5 className="mb-1">{exp.position}</h5>
                        <h6 className="mb-2">{exp.company}</h6>
                        <p className="text-muted mb-2">
                          {new Date(exp.start_date).toLocaleDateString()} -
                          {new Date(exp.end_date).toLocaleDateString()}
                        </p>
                        {exp.description && (
                          <p className="mb-0">{exp.description}</p>
                        )}
                      </MDBCardBody>
                    </MDBCard>
                  ))}
                </section>
              )}

              {/* Education */}
              {details.education.length > 0 && (
                <section className="mb-4">
                  <h4 className="text-primary mb-3">Education</h4>
                  {details.education.map((edu, index) => (
                    <MDBCard key={index} className="mb-3">
                      <MDBCardBody>
                        <h5 className="mb-1">{edu.degree}</h5>
                        <h6 className="mb-2">{edu.institution}</h6>
                        {/* <p className="text-muted mb-0">
                          {new Date(edu.start_date).toLocaleDateString()} -
                          {new Date(edu.end_date).toLocaleDateString()}
                        </p> */}
                      </MDBCardBody>
                    </MDBCard>
                  ))}
                </section>
              )}

              {/* Languages */}
              {details.languages.length > 0 && (
                <section className="mb-4">
                  <h4 className="text-primary mb-3">Languages</h4>
                  <MDBCard>
                    <MDBCardBody>
                      <div className="d-flex flex-wrap gap-2">
                        {details.languages.map((lang, index) => (
                          <MDBBadge
                            key={index}
                            color="light"
                            className="px-3 py-2 text-dark"
                          >
                            {lang.name} ({lang.proficiency})
                          </MDBBadge>
                        ))}
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </section>
              )}

              {/* Certifications */}
              {details.certifications.length > 0 && (
                <section className="mb-4">
                  <h4 className="text-primary mb-3">Certifications</h4>
                  <MDBCard>
                    <MDBCardBody>
                      {details.certifications.map((cert, index) => (
                        <div key={index} className="mb-2">
                          <p className="mb-1">
                            {cert.name}
                            {cert.date_obtained && (
                              <span className="text-muted ms-2">
                                (
                                {new Date(
                                  cert.date_obtained
                                ).toLocaleDateString()}
                                )
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </MDBCardBody>
                  </MDBCard>
                </section>
              )}

              {/* Status Update Section */}
              <section className="mt-5">
                <MDBCard>
                  <MDBCardBody>
                    <h4 className="text-primary mb-3">
                      Update Application Status
                    </h4>
                    <div className="d-flex gap-2">
                      <MDBBtn
                        color="success"
                        onClick={() => handleStatusUpdate("accepted")}
                        disabled={application.status === "accepted"}
                      >
                        Accept Application
                      </MDBBtn>
                      <MDBBtn
                        color="danger"
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={application.status === "rejected"}
                      >
                        Reject Application
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </section>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default ApplicationDetailsPage;
