import { Link } from "react-router-dom";
import "../styles/landing-page.css";
import landingPic from "../assets/landing_pic.jpg";
import {
  FaUserTie,
  FaBuilding,
  FaBrain,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaBriefcase,
  FaArrowUp,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Smart HR Recruitment System</h1>
          <p>
            Transform your hiring process with AI-powered recruitment. Connect
            top talent with leading companies through intelligent matching and
            skill assessments.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={landingPic} alt="Smart HR Recruitment Platform" />
        </div>
      </section>

      <section className="features">
        <h2>Intelligent Recruitment Solutions</h2>
        <p className="features-subtitle">
          Our AI-powered platform streamlines the entire recruitment process for
          both job seekers and companies
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <i>
              <FaUserTie />
            </i>
            <h3>For Job Seekers</h3>
            <p>
              Create professional profiles, receive personalized job
              recommendations, and showcase your skills through AI-generated
              assessments.
            </p>
          </div>
          <div className="feature-card">
            <i>
              <FaBuilding />
            </i>
            <h3>For Companies</h3>
            <p>
              Post jobs, screen candidates efficiently, and use AI-powered
              insights to make data-driven hiring decisions.
            </p>
          </div>
          <div className="feature-card">
            <i>
              <FaBrain />
            </i>
            <h3>Smart Assessment</h3>
            <p>
              System-generated quizzes evaluate candidates' skills objectively,
              ensuring the perfect match for each role.
            </p>
          </div>
          <div className="feature-card">
            <i>
              <FaChartLine />
            </i>
            <h3>Analytics & Insights</h3>
            <p>
              Access detailed analytics on market trends, skills demand, and
              recruitment performance metrics.
            </p>
          </div>
          <div className="feature-card">
            <i>
              <FaShieldAlt />
            </i>
            <h3>Secure Platform</h3>
            <p>
              Advanced security measures protect your data while maintaining
              complete transparency in the hiring process.
            </p>
          </div>
          <div className="feature-card">
            <i>
              <FaRocket />
            </i>
            <h3>Career Growth</h3>
            <p>
              Discover opportunities aligned with your skills and take
              system-generated assessments to advance your career.
            </p>
          </div>
        </div>
      </section>

      <section className="stats">
        <h2 className="stats-title">Our Impact in Numbers</h2>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-circle">
              <FaBriefcase className="icon" />
              <svg className="progress-ring">
                <circle className="progress-ring-circle" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <span className="counter">10</span>k+
                <span className="stat-label">Active Jobs</span>
              </div>
              <div className="stat-info">
                <div className="stat-metric">
                  <span className="metric-value">+2.5k</span>
                  <span className="metric-period">This Month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-circle">
              <FaBuilding className="icon" />
              <svg className="progress-ring">
                <circle className="progress-ring-circle" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <span className="counter">5</span>k+
                <span className="stat-label">Companies</span>
              </div>
              <div className="stat-info">
                <div className="stat-metric">
                  <span className="metric-value">93%</span>
                  <span className="metric-period">Retention Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-circle">
              <FaUsers className="icon" />
              <svg className="progress-ring">
                <circle className="progress-ring-circle" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <span className="counter">50</span>k+
                <span className="stat-label">Job Seekers</span>
              </div>
              <div className="stat-info">
                <div className="stat-metric">
                  <span className="metric-value">85%</span>
                  <span className="metric-period">Placement Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-circle">
              <FaCheckCircle className="icon" />
              <svg className="progress-ring">
                <circle className="progress-ring-circle" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <span className="counter">95</span>%
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat-info">
                <div className="stat-metric">
                  <span className="metric-value">#1</span>
                  <span className="metric-period">In Industry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Transform Your Recruitment Process?</h2>
        <p>
          Join thousands of companies and job seekers using our AI-powered
          platform to make smarter hiring decisions and advance careers.
        </p>
        <Link to="/signup" className="btn btn-primary">
          Start Your Journey
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
