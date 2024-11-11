import React, { useContext, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";

interface PersonalInfoProps {
  userDetails: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  userDetails,
  isEditing,
  onInputChange,
}) => {
  return (
    <MDBCard className="mb-4">
      <MDBCardBody>
        <h5 className="mb-4">Personal Information</h5>
        <MDBRow>
          <MDBCol md="6">
            <MDBInput
              label="First Name"
              name="first_name"
              value={userDetails?.first_name || ""}
              onChange={onInputChange}
              disabled={!isEditing}
              className="mb-4"
            />
          </MDBCol>
          <MDBCol md="6">
            <MDBInput
              label="Last Name"
              name="last_name"
              value={userDetails?.last_name || ""}
              onChange={onInputChange}
              disabled={!isEditing}
              className="mb-4"
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12">
            <MDBInput
              label="Email"
              name="email"
              value={userDetails?.email || ""}
              onChange={onInputChange}
              disabled={!isEditing}
              type="email"
            />
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
};

export default PersonalInfo;
