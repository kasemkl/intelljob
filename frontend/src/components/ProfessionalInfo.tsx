import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
} from "mdb-react-ui-kit";
import {
  JobSeekerProfile as JobSeekerProfileType,
  Skill,
  Experience,
  Education,
} from "../types/jobseeker";

interface ProfessionalInfoProps {
  profile: JobSeekerProfileType;
  setProfile: React.Dispatch<React.SetStateAction<JobSeekerProfileType | null>>;
  isEditing: boolean;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  profile,
  setProfile,
  isEditing,
}) => {
  const [newSkill, setNewSkill] = useState<Skill>({ name: "", level: 0 });
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

  const handleAddSkill = () => {
    if (!newSkill.name || newSkill.level < 1 || newSkill.level > 5) return;
    setProfile((prev) => ({
      ...prev!,
      skills: [...(prev?.skills || []), newSkill],
    }));
    setNewSkill({ name: "", level: 0 });
  };

  const handleRemoveSkill = (index: number) => {
    setProfile((prev) => ({
      ...prev!,
      skills: prev!.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAddExperience = () => {
    if (!newExperience.position || !newExperience.company) return;
    setProfile((prev) => ({
      ...prev!,
      experience: [...(prev?.experience || []), newExperience],
    }));
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
    setProfile((prev) => ({
      ...prev!,
      experience: prev!.experience.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mt-4">
      {/* Skills Section */}
      <MDBCard className="mb-4">
        <MDBCardBody>
          <h5>Skills</h5>
          {profile?.skills?.map((skill, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <span>
                {skill.name} - Level: {skill.level}
              </span>
              {isEditing && (
                <MDBBtn
                  color="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleRemoveSkill(index)}
                >
                  Remove
                </MDBBtn>
              )}
            </div>
          ))}
          {/* Add skill form */}
          {isEditing && (
            <MDBRow className="mt-3">
              <MDBCol size="5">
                <MDBInput
                  label="Skill Name"
                  name="name"
                  value={newSkill?.name || ""}
                  onChange={onSkillChange}
                />
              </MDBCol>
              <MDBCol size="5">
                <MDBInput
                  type="number"
                  label="Level (1-5)"
                  name="level"
                  value={newSkill?.level || ""}
                  onChange={onSkillChange}
                />
              </MDBCol>
              <MDBCol size="2">
                <MDBBtn onClick={onAddSkill}>Add</MDBBtn>
              </MDBCol>
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Experience Section */}
      <MDBCard className="mb-4">
        <MDBCardBody>
          <h5>Experience</h5>
          {profile?.experience?.map((exp, index) => (
            <div key={index} className="mb-3">
              <h6>
                {exp.position} at {exp.company}
              </h6>
              <p>
                {exp.start_date} - {exp.end_date}
                <br />
                {exp.description}
              </p>
              {isEditing && (
                <MDBBtn
                  color="danger"
                  size="sm"
                  onClick={() => handleRemoveExperience(index)}
                >
                  Remove
                </MDBBtn>
              )}
            </div>
          ))}
          {isEditing && (
            <MDBRow className="mt-3">
              <MDBCol size="6">
                <MDBInput
                  label="Position"
                  name="position"
                  value={newExperience?.position || ""}
                  onChange={onExperienceChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="6">
                <MDBInput
                  label="Company"
                  name="company"
                  value={newExperience?.company || ""}
                  onChange={onExperienceChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="6">
                <MDBInput
                  type="date"
                  label="Start Date"
                  name="start_date"
                  value={newExperience?.start_date || ""}
                  onChange={onExperienceChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="6">
                <MDBInput
                  type="date"
                  label="End Date"
                  name="end_date"
                  value={newExperience?.end_date || ""}
                  onChange={onExperienceChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="12">
                <MDBTextArea
                  label="Description"
                  name="description"
                  value={newExperience?.description || ""}
                  onChange={onExperienceChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="12">
                <MDBBtn onClick={handleAddExperience}>Add Experience</MDBBtn>
              </MDBCol>
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Education Section */}
      <MDBCard>
        <MDBCardBody>
          <h5>Education</h5>
          {profile?.education?.map((edu, index) => (
            <div key={index} className="mb-3">
              <h6>
                {edu.degree} from {edu.institution}
              </h6>
              <p>
                {edu.start_date} - {edu.end_date}
              </p>
              {isEditing && (
                <MDBBtn
                  color="danger"
                  size="sm"
                  onClick={() => handleRemoveEducation(index)}
                >
                  Remove
                </MDBBtn>
              )}
            </div>
          ))}
          {isEditing && (
            <MDBRow className="mt-3">
              <MDBCol size="6">
                <MDBInput
                  label="Institution"
                  name="institution"
                  value={newEducation?.institution || ""}
                  onChange={onEducationChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="6">
                <MDBInput
                  label="Degree"
                  name="degree"
                  value={newEducation?.degree || ""}
                  onChange={onEducationChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="6">
                <MDBInput
                  type="date"
                  label="Start Date"
                  name="start_date"
                  value={newEducation?.start_date || ""}
                  onChange={onEducationChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="6">
                <MDBInput
                  type="date"
                  label="End Date"
                  name="end_date"
                  value={newEducation?.end_date || ""}
                  onChange={onEducationChange}
                  className="mb-2"
                />
              </MDBCol>
              <MDBCol size="12">
                <MDBBtn onClick={handleAddEducation}>Add Education</MDBBtn>
              </MDBCol>
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default ProfessionalInfo;
