import React from "react";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";

interface SectionCardProps {
  title: string;
  items: any[];
  isEditing: boolean;
  onAdd: (item: any) => void;
  onRemove: (index: number) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  items,
  isEditing,
  onAdd,
  onRemove,
}) => {
  return (
    <MDBCard className="mb-4">
      <MDBCardBody>
        <h5>{title}</h5>
        {/* Add your section card content here */}
      </MDBCardBody>
    </MDBCard>
  );
};

export default SectionCard;
