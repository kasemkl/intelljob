import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JobData } from "../../types/job";
import { jobService } from "../../services/jobService";
import JobCard from "../../components/jobs/JobCard";
import { useAuth } from "../../contexts/AuthContext";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBSpinner,
  MDBTypography,
  MDBInput,
  MDBSelect,
  MDBSelectOption,
} from "mdb-react-ui-kit";

interface JobFilters {
  search: string;
  location: string;
  category: string;
  jobType: string;
}

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<MDBSelectOption[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    location: "",
    category: "",
    jobType: "",
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const isCompany = user?.role === "company";

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getAllJobs();
      setJobs(response.data);

      // Extract unique locations
      const uniqueLocations = [
        ...new Set(
          response.data
            .map((job) => job.location)
            .filter((location) => location) // Filter out null/undefined values
        ),
      ];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await jobService.getCategories();
      const categoryOptions = response.data.map((cat: any) => ({
        text: cat.name,
        value: cat.id.toString(),
      }));
      setCategories(categoryOptions);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((job) => job.location === filters.location);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((job) =>
        job.categories.some((cat) => cat.id.toString() === filters.category)
      );
    }

    // Apply job type filter
    if (filters.jobType) {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (field: keyof JobFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      category: "",
      jobType: "",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <MDBSpinner />
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5">
      <MDBContainer>
        <MDBCard className="shadow-0 border-0">
          <MDBCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <MDBTypography tag="h2" className="mb-1" color="primary">
                  Available Jobs
                </MDBTypography>
                <p className="text-muted mb-0">
                  {filteredJobs.length}{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"} available
                </p>
              </div>
              {isCompany && (
                <MDBBtn
                  onClick={() => navigate("/jobs/create")}
                  className="d-flex align-items-center"
                  rounded
                >
                  <i className="fas fa-plus me-2"></i>
                  Post New Job
                </MDBBtn>
              )}
            </div>

            {/* Filters Section */}
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow className="g-3">
                  <MDBCol md="6" lg="3">
                    <MDBInput
                      label="Search jobs"
                      type="text"
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                    />
                  </MDBCol>
                  <MDBCol md="6" lg="3">
                    <select
                      className="form-select"
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                    >
                      <option value="">All Locations</option>
                      {locations.map((location, index) => (
                        <option key={index} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </MDBCol>
                  <MDBCol md="6" lg="3">
                    <select
                      className="form-select"
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.text}
                        </option>
                      ))}
                    </select>
                  </MDBCol>
                  <MDBCol md="6" lg="3">
                    <select
                      className="form-select"
                      value={filters.jobType}
                      onChange={(e) =>
                        handleFilterChange("jobType", e.target.value)
                      }
                    >
                      <option value="">All Job Types</option>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </MDBCol>
                </MDBRow>
                <div className="text-end mt-3">
                  <MDBBtn color="link" onClick={resetFilters}>
                    Reset Filters
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            {filteredJobs.length === 0 ? (
              <MDBCard className="text-center shadow-0 border">
                <MDBCardBody className="py-5">
                  <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
                  <MDBTypography tag="h4" className="mb-3">
                    No jobs found
                  </MDBTypography>
                  <p className="text-muted mb-0">
                    Try adjusting your search criteria or check back later for
                    new opportunities.
                  </p>
                </MDBCardBody>
              </MDBCard>
            ) : (
              <MDBRow className="g-4">
                {filteredJobs.map((job) => (
                  <MDBCol key={job.id} md="6" lg="4">
                    <JobCard job={job} />
                  </MDBCol>
                ))}
              </MDBRow>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default JobListPage;
