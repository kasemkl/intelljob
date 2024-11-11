import React, { useEffect, useState } from "react";

import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBSpinner,
} from "mdb-react-ui-kit";

import {
  JobSeekerProfile as JobSeekerProfileType,
  Skill,
  Experience,
  Education,
} from "../types/jobseeker";

import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";
import PersonalInfo from "../components/PersonalInfo";
import ProfessionalInfo from "../components/ProfessionalInfo";
import "../styles/jobseeker-profile.css";

interface JobSeekerProfileProps {
  userId: number;
}

const JobSeekerProfilePage: React.FC<JobSeekerProfileProps> = ({ userId }) => {
  const [profile, setProfile] = useState<JobSeekerProfileType | null>(null);

  const [userDetails, setUserDetails] = useState<{
    first_name: string;

    last_name: string;

    email: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [newSkill, setNewSkill] = useState<Skill>({ name: "", level: 0 });
  const api = useAxios();
  const [newExperience, setNewExperience] = useState<Experience>({
    position: "",

    company: "",

    years: 0,

    start_date: "",

    end_date: "",

    description: "",
  });

  const [newEducation, setNewEducation] = useState<Education>({
    institution: "",
    degree: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchProfile();

    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/api/users-management/users/${userId}/`);

      setUserDetails({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
      });
    } catch (error) {
      toast.error("Error fetching user details");

      console.error("Error fetching user details:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get<JobSeekerProfileType>(
        `/api/users-management/jobseekers/${userId}/`
      );

      setProfile({
        ...response.data,
        skills: response.data.skills || [],
        experience: response.data.experience || [],
        education: response.data.education || [],
      });
    } catch (error) {
      toast.error("Error fetching profile");

      console.error("Error fetching job seeker profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (!userDetails) return;

    setUserDetails({
      ...userDetails,

      [name]: value,
    });
  };

  const handleAddSkill = () => {
    if (!profile) return;

    if (!newSkill.name || newSkill.level < 1 || newSkill.level > 5) {
      toast.error("Please enter valid skill details");

      return;
    }

    setProfile({
      ...profile,
      skills: Array.isArray(profile.skills)
        ? [...profile.skills, newSkill]
        : [newSkill],
    });

    setNewSkill({ name: "", level: 0 });
  };

  const handleRemoveSkill = (index: number) => {
    if (!profile) return;

    const updatedSkills = profile.skills.filter((_, i) => i !== index);

    setProfile({
      ...profile,

      skills: updatedSkills,
    });
  };

  const handleAddExperience = () => {
    if (!profile) return;

    if (!newExperience.position || !newExperience.start_date) {
      toast.error("Please fill in required experience details");

      return;
    }

    setProfile({
      ...profile,
      experience: Array.isArray(profile.experience)
        ? [...profile.experience, newExperience]
        : [newExperience],
    });

    setNewExperience({
      position: "",

      company: "",

      years: 0,

      start_date: "",

      end_date: "",

      description: "",
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (!profile) return;

    const updatedExperience = profile.experience.filter((_, i) => i !== index);

    setProfile({
      ...profile,

      experience: updatedExperience,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (userDetails) {
        await api.put(`/api/users-management/users/${userId}/`, {
          ...userDetails,
          role: "job_seeker",
        });
      }

      if (profile) {
        const profileData = {
          user: userId,
          profile_id: profile.profile_id,
          skills: profile.skills.map((skill) => ({
            name: skill.name,
            level: skill.level,
          })),
          experience: profile.experience.map((exp) => ({
            position: exp.position,
            company: exp.company,
            years: exp.years,
            start_date: exp.start_date,
            end_date: exp.end_date,
            description: exp.description,
          })),
          education: profile.education,
        };

        await api.put(
          `/api/users-management/jobseekers/${userId}/`,
          profileData
        );
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      await fetchProfile();
      await fetchUserDetails();
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error updating job seeker profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = () => {
    if (!profile) return;

    if (!newEducation.institution || !newEducation.degree) {
      toast.error("Please fill in required education details");
      return;
    }

    setProfile({
      ...profile,
      education: Array.isArray(profile.education)
        ? [...profile.education, newEducation]
        : [newEducation],
    });

    setNewEducation({
      institution: "",
      degree: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleRemoveEducation = (index: number) => {
    if (!profile?.education) return;

    const updatedEducation = [...profile.education];

    updatedEducation.splice(index, 1);

    setProfile({
      ...profile,

      education: updatedEducation,
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <MDBSpinner />
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="jobseeker-profile">
      <div className="profile-header">
        <h4 className="profile-title">Job Seeker Profile</h4>
        <div className="action-buttons">
          <MDBBtn
            color={isEditing ? "danger" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
            className="btn-custom me-2"
          >
            <i className={`fas ${isEditing ? "fa-times" : "fa-edit"}`}></i>
            {isEditing ? "Cancel" : "Edit Profile"}
          </MDBBtn>
          {isEditing && (
            <MDBBtn color="success" onClick={handleSave} className="btn-custom">
              <i className="fas fa-save"></i>
              Save Changes
            </MDBBtn>
          )}
        </div>
      </div>

      <PersonalInfo
        userDetails={userDetails}
        isEditing={isEditing}
        onInputChange={handleInputChange}
      />

      {/* Skills Section */}
      <MDBCard className="section-card">
        <MDBCardBody>
          <h5 className="section-title">
            <i className="fas fa-code"></i>
            Skills
          </h5>
          <div className="skills-container">
            {profile?.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">Level {skill.level}</span>
                {isEditing && (
                  <i
                    className="fas fa-times skill-remove"
                    onClick={() => handleRemoveSkill(index)}
                  ></i>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="add-form">
              <MDBRow>
                <MDBCol md="6">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Skill Name"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, name: e.target.value })
                    }
                  />
                </MDBCol>
                <MDBCol md="4">
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Level (1-5)"
                    min="1"
                    max="5"
                    value={newSkill.level || ""}
                    onChange={(e) =>
                      setNewSkill({
                        ...newSkill,
                        level: parseInt(e.target.value),
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="2">
                  <MDBBtn onClick={handleAddSkill} className="w-100">
                    Add Skill
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Experience Section */}
      <MDBCard className="section-card">
        <MDBCardBody>
          <h5 className="section-title">
            <i className="fas fa-briefcase"></i>
            Experience
          </h5>
          {profile?.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <div>
                  <div className="experience-title">{exp.position}</div>
                  <div className="experience-company">{exp.company}</div>
                </div>
                <div className="experience-dates">
                  {exp.start_date} - {exp.end_date || "Present"}
                </div>
              </div>
              <div className="experience-description">{exp.description}</div>
              {isEditing && (
                <MDBBtn
                  color="danger"
                  size="sm"
                  onClick={() => handleRemoveExperience(index)}
                  className="mt-2"
                >
                  Remove
                </MDBBtn>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="add-form">
              <MDBRow>
                <MDBCol md="6">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Position"
                    value={newExperience.position}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        position: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="6">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        company: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="6">
                  <input
                    type="date"
                    className="form-control mb-2"
                    placeholder="Start Date"
                    value={newExperience.start_date}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        start_date: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="6">
                  <input
                    type="date"
                    className="form-control mb-2"
                    placeholder="End Date"
                    value={newExperience.end_date}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        end_date: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="12">
                  <textarea
                    className="form-control mb-2"
                    placeholder="Description"
                    value={newExperience.description}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </MDBCol>
                <MDBCol md="12">
                  <MDBBtn onClick={handleAddExperience}>Add Experience</MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Education Section */}
      <MDBCard className="section-card">
        <MDBCardBody>
          <h5 className="section-title">
            <i className="fas fa-graduation-cap"></i>
            Education
          </h5>
          {profile?.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-header">
                <div>
                  <div className="education-degree">{edu.degree}</div>
                  <div className="education-institution">{edu.institution}</div>
                </div>
                <div className="experience-dates">
                  {edu.start_date} - {edu.end_date || "Present"}
                </div>
              </div>
              {isEditing && (
                <MDBBtn
                  color="danger"
                  size="sm"
                  onClick={() => handleRemoveEducation(index)}
                  className="mt-2"
                >
                  Remove
                </MDBBtn>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="add-form">
              <MDBRow>
                <MDBCol md="6">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Institution"
                    value={newEducation.institution}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        institution: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="6">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Degree"
                    value={newEducation.degree}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        degree: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="6">
                  <input
                    type="date"
                    className="form-control mb-2"
                    placeholder="Start Date"
                    value={newEducation.start_date}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        start_date: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="6">
                  <input
                    type="date"
                    className="form-control mb-2"
                    placeholder="End Date"
                    value={newEducation.end_date}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        end_date: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="12">
                  <MDBBtn onClick={handleAddEducation}>Add Education</MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default JobSeekerProfilePage;
