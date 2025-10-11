import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TemplateSelectionProps {
  onSelectTemplate: (template: string) => void;
}

export function TemplateSelection({ onSelectTemplate }: TemplateSelectionProps) {
  const templates = [
    {
      id: "classic",
      name: "Classic Layout",
      description: "Two-column professional design",
      image: "https://images.unsplash.com/photo-1587287720754-94bac45f0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN1bWUlMjB0ZW1wbGF0ZSUyMGNsYXNzaWN8ZW58MXx8fHwxNzU5NzMyMTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: "modern",
      name: "Modern Layout",
      description: "Single-column clean design",
      image: "https://images.unsplash.com/photo-1606327054581-0a1d4bf42831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN1bWUlMjBsYXlvdXR8ZW58MXx8fHwxNzU5NzMyMTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: "creative",
      name: "Creative Layout",
      description: "Color sidebar with modern flair",
      image: "https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHJlc3VtZSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk2NTQyNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-20 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#0F172A]">Choose Your Resume Template</h1>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Select a professional template that matches your style and industry. 
              All templates are fully customizable and ATS-friendly.
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-12 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="col-span-4">
                <Card className="group h-full border border-[#E2E8F0] hover:border-[#2563EB] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 space-y-6">
                    {/* Template Preview */}
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0]">
                      <ImageWithFallback
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Template Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-[#0F172A]">{template.name}</h3>
                      <p className="text-[#64748B]">{template.description}</p>
                    </div>

                    {/* Use Template Button */}
                    <Button 
                      onClick={() => onSelectTemplate(template.id)}
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white transition-colors duration-200"
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}