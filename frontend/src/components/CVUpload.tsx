import React, { useState } from "react";
import { MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import useAxios from "../hooks/useAxios";

interface CVUploadProps {
  onUploadSuccess: () => void;
}

const CVUpload: React.FC<CVUploadProps> = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const api = useAxios();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Please select a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("cv", selectedFile);

      const response = await api.post(
        "/api/users-management/parse-cv/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("CV uploaded and parsed successfully");
        onUploadSuccess();
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to upload and parse CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cv-upload-section">
      <div className="d-flex align-items-center gap-3">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="form-control"
          style={{ maxWidth: "300px" }}
        />
        <MDBBtn onClick={handleUpload} disabled={loading || !selectedFile}>
          {loading ? (
            <MDBSpinner size="sm" />
          ) : (
            <>
              <i className="fas fa-upload me-2"></i>
              Upload CV
            </>
          )}
        </MDBBtn>
      </div>
      <small className="text-muted mt-2">
        Note: Skill levels are automatically determined based on your experience
        and certifications. You can manually adjust them after upload if needed.
      </small>
      {selectedFile && (
        <div className="selected-file mt-2">
          <small className="text-muted">
            Selected file: {selectedFile.name}
          </small>
        </div>
      )}
    </div>
  );
};

export default CVUpload;
