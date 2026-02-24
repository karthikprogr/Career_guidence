import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCapIcon, 
  FileTextIcon, 
  LocationIcon, 
  BuildingIcon, 
  CheckIcon,
  ChartIcon,
  UsersIcon,
  AwardIcon
} from '../components/Icons';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">Your Future Starts Here</span>
            <h1 className="hero-title">
              Find the Right Career Path<br />
              <span className="hero-highlight">Made Simple for Students</span>
            </h1>
            <p className="hero-description">
              Confused about which career to choose? Our step-by-step guidance system 
              helps you discover your strengths, explore career options, and find the 
              best colleges that match your goals.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-large">
                Get Started - It's Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Already have an account? Login
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <strong>6+</strong>
                <span>Career Paths</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>500+</strong>
                <span>Colleges Listed</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>Free</strong>
                <span>Aptitude Test</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2>How It Works</h2>
            <p>Follow these 5 easy steps to find your ideal career and college</p>
          </div>

          <div className="steps-timeline">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon-wrapper step-blue">
                <UsersIcon size={28} />
              </div>
              <h3>Create Your Profile</h3>
              <p>
                Sign up and fill in your academic details like CGPA, exam scores, 
                and personal information. This helps us understand your background.
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon-wrapper step-green">
                <GraduationCapIcon size={28} />
              </div>
              <h3>Choose Your Career</h3>
              <p>
                Explore 6 career fields - Engineering, Management, Medical, Law, 
                Science, and Arts. Read about job prospects, salaries, and required skills.
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon-wrapper step-orange">
                <LocationIcon size={28} />
              </div>
              <h3>Pick Your Location</h3>
              <p>
                Choose whether you want to study in India or Abroad. Each option 
                has different benefits, fees, and opportunities to explore.
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon-wrapper step-red">
                <FileTextIcon size={28} />
              </div>
              <h3>Take Aptitude Test</h3>
              <p>
                Take a 30-minute aptitude test covering Verbal, Quantitative, and 
                General Knowledge. This helps assess your strengths and readiness.
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">5</div>
              <div className="step-icon-wrapper step-teal">
                <BuildingIcon size={28} />
              </div>
              <h3>Find Best Colleges</h3>
              <p>
                Based on your career choice, location, scores, and aptitude results, 
                browse and compare colleges. Apply directly to your top picks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Paths Overview */}
      <section className="careers-overview-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Explore Options</span>
            <h2>Career Paths Available</h2>
            <p>We guide you through these major career fields with detailed information</p>
          </div>

          <div className="careers-grid">
            <div className="career-preview-card">
              <div className="career-icon-bg engineering">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <h3>Engineering</h3>
              <p>Software, Mechanical, Civil, Electrical and more</p>
              <div className="career-tags">
                <span>High Demand</span>
                <span>Tech Industry</span>
              </div>
            </div>

            <div className="career-preview-card">
              <div className="career-icon-bg management">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <h3>Management</h3>
              <p>MBA, Finance, Marketing, Human Resources</p>
              <div className="career-tags">
                <span>Leadership</span>
                <span>Business</span>
              </div>
            </div>

            <div className="career-preview-card">
              <div className="career-icon-bg medical">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3>Medical</h3>
              <p>MBBS, BDS, Pharmacy, Nursing, Biotech</p>
              <div className="career-tags">
                <span>Healthcare</span>
                <span>Service</span>
              </div>
            </div>

            <div className="career-preview-card">
              <div className="career-icon-bg law">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3>Law</h3>
              <p>Corporate Law, Criminal Law, Civil Law</p>
              <div className="career-tags">
                <span>Justice</span>
                <span>Advocacy</span>
              </div>
            </div>

            <div className="career-preview-card">
              <div className="career-icon-bg science">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h3>Science</h3>
              <p>Physics, Chemistry, Mathematics, Research</p>
              <div className="career-tags">
                <span>Research</span>
                <span>Innovation</span>
              </div>
            </div>

            <div className="career-preview-card">
              <div className="career-icon-bg arts">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3>Arts & Humanities</h3>
              <p>Design, Literature, Media, Performing Arts</p>
              <div className="career-tags">
                <span>Creative</span>
                <span>Expression</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2>Everything You Need to Decide</h2>
            <p>We provide all the tools and information to make your career decision easier</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ChartIcon size={28} />
              </div>
              <h3>Aptitude Assessment</h3>
              <p>
                Take a comprehensive aptitude test that evaluates your Verbal, 
                Quantitative, and General Knowledge abilities to understand your strengths.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BuildingIcon size={28} />
              </div>
              <h3>500+ College Database</h3>
              <p>
                Browse through hundreds of colleges with detailed information about 
                fees, rankings, placements, facilities, and eligibility requirements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <AwardIcon size={28} />
              </div>
              <h3>Smart Matching</h3>
              <p>
                Our system matches your profile, scores, and preferences with the 
                most suitable colleges, so you only see relevant options.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <GraduationCapIcon size={28} />
              </div>
              <h3>Career Roadmaps</h3>
              <p>
                Get detailed career roadmaps showing entry requirements, job roles, 
                salary ranges, and growth paths for each career field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Find Your Perfect Career?</h2>
            <p>
              Join thousands of students who have used our platform to make 
              informed career decisions. It takes less than 5 minutes to get started.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-large">
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-large">
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <GraduationCapIcon size={24} />
              <span>Career Guidance</span>
            </div>
            <p className="footer-text">
              Helping students make informed career decisions since 2024.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
