import { GitHubIcon } from './GitHubIcon';

const ECOSYSTEM_PACKAGES = [
  {
    name: 'ghs-time',
    badge: 'TypeScript · ESM / CJS',
    desc: 'Zero-dependency reference library. Bijective Date ↔ GHS conversion, @Beats, solar noon calculation, and holiday resolution.',
  },
  {
    name: 'ghs-cli & ghs-api',
    badge: 'CLI · Hono HTTP',
    desc: 'Terminal clock, calendar generator, and REST endpoints (/now, /convert, /holidays) for server integration.',
  },
  {
    name: 'Browser & mobile',
    badge: 'MV3 · Flutter',
    desc: 'Live @Beats badge in the browser toolbar and a native Dart/Flutter app verified against the same conformance vectors.',
  },
  {
    name: 'Formal specification',
    badge: '146,097-day cycle',
    desc: 'Complete mathematical rulebook, epoch derivation (Unix day 11,036), and cross-language test vectors in spec/vectors.json.',
  },
];

export function EcosystemSection() {
  return (
    <section id="ecosystem" className="px-6 md:px-8 py-24 border-t border-[#1f1b16]/8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          {/* Left: Heading & copy */}
          <div className="lg:col-span-6">
            <p className="font-mono text-xs text-[#7b7266] mb-2">
              04 · Specification and reference stack
            </p>
            <h2 className="section-heading mb-4">
              An open time protocol backed by 146,097-day bijectivity tests
            </h2>
            <p className="section-sub mb-8">
              Unlike historical calendar proposals that remained on paper, the Global Horizon
              Standard ships as a verified software stack — with property tests proving 1:1
              bijectivity across every day of the 400-year Aurora cycle.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/nkoeberlein/global-horizon-standard"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 rounded-[8px] inline-flex items-center gap-2 text-[14px] font-sans font-medium bg-[#1f1b16] hover:bg-[#332d25] text-[#fdfbf7] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <GitHubIcon size={15} />
                <span>Explore repository</span>
              </a>
              <a
                href="https://github.com/nkoeberlein/global-horizon-standard/tree/main/spec"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 rounded-[8px] inline-flex items-center text-[14px] font-sans font-medium bg-[#efe9df] hover:bg-[#e5ded2] text-[#1f1b16] border border-[#1f1b16]/8 transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                Read the specification
              </a>
            </div>
          </div>

          {/* Right: Code & CLI preview (Warm Dark tokens) */}
          <div
            className="lg:col-span-6 rounded-[12px] overflow-hidden font-mono text-xs border border-[#1f1b16]/12"
            style={{
              background: '#161513',
              color: '#efe9de',
            }}
          >
            <div
              className="h-10 px-5 flex items-center justify-between text-xs"
              style={{ background: '#12110f', borderBottom: '1px solid rgba(239, 233, 222, 0.08)' }}
            >
              <span className="text-[#8a847a]">ghs-time · Reference API &amp; CLI</span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#262421] text-[#aaa398]">v3.0</span>
            </div>

            <div className="p-6 space-y-4 leading-[20px] overflow-x-auto tabular-nums">
              <div>
                <div className="text-[#8a847a]">{'// 1. Convert any Date to GHS and @Beats'}</div>
                <div>
                  <span className="text-[#b57924]">import</span> {'{ getGHSDate, parseGHSDate }'}{' '}
                  <span className="text-[#b57924]">from</span>{' '}
                  <span className="text-[#efe9de]">&apos;ghs-time&apos;</span>
                  {';'}
                </div>
                <div className="mt-1">
                  <span className="text-[#b57924]">const</span> now ={' '}
                  <span className="text-[#efe9de]">getGHSDate</span>()
                  {';'}
                </div>
                <div className="text-[#8a847a]">
                  {'// → { fullDate: "12026.08.12", weekday: "Friday", beats: "@860", quarter: 3 }'}
                </div>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid rgba(239, 233, 222, 0.08)' }}>
                <div className="text-[#8a847a]">{'# 2. Terminal CLI output'}</div>
                <div>
                  <span className="text-[#b57924]">$</span> ghs
                </div>
                <div className="text-[#aaa398]">
                  GHS 12026.08.12 @860 (Friday, 12 October 12026 HE · Q3 · W30)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Card Ecosystem Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ECOSYSTEM_PACKAGES.map((pkg) => (
            <div key={pkg.name} className="surface-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-sans text-[15px] text-[#1f1b16] font-medium">{pkg.name}</h3>
                </div>
                <div className="mb-3">
                  <span className="ghs-token">{pkg.badge}</span>
                </div>
                <p className="font-sans text-[13px] text-[#5e554a] leading-[20px]">{pkg.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
