import {
  FaRocket,
  FaUsers,
  FaLightbulb,
  FaBrain,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";
import "../styles/about-page.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-content">
          <h1>Transforming Recruitment Through AI</h1>
          <p>
            We're revolutionizing the way companies and talent connect, using
            cutting-edge AI technology to create perfect matches in the
            professional world.
          </p>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            To streamline the recruitment process by leveraging artificial
            intelligence, making job searching and hiring more efficient,
            transparent, and successful for everyone involved.
          </p>
          <div className="mission-stats">
            <div className="stat-box">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">5k+</span>
              <span className="stat-label">Companies</span>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaRocket className="value-icon" />
            <h3>Innovation</h3>
            <p>
              Constantly evolving our AI technology to stay ahead of industry
              needs
            </p>
          </div>
          <div className="value-card">
            <FaUsers className="value-icon" />
            <h3>Community</h3>
            <p>Building strong connections between companies and talent</p>
          </div>
          <div className="value-card">
            <FaLightbulb className="value-icon" />
            <h3>Excellence</h3>
            <p>Maintaining the highest standards in recruitment solutions</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-box">
            <FaBrain className="feature-icon" />
            <div className="feature-content">
              <h3>AI-Powered Matching</h3>
              <p>
                Smart algorithms that understand both technical skills and
                cultural fit
              </p>
            </div>
          </div>
          <div className="feature-box">
            <FaHandshake className="feature-icon" />
            <div className="feature-content">
              <h3>Seamless Experience</h3>
              <p>User-friendly platform for both companies and job seekers</p>
            </div>
          </div>
          <div className="feature-box">
            <FaChartLine className="feature-icon" />
            <div className="feature-content">
              <h3>Data-Driven Insights</h3>
              <p>Comprehensive analytics to make informed decisions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Our Leadership Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-photo">
              <img src={`/team-member-.jpg`} alt="Team Member" />
            </div>
            <h3>Kasem Al kilani</h3>
            <p className="member-role">Software Engineer</p>
            <p className="member-desc"></p>
          </div>

          <div className="team-member">
            <div className="member-photo">
              <img src={`/team-member-.jpg`} alt="Team Member" />
            </div>
            <h3>Abdullah KH</h3>
            <p className="member-role">AI Engineer</p>
            <p className="member-desc"></p>
          </div>

          <div className="team-member">
            <div className="member-photo">
              <img src={`/team-member-.jpg`} alt="Team Member" />
            </div>
            <h3>Yasser Dokmak</h3>
            <p className="member-role">Software Engineer</p>
            <p className="member-desc"></p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-content">
          <h2>Get in Touch</h2>
          <p>
            Want to learn more about how we can help transform your recruitment
            process?
          </p>
          <button className="contact-btn">Contact Us</button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
