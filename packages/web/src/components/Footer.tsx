import { GitHubIcon } from './GitHubIcon';

export function Footer() {
  return (
    <footer className="px-6 py-16" style={{ borderTop: '1px solid #e8e4db' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left: brand */}
          <div>
            <p className="font-serif text-xl text-charcoal mb-1" style={{ fontWeight: 400 }}>
              Global Horizon Standard
            </p>
            <p className="font-sans text-sm" style={{ color: '#9b9288' }}>
              The time protocol for a synchronized world.
            </p>
          </div>

          {/* Center: links */}
          <nav className="flex items-center gap-8">
            <a
              href="https://github.com/nkoeberlein/global-horizon-standard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-sans transition-colors"
              style={{ color: '#7a7265' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2d2926')}
              onMouseLeave={e => (e.currentTarget.style.color = '#7a7265')}
            >
              <GitHubIcon size={14} />
              GitHub
            </a>
            <a
              href="https://github.com/nkoeberlein/global-horizon-standard/blob/main/spec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-sans transition-colors"
              style={{ color: '#7a7265' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2d2926')}
              onMouseLeave={e => (e.currentTarget.style.color = '#7a7265')}
            >
              Specification
            </a>
          </nav>

          {/* Right: license */}
          <p className="text-xs font-sans" style={{ color: '#b0a898' }}>
            MIT License — Open Standard
          </p>
        </div>
      </div>
    </footer>
  );
}
