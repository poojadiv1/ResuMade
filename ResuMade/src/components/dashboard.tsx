import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FileText, Download, Trash2, Calendar, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface DashboardProps {
  onCreateResume: () => void;
  onOpenResume: (resumeId: string) => void;
}

export function Dashboard({ onCreateResume, onOpenResume }: DashboardProps) {
  // Mock saved resumes data
  const [savedResumes, setSavedResumes] = useState([
    {
      id: "1",
      title: "Software Engineer Resume",
      lastModified: "2 days ago",
      template: "Modern Layout",
      previewUrl: "https://images.unsplash.com/photo-1587287720754-94bac45f0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN1bWUlMjB0ZW1wbGF0ZSUyMGNsYXNzaWN8ZW58MXx8fHwxNzU5NzMyMTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: "2", 
      title: "Marketing Manager CV",
      lastModified: "1 week ago",
      template: "Creative Layout",
      previewUrl: "https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHJlc3VtZSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk2NTQyNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: "3",
      title: "Project Manager Resume",
      lastModified: "2 weeks ago", 
      template: "Classic Layout",
      previewUrl: "https://images.unsplash.com/photo-1606327054581-0a1d4bf42831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN1bWUlMjBsYXlvdXR8ZW58MXx8fHwxNzU5NzMyMTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ]);

  const handleDownload = (resumeId: string, title: string) => {
    toast.success(`${title} downloaded successfully!`);
  };

  const handleDelete = (resumeId: string, title: string) => {
    setSavedResumes(prev => prev.filter(resume => resume.id !== resumeId));
    toast.success(`${title} deleted successfully!`);
  };

  const EmptyState = () => (
    <div className="col-span-12 flex flex-col items-center justify-center py-24">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-48 h-48 mx-auto mb-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1751712698725-88d05e1e797a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMHN0YXRlJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1OTY4NTcwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Empty state illustration"
            className="w-full h-full object-contain opacity-60"
          />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[#0F172A]">No resumes saved yet</h3>
          <p className="text-[#64748B]">
            You haven't saved any resumes yet. Start building one!
          </p>
        </div>
        <Button 
          onClick={onCreateResume}
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Resume
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-[1440px] h-[1000px] bg-[#F8FAFC] overflow-hidden">
      <div className="w-full h-full px-20 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[#0F172A]">Your Saved Resumes</h1>
              <p className="text-[#64748B]">
                Manage and organize all your resume versions in one place
              </p>
            </div>
            <Button 
              onClick={onCreateResume}
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Resume
            </Button>
          </div>

          {/* Resume Grid */}
          <div className="grid grid-cols-12 gap-6">
            {savedResumes.length === 0 ? (
              <EmptyState />
            ) : (
              savedResumes.map((resume) => (
                <div key={resume.id} className="col-span-4">
                  <Card className="group h-full border border-[#E2E8F0] hover:border-[#2563EB] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="p-0">
                      {/* Resume Preview */}
                      <div className="aspect-[3/4] rounded-t-lg overflow-hidden bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <ImageWithFallback
                          src={resume.previewUrl}
                          alt={resume.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-4">
                      {/* Resume Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                          {resume.title}
                        </h3>
                        <div className="flex items-center text-sm text-[#64748B]">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Modified {resume.lastModified}</span>
                        </div>
                        <p className="text-sm text-[#64748B]">{resume.template}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => onOpenResume(resume.id)}
                          size="sm"
                          className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white transition-colors duration-200"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Open
                        </Button>
                        <Button 
                          onClick={() => handleDownload(resume.id, resume.title)}
                          size="sm"
                          variant="outline"
                          className="border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors duration-200"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(resume.id, resume.title)}
                          size="sm"
                          variant="outline"
                          className="border-[#E2E8F0] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>

          {/* Stats Cards */}
          {savedResumes.length > 0 && (
            <div className="grid grid-cols-12 gap-6 pt-8 border-t border-[#E2E8F0]">
              <div className="col-span-4">
                <Card className="border border-[#E2E8F0]">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-[#2563EB] mb-2">{savedResumes.length}</div>
                    <p className="text-[#64748B]">Total Resumes</p>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-4">
                <Card className="border border-[#E2E8F0]">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-[#10B981] mb-2">
                      {new Set(savedResumes.map(r => r.template)).size}
                    </div>
                    <p className="text-[#64748B]">Templates Used</p>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-4">
                <Card className="border border-[#E2E8F0]">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-[#F59E0B] mb-2">∞</div>
                    <p className="text-[#64748B]">Downloads Available</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}