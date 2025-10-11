export function Footer() {
  return (
    <footer className="w-full py-12 bg-[#F1F5F9] border-t border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="flex items-center justify-center space-x-8">
          <a 
            href="#" 
            className="text-[#64748B] hover:text-[#0F172A] transition-colors duration-200"
          >
            About
          </a>
          <span className="text-[#E2E8F0]">|</span>
          <a 
            href="#" 
            className="text-[#64748B] hover:text-[#0F172A] transition-colors duration-200"
          >
            Privacy
          </a>
          <span className="text-[#E2E8F0]">|</span>
          <a 
            href="#" 
            className="text-[#64748B] hover:text-[#0F172A] transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}