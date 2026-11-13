import { GitHubIcon } from './GitHubIcon';
import { MathFormula } from './MathFormula';

const ECOSYSTEM_PACKAGES = [
  {
    name: 'ghs-time',
    badge: 'TypeScript · ESM / CJS',
    desc: 'Zero-dependency reference library for Date ↔ GHS conversion, @Beats, and holidays.',
  },
  {
    name: 'ghs-cli & ghs-api',
    badge: 'CLI · Hono HTTP',
    desc: 'Terminal clock, calendar generator, and REST endpoints (/now, /convert, /holidays).',
  },
  {
    name: 'Browser & mobile',
    badge: 'MV3 · Flutter',
    desc: 'Live @Beats browser badge and native Dart/Flutter app tested against the same vectors.',
  },
  {
    name: 'Formal specification',
    badge: '146,097-day cycle',
    desc: 'Normative mathematical rulebook and cross-language test vectors in spec/vectors.json.',
  },
];

export function EcosystemSection() {
  return (
    <section id="ecosystem" className="px-6 md:px-8 py-24 border-t border-[#1f1b16]/8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-8">
          {/* Left: Heading & copy */}
          <div className="lg:col-span-6">
            <p className="font-mono text-xs text-[#7b7266] mb-2">
              04 · Specification and reference stack
            </p>
            <h2 className="section-heading mb-4">
              An open time protocol backed by 146,097-day bijectivity tests
            </h2>
            <p className="section-sub mb-8">
              Ships as a verified software stack with property tests proving 1:1 bijectivity across
              every day of the 400-year Aurora cycle.
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

        {/* Closed-form Specification Equations */}
        <div className="surface-card p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="font-mono text-xs text-[#7b7266]">
              Normative closed-form definition · Origin 12000.01.01 = Unix day 11,036
            </span>
            <MathFormula tex="\varepsilon = 286" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 flex flex-col justify-between gap-2">
              <span className="font-sans text-xs text-[#5e554a]">
                Aurora Year criterion (71 leap weeks per 400 years)
              </span>
              <MathFormula display variant="box" tex="(71Y + 286) \bmod 400 < 71" />
            </div>
            <div className="lg:col-span-7 flex flex-col justify-between gap-2">
              <span className="font-sans text-xs text-[#5e554a]">
                Unix day of New Year (Y.01.01) in closed form
              </span>
              <MathFormula
                display
                variant="box"
                tex="\text{day}(Y.01.01) = 11{,}036 + 364(Y - 12{,}000) + 7\left\lfloor\frac{71(Y - 12{,}000) + 215}{400}\right\rfloor"
              />
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
