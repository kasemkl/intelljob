import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { jobService } from "../../services/jobService";
import { toast } from "react-toastify";
import { Job } from "../../types/job";

const EditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryRange: "",
    jobType: "FULL_TIME",
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    if (!id) return;
    try {
      const response = await jobService.getJob(parseInt(id));
      const job = response.data;
      setFormData({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        location: job.location || "",
        salaryRange: job.salaryRange || "",
        jobType: job.jobType || "FULL_TIME",
        status: job.status || "ACTIVE",
      });
    } catch (error) {
      toast.error("Failed to fetch job details");
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await jobService.updateJob(parseInt(id), formData);
      toast.success("Job updated successfully");
      navigate("/company-jobs");
    } catch (error) {
      toast.error("Failed to update job");
      console.error("Error updating job:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <MDBSpinner />
      </div>
    );
  }

  return (
    <MDBContainer className="py-5">
      <MDBCard>
        <MDBCardBody>
          <h2 className="text-center mb-4">Edit Job Posting</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <MDBInput
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <MDBTextArea
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="mb-4">
              <MDBTextArea
                label="Requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="mb-4">
              <MDBInput
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <MDBInput
                label="Salary Range"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <select
                className="form-select"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="mb-4">
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <MDBBtn color="light" onClick={() => navigate("/company-jobs")}>
                Cancel
              </MDBBtn>
              <MDBBtn type="submit">Update Job</MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default EditJobPage;
