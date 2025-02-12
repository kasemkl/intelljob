import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";
import { JobSeekerProfile as JobSeekerProfileType } from "../types/jobseeker";

interface AdditionalInfoProps {
  profile: JobSeekerProfileType;
  setProfile: React.Dispatch<React.SetStateAction<JobSeekerProfileType | null>>;
  isEditing: boolean;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  profile,
  setProfile,
  isEditing,
}) => {
  const [newAward, setNewAward] = useState("");

  // Add your handler functions here

  return (
    <MDBCard className="section-card">
      <MDBCardBody>{/* Your additional info JSX */}</MDBCardBody>
    </MDBCard>
  );
};

export default AdditionalInfo;
