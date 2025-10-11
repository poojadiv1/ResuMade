import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/hero-section";
import { FeaturesSection } from "./components/features-section";
import { CtaSection } from "./components/cta-section";
import { Footer } from "./components/footer";
import { TemplateSelection } from "./components/template-selection";
import { ResumeBuilder } from "./components/resume-builder";
import { PreviewDownload } from "./components/preview-download";
import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";

type PageView = 'landing' | 'templates' | 'builder' | 'preview' | 'dashboard' | 'login';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateWithTransition = (newView: PageView) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    }, 150); // Half of the 300ms transition
  };

  const handleCreateResume = () => {
    navigateWithTransition('templates');
  };

  const handleNavigateHome = () => {
    navigateWithTransition('landing');
  };

  const handleNavigateTemplates = () => {
    navigateWithTransition('templates');
  };

  const handleNavigateBuilder = () => {
    if (selectedTemplate) {
      navigateWithTransition('builder');
    } else {
      navigateWithTransition('templates');
    }
  };

  const handleNavigateDashboard = () => {
    navigateWithTransition('dashboard');
  };

  const handleNavigateLogin = () => {
    navigateWithTransition('login');
  };

  const handleLoginSuccess = () => {
    navigateWithTransition('dashboard');
  };

  useEffect(() => {
    const handleCreateResumeEvent = () => {
      navigateWithTransition('templates');
    };

    window.addEventListener('createResume', handleCreateResumeEvent);
    return () => window.removeEventListener('createResume', handleCreateResumeEvent);
  }, []);

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
    navigateWithTransition('builder');
  };

  const handlePreview = () => {
    navigateWithTransition('preview');
  };

  const handleBackToBuilder = () => {
    navigateWithTransition('builder');
  };

  const handleBackToTemplates = () => {
    navigateWithTransition('templates');
  };

  const handleOpenResume = (resumeId: string) => {
    // Load the resume data and navigate to builder
    setSelectedTemplate('classic'); // Mock template selection
    navigateWithTransition('builder');
  };

  const renderCurrentView = () => {
    const navProps = {
      onCreateResume: handleCreateResume,
      onNavigateHome: handleNavigateHome,
      onNavigateTemplates: handleNavigateTemplates,
      onNavigateBuilder: handleNavigateBuilder,
      onNavigateDashboard: handleNavigateDashboard,
      onNavigateLogin: handleNavigateLogin,
      currentView
    };

    switch (currentView) {
      case 'templates':
        return (
          <div>
            <Navbar {...navProps} />
            <TemplateSelection onSelectTemplate={handleSelectTemplate} />
            <Footer />
          </div>
        );
      
      case 'builder':
        return (
          <div>
            <Navbar {...navProps} />
            <ResumeBuilder 
              selectedTemplate={selectedTemplate}
              onPreview={handlePreview}
              onBack={handleBackToTemplates}
            />
          </div>
        );
      
      case 'preview':
        return (
          <div>
            <Navbar {...navProps} />
            <PreviewDownload 
              onBack={handleNavigateHome}
              onEdit={handleBackToBuilder}
              onNavigateDashboard={handleNavigateDashboard}
            />
          </div>
        );

      case 'dashboard':
        return (
          <div>
            <Navbar {...navProps} />
            <Dashboard 
              onCreateResume={handleCreateResume}
              onOpenResume={handleOpenResume}
            />
            <Footer />
          </div>
        );

      case 'login':
        return (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={handleNavigateHome}
          />
        );
      
      default:
        return (
          <div>
            <Navbar {...navProps} />
            <HeroSection />
            <FeaturesSection />
            <CtaSection />
            <Footer />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div 
        className={`transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderCurrentView()}
      </div>
      <Toaster />
    </div>
  );
}