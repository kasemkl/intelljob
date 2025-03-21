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
  MDBCardHeader,
  MDBCardFooter,
  MDBAlert,
} from "mdb-react-ui-kit";
import { jobService, JobData, JobRequirement } from "../../services/jobService";
import { toast } from "react-toastify";
import locationService, { City } from "../../services/locationService";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../contexts/AuthContext";
import categoryService, { Category } from "../../services/categoryService";
import { quizService } from "../../services/quizService";
import cvParsingApi from "../../services/api/cvParsingApi";
import "./CreateJobPage.css"; // Custom CSS for additional styling

interface FormData {
  title: string;
  description: string;
  salaryRange: string;
  companyId: string;
  locationId: string;
  status: string;
  categories: Category[];
  requirements: JobRequirement[];
  postDate: string;
  experienceYears: number;
  gender: string;
  jobType: string;
  educationLevel: string;
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
    status: "Open",
    categories: [],
    requirements: [],
    postDate: new Date().toISOString().split('T')[0], // Default to today's date
    experienceYears: 0,
    gender: "Any",
    jobType: "Full-time",
    educationLevel: "Bachelor's",
  });

  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isQuizRequired, setIsQuizRequired] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [numQuestions,setNumQuestions]= useState<number>(5);
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

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.length === 0) {
      toast.error("Please add at least one requirement to generate a quiz.");
      return;
    }
    setIsGeneratingQuiz(true);
    try {
      const skillsAndRequirements = [
        ...formData.categories.map((cat) => cat.name),
        ...requirements,
      ].join(", ");

      const response = await cvParsingApi.post("/generate-questions/", {
        skill: skillsAndRequirements,
        difficulty: difficulty, // Use the selected difficulty
        question_type: "multiple_choice",
        num_questions: numQuestions, // Use the selected number of questions
        model: "qwen2.5:3b",
      });

      setQuizQuestions(
        response.data.questions.map((q: any) => ({
          text: q.question,
          duration: 10, // Default duration
          choices: q.options.map((option: string, index: number) => ({
            text: option,
            isCorrect: (index + 1).toString() === q.correct_answer,
          })),
        }))
      );

      toast.success("Quiz questions generated successfully!");
    } catch (error) {
      toast.error("Failed to generate quiz questions");
      console.error("Error generating quiz questions:", error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizQuestionChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setQuizQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return updatedQuestions;
    });
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    setQuizQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].choices[choiceIndex].text = value;
      return updatedQuestions;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData: JobData = {
        ...formData,
        requirements: requirements.map((req) => ({ description: req })),
        categories: selectedCategories.map((id) => ({ id })),
        // isQuizRequired: isQuizRequired,
      };

      // Create job post
      const jobResponse = await jobService.createJob(jobData);
      toast.success("Job posted successfully!");
      console.log(jobResponse.data);

      // If quiz is required, create quiz
      
      if (isQuizRequired) {
        await quizService.createOrUpdateQuiz({
        
          title: `Quiz for Job ${formData.title}`,
          description: "A quiz to test relevant skills for the job.",
          jobPostId: jobResponse.data.id,
          questions: quizQuestions.map((q) => ({
            text: q.text,
            point: 5,
            questionType: "MULTIPLE_CHOICE",
            duration: q.duration,
            choices: q.choices,
          })),
        });
        toast.success("Quiz created successfully!");
      }

      navigate("/jobs");
    } catch (error) {
      toast.error("Failed to create job or quiz");
      console.error("Error creating job or quiz:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <MDBCard className="shadow-lg">
        <MDBCardHeader className="text-center bg-primary text-white">
          <h1>Post New Job</h1>
        </MDBCardHeader>
        <MDBCardBody>
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
              className="mb-4 auto-expand"
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
            <MDBRow className="mb-4">
              <MDBCol md="6">
                <MDBInput
                  label="Post Date"
                  name="postDate"
                  type="date"
                  value={formData.postDate}
                  onChange={handleChange}
                  required
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput
                  label="Experience Years"
                  name="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="6">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </MDBCol>
              <MDBCol md="6">
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="12">
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                  <option value="High School">High School</option>
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
            <div className="mb-4">
              <MDBCheckbox
                label="Require Quiz"
                checked={isQuizRequired}
                onChange={(e) => setIsQuizRequired(e.target.checked)}
              />
            </div>
            {isQuizRequired && (
              <div className="quiz-section">
                <MDBRow className="mb-4">
                  <MDBCol md="6">
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="form-select"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      label="Number of Questions"
                      type="number"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                      min={1}
                      className="mb-2"
                    />
                  </MDBCol>
                </MDBRow>
                <MDBBtn
                  color="primary"
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                >
                  {isGeneratingQuiz ? (
                    <MDBSpinner size="sm" role="status" />
                  ) : (
                    "Generate Quiz"
                  )}
                </MDBBtn>
                <h4 className="mt-4">Quiz Questions</h4>
                {quizQuestions.map((question, index) => (
                  <div key={index} className="quiz-question">
                    <MDBInput
                      label="Question Text"
                      value={question.text}
                      onChange={(e) =>
                        handleQuizQuestionChange(index, "text", e.target.value)
                      }
                      className="mb-2"
                    />
                    <MDBInput
                      label="Duration (seconds)"
                      type="number"
                      value={question.duration}
                      onChange={(e) =>
                        handleQuizQuestionChange(
                          index,
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      className="mb-2"
                    />
                    <div className="choices">
                      {question.choices.map(
                        (choice: any, choiceIndex: number) => (
                          <div
                            key={choiceIndex}
                            className="d-flex align-items-center mb-2"
                          >
                            <MDBInput
                              label={`Choice ${choiceIndex + 1}`}
                              value={choice.text}
                              onChange={(e) =>
                                handleChoiceChange(
                                  index,
                                  choiceIndex,
                                  e.target.value
                                )
                              }
                              className="me-2"
                            />
                            {choice.isCorrect && (
                              <MDBIcon
                                fas
                                icon="check-circle"
                                className="text-success"
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        <MDBCardFooter className="text-center">
          <small className="text-muted">
            Ensure all fields are filled correctly before submission.
          </small>
        </MDBCardFooter>
      </MDBCard>
    </MDBContainer>
  );
};

export default CreateJobPage;
