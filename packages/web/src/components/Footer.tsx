import { GitHubIcon } from './GitHubIcon';

export function Footer() {
  return (
    <footer className="px-6 md:px-8 py-12 border-t border-[#1f1b16]/8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-sans text-[15px] font-medium text-[#1f1b16]">
            Global Horizon Standard
          </p>
          <p className="font-sans text-[13px] text-[#7b7266] mt-0.5">
            An open time protocol for a synchronized world.
          </p>
        </div>

        <nav className="flex items-center gap-6 text-[14px] font-sans text-[#5e554a]">
          <a
            href="https://github.com/nkoeberlein/global-horizon-standard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#1f1b16] transition-colors duration-150"
          >
            <GitHubIcon size={15} />
            <span>GitHub</span>
          </a>
          <a href="/imprint" className="hover:text-[#1f1b16] transition-colors duration-150">
            Imprint
          </a>
          <a href="/privacy" className="hover:text-[#1f1b16] transition-colors duration-150">
            Privacy
          </a>
        </nav>

        <p className="text-xs font-mono text-[#7b7266]">MIT License · Open Standard</p>
      </div>
    </footer>
  );
}
