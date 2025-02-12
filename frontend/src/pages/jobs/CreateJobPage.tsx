import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBSpinner,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { jobService, JobData, JobRequirement } from "../../services/jobService";
import { toast } from "react-toastify";
import locationService, { City } from "../../services/locationService";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../contexts/AuthContext";
import categoryService, { Category } from "../../services/categoryService";

interface FormData {
  title: string;
  description: string;
  salaryRange: string;
  companyId: string;
  locationId: string;
  status: string;
  categories: Category[];
}

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const api = useAxios();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    salaryRange: "",
    companyId: "",
    locationId: "",
    status: "ACTIVE",
    categories: [],
  });

  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const citiesData = await locationService.getAllCities();
        if (isMounted) {
          setCities(citiesData);
        }
        if (user?.user_id && isMounted) {
          const response = await api.get(
            `/api/users-management/companiesByUserId/${user.user_id}/`
          );
          if (isMounted) {
            setFormData((prev) => ({
              ...prev,
              companyId: response.data.id.toString(),
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load necessary data");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "company")) {
      toast.error("Please log in as a company to post jobs");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements([...requirements, requirementInput]);
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error("Job title is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Job description is required");
      return false;
    }
    if (!formData.locationId) {
      toast.error("Location is required");
      return false;
    }
    if (!formData.salaryRange.trim()) {
      toast.error("Salary range is required");
      return false;
    }
    if (requirements.length === 0) {
      toast.error("At least one requirement is needed");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (!formData.companyId) {
        toast.error("Please log in as a company to post jobs");
        return;
      }

      const requirementsList: JobRequirement[] = requirements.map((req) => ({
        description: req,
      }));

      const currentDate = new Date().toISOString();
      const postDate = currentDate.split("T")[0];

      const jobData: JobData = {
        id: 0,
        companyId: parseInt(formData.companyId),
        description: formData.description,
        locationId: parseInt(formData.locationId),
        status: formData.status,
        salaryRange: formData.salaryRange,
        createdAt: currentDate,
        updatedAt: currentDate,
        title: formData.title,
        postDate: postDate,
        requirements: requirementsList,
        categories: selectedCategories.map((id) => ({ id })),
      };

      await jobService.createJob(jobData);
      toast.success("Job posted successfully!");
      navigate("/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <MDBContainer className="text-center py-5">
        <MDBSpinner role="status" />
      </MDBContainer>
    );
  }

  if (!user || user.role !== "company") {
    return <div>Only companies can post jobs</div>;
  }

  return (
    <MDBContainer className="py-5">
      <MDBCard>
        <MDBCardBody>
          <h1 className="text-center mb-4">Post New Job</h1>
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mb-4"
            />
            <MDBInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              type="textarea"
              rows={4}
              required
              className="mb-4"
            />
            <MDBRow className="mb-4">
              <MDBCol md="6">
                <MDBInput
                  label="Salary Range"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  required
                />
              </MDBCol>
              <MDBCol md="6">
                <select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a location</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.country_name}
                    </option>
                  ))}
                </select>
              </MDBCol>
            </MDBRow>
            <div className="mb-4">
              <label>Requirements</label>
              <MDBRow>
                <MDBCol md="10">
                  <MDBInput
                    label="Add a requirement"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                  />
                </MDBCol>
                <MDBCol md="2">
                  <MDBBtn
                    type="button"
                    color="primary"
                    onClick={handleAddRequirement}
                  >
                    Add
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
              <MDBListGroup className="mt-3">
                {requirements.map((req, index) => (
                  <MDBListGroupItem
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {req}
                    <MDBIcon
                      fas
                      icon="trash-alt"
                      className="text-danger"
                      onClick={() => handleRemoveRequirement(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </MDBListGroupItem>
                ))}
              </MDBListGroup>
            </div>
            <div className="mb-4">
              <label>Categories</label>
              <div className="d-flex flex-wrap">
                {categories.map((category) => (
                  <MDBCheckbox
                    key={category.id}
                    label={category.name}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="me-3"
                  />
                ))}
              </div>
            </div>
            <div className="text-end">
              <MDBBtn
                type="button"
                color="light"
                onClick={() => navigate("/jobs")}
                className="me-2"
              >
                Cancel
              </MDBBtn>
              <MDBBtn type="submit" color="primary">
                Post Job
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default CreateJobPage;
