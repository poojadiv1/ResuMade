import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-[#F8FAFC] to-[#E0F2FE] py-24">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Left Content - 7 columns */}
          <div className="col-span-7">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-[#0F172A] leading-tight">
                  Build Your Professional Resume in Minutes
                </h1>
                <p className="text-xl text-[#64748B] leading-relaxed max-w-lg">
                  Customize templates and download instantly — free and easy to use.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => window.dispatchEvent(new CustomEvent('createResume'))}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  Create Resume
                </Button>
                <Button 
                  onClick={() => window.dispatchEvent(new CustomEvent('createResume'))}
                  variant="outline" 
                  className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white px-8 py-3 rounded-lg transition-colors duration-200"
                >
                  Choose Template
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - 5 columns */}
          <div className="col-span-5">
            <div className="flex justify-center">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1693045181676-57199422ee66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN1bWUlMjB0ZW1wbGF0ZSUyMGRvY3VtZW50fGVufDF8fHx8MTc1OTczMjA2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional Resume Template"
                  className="w-full max-w-md rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#10B981] rounded-full shadow-lg"></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-[#2563EB] rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}