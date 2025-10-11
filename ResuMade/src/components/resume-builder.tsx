import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Plus, Save, RotateCcw, FileText, Download, Printer } from "lucide-react";
import { toast } from "sonner@2.0.3";
import jsPDF from "jspdf";

interface ResumeBuilderProps {
  selectedTemplate: string;
  onPreview: () => void;
  onBack: () => void;
}

export function ResumeBuilder({ selectedTemplate, onPreview, onBack }: ResumeBuilderProps) {
  const [formData, setFormData] = useState({
    personal: {
      name: "John Doe",
      title: "Software Engineer",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      summary: "Experienced software engineer with expertise in full-stack development..."
    },
    education: [
      { school: "University of California", degree: "Bachelor of Computer Science", year: "2018-2022" }
    ],
    experience: [
      { company: "Tech Corp", role: "Software Engineer", duration: "2022-Present", description: "Led development of web applications..." }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python"],
    projects: [
      { name: "E-commerce Platform", description: "Built a full-stack e-commerce solution", tech: "React, Node.js, MongoDB", link: "" }
    ]
  });

  const [currentTemplate, setCurrentTemplate] = useState(selectedTemplate);
  const [currentColor, setCurrentColor] = useState("#2563EB");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"
  ];

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateURL = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const validatePhone = (phone: string) => {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length === 10;
  };

  const validateNumericYear = (year: string) => {
    return /^\d{4}(-\d{4})?$/.test(year) || /^\d{4}-Present$/i.test(year);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal validation
    if (!formData.personal.name.trim()) newErrors.name = "Full name is required";
    if (!formData.personal.title.trim()) newErrors.title = "Professional title is required";
    if (!formData.personal.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.personal.email)) newErrors.email = "Enter a valid email";
    if (!formData.personal.phone.trim()) newErrors.phone = "Phone is required";
    else if (!validatePhone(formData.personal.phone)) newErrors.phone = "Phone must contain 10 digits";
    if (!formData.personal.location.trim()) newErrors.location = "Location is required";
    if (!formData.personal.summary.trim()) newErrors.summary = "Professional summary is required";
    if (formData.personal.linkedin && !validateURL(formData.personal.linkedin)) {
      newErrors.linkedin = "Enter a valid LinkedIn URL";
    }

    // Education validation
    formData.education.forEach((edu, index) => {
      if (!edu.degree.trim()) newErrors[`education-${index}-degree`] = "Degree is required";
      if (!edu.school.trim()) newErrors[`education-${index}-school`] = "Institution is required";
      if (!edu.year.trim()) newErrors[`education-${index}-year`] = "Year is required";
      else if (!validateNumericYear(edu.year)) newErrors[`education-${index}-year`] = "Enter a valid year (e.g., 2018-2022)";
    });

    // Experience validation
    formData.experience.forEach((exp, index) => {
      if (!exp.role.trim()) newErrors[`experience-${index}-role`] = "Job title is required";
      if (!exp.company.trim()) newErrors[`experience-${index}-company`] = "Company is required";
      if (!exp.duration.trim()) newErrors[`experience-${index}-duration`] = "Duration is required";
    });

    // Skills validation
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";

    // Projects validation
    formData.projects.forEach((project, index) => {
      if (!project.name.trim()) newErrors[`project-${index}-name`] = "Project name is required";
      if (!project.description.trim()) newErrors[`project-${index}-description`] = "Project description is required";
      if (project.link && !validateURL(project.link)) {
        newErrors[`project-${index}-link`] = "Enter a valid project URL";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving.");
      return;
    }
    localStorage.setItem('resumeData', JSON.stringify(formData));
    toast.success("Resume saved successfully!");
  };

  const handleReset = () => {
    setFormData({
      personal: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        summary: ""
      },
      education: [{ school: "", degree: "", year: "" }],
      experience: [{ company: "", role: "", duration: "", description: "" }],
      skills: [],
      projects: [{ name: "", description: "", tech: "", link: "" }]
    });
    setErrors({});
    toast.success("Form reset successfully!");
  };

  const handleDownloadPDF = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before downloading.");
      return;
    }
    const pdf = new jsPDF();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setTextColor('#0F172A');
    pdf.setFontSize(24);
    pdf.text(formData.personal.name, margin, yPosition);
    yPosition += 10;

    pdf.setTextColor(currentColor);
    pdf.setFontSize(16);
    pdf.text(formData.personal.title, margin, yPosition);
    yPosition += 10;

    // Contact info
    pdf.setTextColor('#666666');
    pdf.setFontSize(10);
    let contactInfo = `${formData.personal.email} | ${formData.personal.phone} | ${formData.personal.location}`;
    if (formData.personal.linkedin) {
      contactInfo += ` | ${formData.personal.linkedin}`;
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
    const summaryLines = pdf.splitTextToSize(formData.personal.summary, 170);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 10;

    // Experience
    pdf.setTextColor(currentColor);
    pdf.setFontSize(14);
    pdf.text("Experience", margin, yPosition);
    yPosition += 8;

    formData.experience.forEach((exp) => {
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

    formData.education.forEach((edu) => {
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
    const skillsText = formData.skills.join(", ");
    const skillsLines = pdf.splitTextToSize(skillsText, 170);
    pdf.text(skillsLines, margin, yPosition);
    yPosition += skillsLines.length * 5 + 10;

    // Projects
    if (formData.projects.length > 0 && formData.projects[0].name) {
      pdf.setTextColor(currentColor);
      pdf.setFontSize(14);
      pdf.text("Projects", margin, yPosition);
      yPosition += 8;

      formData.projects.forEach((project) => {
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

    pdf.save(`${formData.personal.name.replace(/\s+/g, '_')}_Resume.pdf`);
    toast.success("Resume saved successfully!");
  };

  const handlePreviewPDF = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before previewing.");
      return;
    }
    onPreview();
  };

  const handlePrint = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before printing.");
      return;
    }
    // Generate PDF and trigger download for printing
    const pdf = new jsPDF();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setTextColor('#0F172A');
    pdf.setFontSize(24);
    pdf.text(formData.personal.name, margin, yPosition);
    yPosition += 10;

    pdf.setTextColor(currentColor);
    pdf.setFontSize(16);
    pdf.text(formData.personal.title, margin, yPosition);
    yPosition += 10;

    // Contact info
    pdf.setTextColor('#666666');
    pdf.setFontSize(10);
    let contactInfo = `${formData.personal.email} | ${formData.personal.phone} | ${formData.personal.location}`;
    if (formData.personal.linkedin) {
      contactInfo += ` | ${formData.personal.linkedin}`;
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
    const summaryLines = pdf.splitTextToSize(formData.personal.summary, 170);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 10;

    // Experience
    pdf.setTextColor(currentColor);
    pdf.setFontSize(14);
    pdf.text("Experience", margin, yPosition);
    yPosition += 8;

    formData.experience.forEach((exp) => {
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

    formData.education.forEach((edu) => {
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
    const skillsText = formData.skills.join(", ");
    const skillsLines = pdf.splitTextToSize(skillsText, 170);
    pdf.text(skillsLines, margin, yPosition);
    yPosition += skillsLines.length * 5 + 10;

    // Projects
    if (formData.projects.length > 0 && formData.projects[0].name) {
      pdf.setTextColor(currentColor);
      pdf.setFontSize(14);
      pdf.text("Projects", margin, yPosition);
      yPosition += 8;

      formData.projects.forEach((project) => {
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

    // Save PDF for printing
    pdf.save(`${formData.personal.name.replace(/\s+/g, '_')}_Resume_Print.pdf`);
    toast.success("Resume PDF saved for printing!");
  };

  const updatePersonalField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
    // Clear error when user starts typing
    const errorKey = `education-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
    // Clear error when user starts typing
    const errorKey = `experience-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const updateProject = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
    // Clear error when user starts typing
    const errorKey = `project-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const updateSkills = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
    // Clear error when user starts typing
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: "" }));
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", duration: "", description: "" }]
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", tech: "", link: "" }]
    }));
  };

  return (
    <div className="w-[1440px] h-[1200px] bg-[#F8FAFC] overflow-hidden">
      <div className="w-full h-full px-20 py-8">
        <div className="grid grid-cols-12 gap-8 h-full">
          {/* Left Column - Form Panel (40% width) */}
          <div className="col-span-5 space-y-6 overflow-y-auto max-h-full">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#0F172A]">Resume Builder</h1>
              <Button variant="outline" onClick={onBack}>
                ← Back to Templates
              </Button>
            </div>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Personal Information</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={formData.personal.name} 
                          onChange={(e) => updatePersonalField('name', e.target.value)}
                          placeholder="Your full name" 
                        />
                        {errors.name && <p className="text-[#EF4444] text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input 
                          id="title" 
                          value={formData.personal.title} 
                          onChange={(e) => updatePersonalField('title', e.target.value)}
                          placeholder="Your job title" 
                        />
                        {errors.title && <p className="text-[#EF4444] text-sm mt-1">{errors.title}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.personal.email} 
                          onChange={(e) => updatePersonalField('email', e.target.value)}
                          placeholder="your.email@example.com" 
                        />
                        {errors.email && <p className="text-[#EF4444] text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={formData.personal.phone} 
                          onChange={(e) => updatePersonalField('phone', e.target.value)}
                          placeholder="(555) 123-4567" 
                        />
                        {errors.phone && <p className="text-[#EF4444] text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          value={formData.personal.location} 
                          onChange={(e) => updatePersonalField('location', e.target.value)}
                          placeholder="City, State" 
                        />
                        {errors.location && <p className="text-[#EF4444] text-sm mt-1">{errors.location}</p>}
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          value={formData.personal.linkedin || ""} 
                          onChange={(e) => updatePersonalField('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/yourprofile" 
                        />
                        {errors.linkedin && <p className="text-[#EF4444] text-sm mt-1">{errors.linkedin}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea 
                        id="summary" 
                        value={formData.personal.summary} 
                        onChange={(e) => updatePersonalField('summary', e.target.value)}
                        placeholder="Brief summary of your experience..." 
                        rows={4} 
                      />
                      {errors.summary && <p className="text-[#EF4444] text-sm mt-1">{errors.summary}</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="font-semibold">Education</h3>
                    <Button size="sm" variant="outline" onClick={addEducation}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <div>
                          <Label>School/University</Label>
                          <Input 
                            value={edu.school} 
                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                            placeholder="University name" 
                          />
                          {errors[`education-${index}-school`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`education-${index}-school`]}</p>}
                        </div>
                        <div>
                          <Label>Degree</Label>
                          <Input 
                            value={edu.degree} 
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="Bachelor of Science" 
                          />
                          {errors[`education-${index}-degree`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`education-${index}-degree`]}</p>}
                        </div>
                        <div>
                          <Label>Year</Label>
                          <Input 
                            value={edu.year} 
                            onChange={(e) => updateEducation(index, 'year', e.target.value)}
                            placeholder="2018-2022" 
                          />
                          {errors[`education-${index}-year`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`education-${index}-year`]}</p>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="font-semibold">Work Experience</h3>
                    <Button size="sm" variant="outline" onClick={addExperience}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Company</Label>
                            <Input 
                              value={exp.company} 
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              placeholder="Company name" 
                            />
                            {errors[`experience-${index}-company`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`experience-${index}-company`]}</p>}
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Input 
                              value={exp.role} 
                              onChange={(e) => updateExperience(index, 'role', e.target.value)}
                              placeholder="Job title" 
                            />
                            {errors[`experience-${index}-role`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`experience-${index}-role`]}</p>}
                          </div>
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input 
                            value={exp.duration} 
                            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                            placeholder="2022-Present" 
                          />
                          {errors[`experience-${index}-duration`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`experience-${index}-duration`]}</p>}
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea 
                            value={exp.description} 
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities..." 
                            rows={3} 
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Skills</h3>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>Skills (comma-separated)</Label>
                      <Input 
                        value={formData.skills.join(", ")} 
                        onChange={(e) => updateSkills(e.target.value)}
                        placeholder="JavaScript, React, Node.js..." 
                      />
                      {errors.skills && <p className="text-[#EF4444] text-sm mt-1">{errors.skills}</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="font-semibold">Projects</h3>
                    <Button size="sm" variant="outline" onClick={addProject}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.projects.map((project, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <div>
                          <Label>Project Name</Label>
                          <Input 
                            value={project.name} 
                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                            placeholder="Project title" 
                          />
                          {errors[`project-${index}-name`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`project-${index}-name`]}</p>}
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea 
                            value={project.description} 
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            placeholder="Project description..." 
                            rows={3} 
                          />
                          {errors[`project-${index}-description`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`project-${index}-description`]}</p>}
                        </div>
                        <div>
                          <Label>Technologies</Label>
                          <Input 
                            value={project.tech} 
                            onChange={(e) => updateProject(index, 'tech', e.target.value)}
                            placeholder="React, Node.js, MongoDB" 
                          />
                        </div>
                        <div>
                          <Label>Project Link (optional)</Label>
                          <Input 
                            value={project.link || ""} 
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            placeholder="https://github.com/username/project" 
                          />
                          {errors[`project-${index}-link`] && <p className="text-[#EF4444] text-sm mt-1">{errors[`project-${index}-link`]}</p>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Bottom Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t">
              <Button 
                onClick={handleSave} 
                className="bg-[#10B981] hover:bg-[#059669]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                variant="outline" 
                onClick={handlePreviewPDF}
              >
                <FileText className="w-4 h-4 mr-2" />
                Preview PDF
              </Button>
            </div>
          </div>

          {/* Right Column - Live Preview (60% width) */}
          <div className="col-span-7 space-y-6 flex flex-col">
            {/* Template Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <Label>Template Style</Label>
                  <Select value={currentTemplate} onValueChange={setCurrentTemplate}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Color Scheme</Label>
                  <div className="flex space-x-2 mt-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCurrentColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${currentColor === color ? 'border-gray-400' : 'border-gray-200'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* A4 Preview Area */}
            <div className="bg-white rounded-lg shadow-lg p-8 mx-auto" style={{ width: '595px', minHeight: '842px' }}>
              <div className="space-y-6" style={{ color: currentColor }}>
                {/* Resume Preview Content */}
                <div className="border-b-2 pb-4" style={{ borderColor: currentColor }}>
                  <h1 className="text-3xl font-bold text-[#0F172A]">{formData.personal.name}</h1>
                  <h2 className="text-xl" style={{ color: currentColor }}>{formData.personal.title}</h2>
                  <div className="text-[#64748B] mt-2">
                    {formData.personal.email} | {formData.personal.phone} | {formData.personal.location}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: currentColor }}>Professional Summary</h3>
                  <p className="text-[#0F172A]">{formData.personal.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: currentColor }}>Experience</h3>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-[#0F172A]">{exp.role}</h4>
                          <p style={{ color: currentColor }}>{exp.company}</p>
                        </div>
                        <span className="text-[#64748B]">{exp.duration}</span>
                      </div>
                      <p className="text-[#0F172A] mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: currentColor }}>Education</h3>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-[#0F172A]">{edu.degree}</h4>
                          <p style={{ color: currentColor }}>{edu.school}</p>
                        </div>
                        <span className="text-[#64748B]">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: currentColor }}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${currentColor}20`, color: currentColor }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {formData.projects.length > 0 && formData.projects[0].name && (
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: currentColor }}>Projects</h3>
                    {formData.projects.map((project, index) => (
                      project.name && (
                        <div key={index} className="mb-4">
                          <h4 className="font-medium text-[#0F172A]">{project.name}</h4>
                          <p className="text-[#0F172A] mt-1">{project.description}</p>
                          {project.tech && <p className="text-[#64748B] text-sm mt-1">Technologies: {project.tech}</p>}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleSave} 
                variant="outline"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to LocalStorage
              </Button>
              <Button 
                onClick={handleDownloadPDF} 
                className="bg-[#2563EB] hover:bg-[#1d4ed8]"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}