import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { Skill, Experience, Education } from "../types/jobseeker";

interface ProfessionalInfoProps {
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  isEditing: boolean;
  newSkill?: Skill;
  newExperience?: Experience;
  newEducation?: Education;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  onSkillChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExperienceChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onEducationChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  skills,
  experience,
  education,
  isEditing,
  newSkill,
  newExperience,
  newEducation,
  onAddSkill,
  onRemoveSkill,
  onAddExperience,
  onRemoveExperience,
  onAddEducation,
  onRemoveEducation,
  onSkillChange,
  onExperienceChange,
  onEducationChange,
}) => {
  return (
    <div className="mt-4">
      {/* Skills Section */}
      <MDBCard className="mb-4">
        <MDBCardBody>
          <h5>Skills</h5>
          {skills.map((skill, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <span>
                {skill.name} - Level: {skill.level}
              </span>
              {isEditing && (
                <MDBBtn
                  color="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => onRemoveSkill(index)}
                >
                  Remove
                </MDBBtn>
              )}
            </div>
          ))}
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
          {experience.map((exp, index) => (
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
                  onClick={() => onRemoveExperience(index)}
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
                <MDBBtn onClick={onAddExperience}>Add Experience</MDBBtn>
              </MDBCol>
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Education Section */}
      <MDBCard>
        <MDBCardBody>
          <h5>Education</h5>
          {education.map((edu, index) => (
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
                  onClick={() => onRemoveEducation(index)}
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
                <MDBBtn onClick={onAddEducation}>Add Education</MDBBtn>
              </MDBCol>
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default ProfessionalInfo;
