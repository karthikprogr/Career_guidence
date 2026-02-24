import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { CheckIcon } from '../components/Icons';
import './CareerRoadmap.css';

const roadmaps = {
  engineering: {
    title: 'Engineering Career Roadmap',
    color: '#2563eb',
    steps: [
      { phase: 'Class 11-12', title: 'Foundation', description: 'Study PCM (Physics, Chemistry, Math). Start preparing for JEE/entrance exams. Build logical thinking skills.', tip: 'Join coaching early and practice previous years papers' },
      { phase: 'Entrance Exams', title: 'Clear Entrance', description: 'Appear for JEE Main, JEE Advanced, BITSAT, state CETs, or university-specific exams.', tip: 'Apply to multiple colleges to increase your chances' },
      { phase: 'B.Tech/B.E. (4 Years)', title: 'Undergraduate Degree', description: 'Choose a branch (CS, Mechanical, Civil, etc.). Focus on fundamentals, do internships, build projects.', tip: 'Internships and projects matter more than just grades' },
      { phase: 'After Graduation', title: 'Career Entry', description: 'Campus placements, off-campus hiring, or M.Tech/MS for specialization. Start earning 4-25 LPA.', tip: 'Keep upskilling - certifications in cloud, AI, or data science boost your profile' },
      { phase: '3-5 Years', title: 'Growth Phase', description: 'Specialize in your area, take leadership roles, or pursue MBA. Move into senior roles or switch to product management.', tip: 'Networking and side projects can accelerate your career growth' },
    ]
  },
  management: {
    title: 'Management Career Roadmap',
    color: '#7c3aed',
    steps: [
      { phase: 'Class 11-12', title: 'Foundation', description: 'Study Commerce or any stream. Develop communication, leadership, and analytical skills.', tip: 'Start participating in debate, MUN, and business quizzes' },
      { phase: 'BBA/B.Com (3 Years)', title: 'Undergraduate Degree', description: 'Study business fundamentals - finance, marketing, HR, operations. Do internships in corporate settings.', tip: 'MBA entrance prep can start in final year of graduation' },
      { phase: 'Entrance Exams', title: 'MBA Entrance', description: 'Prepare for CAT, XAT, GMAT, MAT, or NMAT. Strong quantitative and verbal skills are key.', tip: 'Target 95+ percentile in CAT for IIMs' },
      { phase: 'MBA (2 Years)', title: 'Postgraduate Degree', description: 'Specialize in Finance, Marketing, HR, or Operations. Summer internships are crucial for placements.', tip: 'Your summer internship often converts into a full-time offer' },
      { phase: 'Career Start', title: 'Corporate Career', description: 'Enter roles like Business Analyst, Consultant, Brand Manager. Starting salary: 8-30 LPA from top B-schools.', tip: 'Consulting and investment banking are the highest-paying MBA paths' },
    ]
  },
  medical: {
    title: 'Medical Career Roadmap',
    color: '#dc2626',
    steps: [
      { phase: 'Class 11-12', title: 'Foundation', description: 'Study PCB (Physics, Chemistry, Biology). Start NEET preparation alongside school studies.', tip: 'NEET is the only entrance exam for medical in India - focus 100% on it' },
      { phase: 'NEET UG', title: 'Clear Entrance', description: 'Score well in NEET UG (650+ for top government colleges). Apply through counseling process.', tip: 'Government college seats are much cheaper - target them first' },
      { phase: 'MBBS (5.5 Years)', title: 'Medical Degree', description: '4.5 years of study + 1 year mandatory internship. Learn clinical skills, anatomy, pharmacology, and more.', tip: 'Clinical rotations in final years are the most important learning phase' },
      { phase: 'NEET PG / Specialization', title: 'Postgraduate', description: 'Choose specialization - Surgery, Cardiology, Dermatology, Pediatrics, etc. MD/MS takes 3 years.', tip: 'Specialization significantly increases your earning potential' },
      { phase: 'Practice', title: 'Medical Career', description: 'Work in hospitals, start own practice, or join research. Earning: 5-50 LPA and growing.', tip: 'Super-specializations (DM/MCh) can take earnings above 1 Crore PA' },
    ]
  },
  law: {
    title: 'Law Career Roadmap',
    color: '#d97706',
    steps: [
      { phase: 'Class 11-12', title: 'Foundation', description: 'Any stream works. Develop reading habit, logical reasoning, and general knowledge.', tip: 'Read newspapers daily and follow current affairs for CLAT prep' },
      { phase: 'Entrance Exams', title: 'Clear Entrance', description: 'Appear for CLAT, AILET, LSAT-India, or BHU UET for top National Law Universities.', tip: 'CLAT coaching combined with self-study works best' },
      { phase: 'BA LLB (5 Years)', title: 'Integrated Law Degree', description: 'Study Constitutional, Criminal, Corporate, and International Law. Moot courts and internships are essential.', tip: 'Intern at law firms and courts during every semester break' },
      { phase: 'Specialization', title: 'Choose Your Path', description: 'Corporate Law (highest paying), Litigation, Criminal Law, IP Law, or International Law.', tip: 'Corporate law firms offer 15-30 LPA to fresh NLU graduates' },
      { phase: 'Career Growth', title: 'Legal Career', description: 'Join law firms, start independent practice, or work in legal departments of companies.', tip: 'Building a strong reputation in your first 5 years defines your career' },
    ]
  },
  science: {
    title: 'Science Career Roadmap',
    color: '#059669',
    steps: [
      { phase: 'Class 11-12', title: 'Foundation', description: 'Study PCM or PCB based on interest. Develop curiosity and research mindset.', tip: 'Participate in science olympiads and fairs' },
      { phase: 'B.Sc (3 Years)', title: 'Undergraduate Degree', description: 'Choose Physics, Chemistry, Math, Biology, or Environmental Science. Focus on labs and research projects.', tip: 'A strong B.Sc foundation opens doors to top M.Sc programs' },
      { phase: 'M.Sc (2 Years)', title: 'Master\'s Degree', description: 'Specialize deeply. Entrance: IIT JAM, JEST, university exams. Start research work.', tip: 'Choose a professor with active research funding for your thesis' },
      { phase: 'PhD (3-5 Years)', title: 'Doctoral Research', description: 'Deep research in your field. Entrance: CSIR NET, GATE. Get fellowship stipend of 31,000-35,000/month.', tip: 'Publications in good journals are the currency of academic careers' },
      { phase: 'Career Options', title: 'Research Career', description: 'Professor, Research Scientist, Industry R&D, Science Communication, Data Science.', tip: 'Industry R&D roles in pharma and tech pay 8-25 LPA for PhD holders' },
    ]
  },
  arts: {
    title: 'Arts & Humanities Career Roadmap',
    color: '#ec4899',
    steps: [
      { phase: 'Class 11-12', title: 'Foundation', description: 'Study Arts/Humanities. Develop creative skills, portfolio building, and communication abilities.', tip: 'Start building your portfolio early - it matters more than grades' },
      { phase: 'Entrance/Portfolio', title: 'Admission Process', description: 'Prepare for NID, NIFT, UCEED for design, or merit-based admission for BA programs.', tip: 'Design entrance exams focus heavily on sketching and creative thinking' },
      { phase: 'BA/BFA/B.Des (3-4 Years)', title: 'Undergraduate Degree', description: 'Study your chosen field - Design, Fine Arts, Literature, Journalism, or Media. Build a strong portfolio.', tip: 'Freelance projects during college build real-world experience' },
      { phase: 'Specialization', title: 'Skill Development', description: 'Specialize in UX/UI Design, Content Strategy, Film Making, Animation, or Digital Media.', tip: 'UX/UI Design is the highest paying path in arts right now' },
      { phase: 'Career Entry', title: 'Creative Career', description: 'Work in design studios, media houses, advertising agencies, or as a freelancer. Earning: 3-15 LPA.', tip: 'A strong online portfolio and social media presence can land you global clients' },
    ]
  }
};

function CareerRoadmap() {
  const [selectedCareer, setSelectedCareer] = useState('engineering');
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const studentDoc = await getDoc(doc(db, 'students', auth.currentUser.uid));
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        setStudentData(data);
        if (data.preferences?.career) {
          setSelectedCareer(data.preferences.career);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const currentRoadmap = roadmaps[selectedCareer];

  return (
    <div className="roadmap-page">
      <div className="container">
        <div className="roadmap-header">
          <h1>Career Roadmap</h1>
          <p>See the complete journey from school to career for each field</p>
        </div>

        {/* Career Tabs */}
        <div className="career-tabs">
          {Object.entries(roadmaps).map(([key, roadmap]) => (
            <button
              key={key}
              className={`career-tab ${selectedCareer === key ? 'active' : ''}`}
              onClick={() => setSelectedCareer(key)}
              style={selectedCareer === key ? { borderColor: roadmap.color, color: roadmap.color } : {}}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Roadmap Timeline */}
        <div className="roadmap-timeline">
          <h2 style={{ color: currentRoadmap.color }}>{currentRoadmap.title}</h2>
          
          <div className="timeline">
            {currentRoadmap.steps.map((step, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker" style={{ background: currentRoadmap.color }}>
                  {index + 1}
                </div>
                <div className="timeline-content">
                  <span className="timeline-phase" style={{ color: currentRoadmap.color }}>{step.phase}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="timeline-tip">
                    <strong>Tip:</strong> {step.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="roadmap-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/student')}>
            Back to Dashboard
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/career-selection')}>
            Choose This Career
          </button>
        </div>
      </div>
    </div>
  );
}

export default CareerRoadmap;
