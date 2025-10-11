import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import jsPDF from "jspdf";

interface PreviewDownloadProps {
  onBack: () => void;
  onEdit: () => void;
  onNavigateDashboard: () => void;
}

export function PreviewDownload({ onBack, onEdit, onNavigateDashboard }: PreviewDownloadProps) {
  const [resumeData, setResumeData] = useState<any>(null);

  useEffect(() => {
    // Load resume data from localStorage
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    } else {
      // Fallback to mock data if no saved data
      setResumeData(mockResumeData);
    }
  }, []);

  const handleDownloadPDF = () => {
    if (!resumeData) return;
    
    generatePDF(resumeData, 'download');
    toast.success("Resume exported successfully!");
    // Navigate to dashboard after successful download
    setTimeout(() => {
      onNavigateDashboard();
    }, 1500);
  };

  const handlePrint = () => {
    if (!resumeData) return;
    
    generatePDF(resumeData, 'print');
    toast.success("Resume PDF saved for printing!");
  };

  const generatePDF = (data: any, action: 'download' | 'print') => {
    const pdf = new jsPDF();
    const margin = 20;
    let yPosition = margin;
    const currentColor = '#2563EB';

    // Header
    pdf.setTextColor('#0F172A');
    pdf.setFontSize(24);
    pdf.text(data.personal.name, margin, yPosition);
    yPosition += 10;

    pdf.setTextColor(currentColor);
    pdf.setFontSize(16);
    pdf.text(data.personal.title, margin, yPosition);
    yPosition += 10;

    // Contact info
    pdf.setTextColor('#666666');
    pdf.setFontSize(10);
    let contactInfo = `${data.personal.email} | ${data.personal.phone} | ${data.personal.location}`;
    if (data.personal.linkedin) {
      contactInfo += ` | ${data.personal.linkedin}`;
    }
    pdf.text(contactInfo, margin, yPosition);
    yPosition += 15;

    // Professional Summary
    pdf.setTextColor(currentColor);
    pdf.setFontSize(14);
    pdf.text("Professional Summary", margin, yPosition);
    yPosition += 8;

    pdf.setTextColor('#0F172A');
    pdf.setFontSize(10);
    const summaryLines = pdf.splitTextToSize(data.personal.summary, 170);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 10;

    // Experience
    pdf.setTextColor(currentColor);
    pdf.setFontSize(14);
    pdf.text("Experience", margin, yPosition);
    yPosition += 8;

    data.experience.forEach((exp: any) => {
      pdf.setTextColor('#0F172A');
      pdf.setFontSize(12);
      pdf.text(exp.role, margin, yPosition);
      
      pdf.setTextColor(currentColor);
      pdf.setFontSize(10);
      pdf.text(exp.company, margin, yPosition + 5);
      
      pdf.setTextColor('#666666');
      pdf.text(exp.duration, 150, yPosition + 5);
      yPosition += 12;

      if (exp.description) {
        pdf.setTextColor('#0F172A');
        pdf.setFontSize(10);
        const descLines = pdf.splitTextToSize(exp.description, 170);
        pdf.text(descLines, margin, yPosition);
        yPosition += descLines.length * 4 + 8;
      }
    });

    // Education
    pdf.setTextColor(currentColor);
    pdf.setFontSize(14);
    pdf.text("Education", margin, yPosition);
    yPosition += 8;

    data.education.forEach((edu: any) => {
      pdf.setTextColor('#0F172A');
      pdf.setFontSize(12);
      pdf.text(edu.degree, margin, yPosition);
      
      pdf.setTextColor(currentColor);
      pdf.setFontSize(10);
      pdf.text(edu.school, margin, yPosition + 5);
      
      pdf.setTextColor('#666666');
      pdf.text(edu.year, 150, yPosition + 5);
      yPosition += 15;
    });

    // Skills
    pdf.setTextColor(currentColor);
    pdf.setFontSize(14);
    pdf.text("Skills", margin, yPosition);
    yPosition += 8;

    pdf.setTextColor('#0F172A');
    pdf.setFontSize(10);
    const skillsText = data.skills.join(", ");
    const skillsLines = pdf.splitTextToSize(skillsText, 170);
    pdf.text(skillsLines, margin, yPosition);
    yPosition += skillsLines.length * 5 + 10;

    // Projects
    if (data.projects && data.projects.length > 0 && data.projects[0].name) {
      pdf.setTextColor(currentColor);
      pdf.setFontSize(14);
      pdf.text("Projects", margin, yPosition);
      yPosition += 8;

      data.projects.forEach((project: any) => {
        if (project.name) {
          pdf.setTextColor('#0F172A');
          pdf.setFontSize(12);
          pdf.text(project.name, margin, yPosition);
          yPosition += 5;

          if (project.description) {
            pdf.setFontSize(10);
            const projLines = pdf.splitTextToSize(project.description, 170);
            pdf.text(projLines, margin, yPosition);
            yPosition += projLines.length * 4 + 8;
          }
        }
      });
    }

    const fileName = action === 'print' 
      ? `${data.personal.name.replace(/\s+/g, '_')}_Resume_Print.pdf`
      : `${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
    
    pdf.save(fileName);
  };

  // Mock resume data for fallback
  const mockResumeData = {
    personal: {
      name: "John Doe",
      title: "Software Engineer",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "",
      summary: "Experienced software engineer with expertise in full-stack development and a passion for creating innovative solutions. Proven track record of delivering high-quality applications and leading successful projects."
    },
    experience: [
      {
        role: "Senior Software Engineer",
        company: "Tech Corp",
        duration: "2022-Present",
        description: "Led development of web applications using React and Node.js. Collaborated with cross-functional teams to deliver scalable solutions."
      },
      {
        role: "Software Developer",
        company: "StartupXYZ",
        duration: "2020-2022",
        description: "Developed and maintained multiple client projects. Implemented modern front-end frameworks and optimized application performance."
      }
    ],
    education: [
      {
        degree: "Bachelor of Computer Science",
        school: "University of California",
        year: "2018-2022"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "TypeScript", "AWS"],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce solution with React and Node.js",
        tech: "React, Node.js, MongoDB",
        link: ""
      }
    ]
  };

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-[#0F172A]">Preview Your Resume</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Preview Area */}
          <div className="col-span-9">
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-8 mx-auto" style={{ width: '595px', minHeight: '842px' }}>
              {/* Resume Content */}
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b-2 border-[#2563EB] pb-4">
                  <h1 className="text-3xl font-bold text-[#0F172A]">{resumeData.personal.name}</h1>
                  <h2 className="text-xl text-[#2563EB]">{resumeData.personal.title}</h2>
                  <div className="text-[#64748B] mt-2">
                    {resumeData.personal.email} | {resumeData.personal.phone} | {resumeData.personal.location}
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2563EB] mb-2">Professional Summary</h3>
                  <p className="text-[#0F172A] leading-relaxed">{resumeData.personal.summary}</p>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2563EB] mb-3">Professional Experience</h3>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium text-[#0F172A]">{exp.role}</h4>
                          <p className="text-[#2563EB]">{exp.company}</p>
                        </div>
                        <span className="text-[#64748B] font-medium">{exp.duration}</span>
                      </div>
                      <p className="text-[#0F172A] mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2563EB] mb-3">Education</h3>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-[#0F172A]">{edu.degree}</h4>
                          <p className="text-[#2563EB]">{edu.school}</p>
                        </div>
                        <span className="text-[#64748B] font-medium">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2563EB] mb-3">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                {resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0].name && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#2563EB] mb-3">Projects</h3>
                    {resumeData.projects.map((project: any, index: number) => (
                      project.name && (
                        <div key={index} className="mb-4">
                          <h4 className="font-medium text-[#0F172A]">{project.name}</h4>
                          <p className="text-[#0F172A] mt-1 leading-relaxed">{project.description}</p>
                          {project.tech && <p className="text-[#64748B] text-sm mt-1">Technologies: {project.tech}</p>}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Action Buttons */}
          <div className="col-span-3">
            <div className="sticky top-8 space-y-4">
              <div className="bg-[#F8FAFC] rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-[#0F172A] mb-4">Export Options</h3>
                
                <Button 
                  onClick={handleDownloadPDF}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white transition-colors duration-200"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>

                <Button 
                  onClick={handlePrint}
                  variant="outline" 
                  className="w-full border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
                  size="lg"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Resume
                </Button>

                <Button 
                  onClick={onEdit}
                  variant="ghost" 
                  className="w-full text-[#64748B] hover:text-[#2563EB] transition-colors duration-200"
                >
                  Back to Edit
                </Button>
              </div>

              {/* Tips */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
                <h4 className="font-semibold text-[#0F172A] mb-3">💡 Pro Tips</h4>
                <ul className="space-y-2 text-sm text-[#64748B]">
                  <li>• Keep your resume to 1-2 pages</li>
                  <li>• Use action verbs in descriptions</li>
                  <li>• Quantify achievements with numbers</li>
                  <li>• Tailor content for each application</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}