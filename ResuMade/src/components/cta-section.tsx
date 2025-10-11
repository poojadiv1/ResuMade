import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="w-full py-24 bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold text-[#0F172A]">
            Start building your resume today!
          </h2>
          
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('createResume'))}
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg inline-flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}