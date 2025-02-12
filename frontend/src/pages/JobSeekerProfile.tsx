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
  MDBFile,
} from "mdb-react-ui-kit";

import {
  JobSeekerProfile as JobSeekerProfileType,
  Skill,
  Experience,
  Education,
  Language,
  Certification,
} from "../types/jobseeker";

import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";
import PersonalInfo from "../components/PersonalInfo";
import ProfessionalInfo from "../components/ProfessionalInfo";
import "../styles/jobseeker-profile.css";
import CVUpload from "../components/CVUpload";

interface JobSeekerProfileProps {
  userId: number;
}

interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: File | null;
}

const JobSeekerProfilePage: React.FC<JobSeekerProfileProps> = ({ userId }) => {
  const [profile, setProfile] = useState<JobSeekerProfileType | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

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

  const [newLanguage, setNewLanguage] = useState<Language>({
    name: "",
    proficiency: "",
  });
  const [newCertification, setNewCertification] = useState<Certification>({
    name: "",
    date_obtained: "",
  });
  const [newAward, setNewAward] = useState("");

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

  const handleSkillLevelChange = (index: number, level: number) => {
    if (!profile) return;

    if (level < 1 || level > 5) {
      toast.error("Skill level must be between 1 and 5");
      return;
    }

    const updatedSkills = profile.skills.map((skill, i) =>
      i === index ? { ...skill, level } : skill
    );

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserDetails((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profile_picture: file,
        };
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (userDetails) {
        formData.append("first_name", userDetails.first_name);
        formData.append("last_name", userDetails.last_name);
        formData.append("email", userDetails.email);
        formData.append("role", "job_seeker");
        if (userDetails.profile_picture) {
          formData.append("profile_picture", userDetails.profile_picture);
        }
      }

      if (profile) {
        const linkedinUrl = profile.linkedin_url?.startsWith("http")
          ? profile.linkedin_url
          : `https://${profile.linkedin_url}`;

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
          linkedin_url: linkedinUrl,
          languages: profile.languages?.map((lang) => ({
            name: lang.name,
            proficiency: lang.proficiency,
          })),
          certifications: profile.certifications?.map((cert) => ({
            name: cert.name,
            date_obtained: cert.date_obtained,
          })),
          awards: profile.awards || [],
          companies_worked_at: profile.companies_worked_at || [],
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
    } catch (error: any) {
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

  const handleAddLanguage = () => {
    if (!profile || !newLanguage.name || !newLanguage.proficiency) return;
    setProfile({
      ...profile,
      languages: [...(profile.languages || []), newLanguage],
    });
    setNewLanguage({ name: "", proficiency: "" });
  };

  const handleRemoveLanguage = (index: number) => {
    if (!profile?.languages) return;
    const updatedLanguages = [...profile.languages];
    updatedLanguages.splice(index, 1);
    setProfile({ ...profile, languages: updatedLanguages });
  };

  const handleAddCertification = () => {
    if (!profile || !newCertification.name) return;
    setProfile({
      ...profile,
      certifications: [...(profile.certifications || []), newCertification],
    });
    setNewCertification({ name: "", date_obtained: "" });
  };

  const handleRemoveCertification = (index: number) => {
    if (!profile?.certifications) return;
    const updatedCertifications = [...profile.certifications];
    updatedCertifications.splice(index, 1);
    setProfile({ ...profile, certifications: updatedCertifications });
  };

  const handleAddAward = () => {
    if (!profile || !newAward) return;
    setProfile({
      ...profile,
      awards: [...(profile.awards || []), newAward],
    });
    setNewAward("");
  };

  const handleRemoveAward = (index: number) => {
    if (!profile?.awards) return;
    const updatedAwards = [...profile.awards];
    updatedAwards.splice(index, 1);
    setProfile({ ...profile, awards: updatedAwards });
  };

  const handleRemoveCompany = (index: number) => {
    if (!profile?.companies_worked_at) return;
    const updatedCompanies = [...profile.companies_worked_at];
    updatedCompanies.splice(index, 1);
    setProfile({ ...profile, companies_worked_at: updatedCompanies });
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
        <div className="profile-photo-container">
          {isEditing ? (
            <MDBFile
              label="Choose a profile picture"
              onChange={handleFileChange}
            />
          ) : (
            <img
              src={userDetails?.profile_picture || "/default-profile.png"}
              alt="Profile"
              className="profile-photo"
            />
          )}
        </div>
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

      <MDBCard className="section-card">
        <MDBCardBody>
          <h5 className="section-title">
            <i className="fas fa-file-pdf"></i>
            CV Upload
          </h5>
          <p className="text-muted mb-3">
            Upload your CV to automatically update your profile information
          </p>
          <CVUpload onUploadSuccess={fetchProfile} />
        </MDBCardBody>
      </MDBCard>

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
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skill.level}
                    onChange={(e) =>
                      handleSkillLevelChange(index, parseInt(e.target.value))
                    }
                    className="skill-level-input"
                  />
                ) : (
                  <span className="skill-level">Level {skill.level}</span>
                )}
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
                    min="1"
                    max="5"
                    value={newSkill.level || ""}
                    onChange={(e) =>
                      setNewSkill({
                        ...newSkill,
                        level: parseInt(e.target.value),
                      })
                    }
                    className="skill-level-input"
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

      {/* Languages Section */}
      <MDBCard className="section-card">
        <MDBCardBody>
          <h5 className="section-title">
            <i className="fas fa-language"></i>
            Languages
          </h5>
          <div className="languages-container">
            {profile?.languages?.map((language, index) => (
              <div key={index} className="language-item">
                <div className="language-header">
                  <div>
                    <div className="language-name">{language.name}</div>
                    <div className="language-proficiency">
                      {language.proficiency}
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <MDBBtn
                    color="danger"
                    size="sm"
                    onClick={() => handleRemoveLanguage(index)}
                    className="mt-2"
                  >
                    Remove
                  </MDBBtn>
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
                    placeholder="Language"
                    value={newLanguage.name}
                    onChange={(e) =>
                      setNewLanguage({ ...newLanguage, name: e.target.value })
                    }
                  />
                </MDBCol>
                <MDBCol md="6">
                  <select
                    className="form-control mb-2"
                    value={newLanguage.proficiency}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        proficiency: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Proficiency</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </MDBCol>
                <MDBCol md="12">
                  <MDBBtn onClick={handleAddLanguage}>Add Language</MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Certifications Section */}
      <MDBCard className="section-card">
        <MDBCardBody>
          <h5 className="section-title">
            <i className="fas fa-certificate"></i>
            Certifications
          </h5>
          <div className="certifications-container">
            {profile?.certifications?.map((cert, index) => (
              <div key={index} className="certification-item">
                <div className="certification-header">
                  <div className="certification-name">{cert.name}</div>
                  {cert.date_obtained && (
                    <div className="certification-date">
                      {cert.date_obtained}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <MDBBtn
                    color="danger"
                    size="sm"
                    onClick={() => handleRemoveCertification(index)}
                    className="mt-2"
                  >
                    Remove
                  </MDBBtn>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="add-form">
              <MDBRow>
                <MDBCol md="8">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Certification Name"
                    value={newCertification.name}
                    onChange={(e) =>
                      setNewCertification({
                        ...newCertification,
                        name: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="4">
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={newCertification.date_obtained || ""}
                    onChange={(e) =>
                      setNewCertification({
                        ...newCertification,
                        date_obtained: e.target.value,
                      })
                    }
                  />
                </MDBCol>
                <MDBCol md="12">
                  <MDBBtn onClick={handleAddCertification}>
                    Add Certification
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Additional Information Section */}
      <MDBCard className="section-card">
        <MDBCardBody>
          <h5 className="section-title">
            <i className="fas fa-info-circle"></i>
            Additional Information
          </h5>

          {/* LinkedIn URL */}
          <div className="info-item">
            <div className="info-label">
              <i className="fab fa-linkedin"></i>
              LinkedIn Profile
            </div>
            {isEditing ? (
              <input
                type="url"
                className="form-control mb-3"
                placeholder="LinkedIn URL"
                value={profile?.linkedin_url || ""}
                onChange={(e) =>
                  setProfile((prev) =>
                    prev
                      ? {
                          ...prev,
                          linkedin_url: e.target.value,
                        }
                      : null
                  )
                }
              />
            ) : (
              <div className="info-value">
                {profile?.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.linkedin_url}
                  </a>
                ) : (
                  <span className="text-muted">Not provided</span>
                )}
              </div>
            )}
          </div>

          {/* Awards */}
          <div className="info-item">
            <div className="info-label">
              <i className="fas fa-trophy"></i>
              Awards
            </div>
            <div className="awards-container">
              {profile?.awards?.map((award, index) => (
                <div key={index} className="award-item">
                  {award}
                  {isEditing && (
                    <i
                      className="fas fa-times remove-icon"
                      onClick={() => handleRemoveAward(index)}
                    ></i>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="add-form">
                <MDBRow>
                  <MDBCol md="10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Award"
                      value={newAward}
                      onChange={(e) => setNewAward(e.target.value)}
                    />
                  </MDBCol>
                  <MDBCol md="2">
                    <MDBBtn onClick={handleAddAward}>Add</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </div>
            )}
          </div>

          {/* Companies Worked At */}
          <div className="info-item">
            <div className="info-label">
              <i className="fas fa-building"></i>
              Previous Companies
            </div>
            <div className="companies-container">
              {profile?.companies_worked_at?.map((company, index) => (
                <div key={index} className="company-item">
                  {company}
                  {isEditing && (
                    <i
                      className="fas fa-times remove-icon"
                      onClick={() => handleRemoveCompany(index)}
                    ></i>
                  )}
                </div>
              ))}
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default JobSeekerProfilePage;
