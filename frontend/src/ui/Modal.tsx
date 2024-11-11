import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

interface ModalProps {
  text: {
    title: string;
    body: string;
  };
  onHide: () => void;
}

const Modal: React.FC<ModalProps> = ({ text, onHide }) => {
  const [basicModal, setBasicModal] = useState(true);

  return (
    <>
      <MDBModal
        open={basicModal}
        onClose={() => {
          setBasicModal(false);
          onHide();
        }}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle className="" style={{ fontSize: "18px" }}>
                {text.title}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  setBasicModal(false);
                  onHide();
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody style={{ textTransform: "capitalize" }}>
              {text.body}
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                color="primary"
                onClick={() => {
                  setBasicModal(false);
                  onHide();
                }}
              >
                Close
              </MDBBtn>
              {/* <MDBBtn className="modal-btn">Save changes</MDBBtn> */}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default Modal;
