import { Button } from "./ui/button";

interface NavbarProps {
  onCreateResume?: () => void;
  onNavigateHome?: () => void;
  onNavigateTemplates?: () => void;
  onNavigateBuilder?: () => void;
  onNavigateDashboard?: () => void;
  onNavigateLogin?: () => void;
  currentView?: string;
}

export function Navbar({ 
  onCreateResume, 
  onNavigateHome, 
  onNavigateTemplates, 
  onNavigateBuilder, 
  onNavigateDashboard,
  onNavigateLogin,
  currentView 
}: NavbarProps) {
  const isActive = (view: string) => currentView === view;

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-20 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-xl font-bold text-[#2563EB] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onNavigateHome}
            >
              ResuMade
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={onNavigateTemplates}
              className={`transition-colors duration-300 ${
                isActive('templates') 
                  ? 'text-[#2563EB] font-medium' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Templates
            </button>
            <button 
              onClick={onNavigateBuilder}
              className={`transition-colors duration-300 ${
                isActive('builder') 
                  ? 'text-[#2563EB] font-medium' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Builder
            </button>
            <button 
              onClick={onNavigateDashboard}
              className={`transition-colors duration-300 ${
                isActive('dashboard') 
                  ? 'text-[#2563EB] font-medium' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={onNavigateLogin}
              className={`transition-colors duration-300 ${
                isActive('login') 
                  ? 'text-[#2563EB] font-medium' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Login
            </button>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onCreateResume}
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-lg transition-colors duration-200 shadow-sm"
          >
            Create Resume
          </Button>
        </div>
      </div>
    </nav>
  );
}