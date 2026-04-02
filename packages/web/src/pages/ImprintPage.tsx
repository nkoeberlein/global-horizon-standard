import { ObfuscatedContact } from '../components/ObfuscatedContact';

export function ImprintPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 font-sans text-charcoal-light leading-relaxed">
      <h1 className="font-serif text-4xl text-charcoal mb-10 tracking-tight">Imprint</h1>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[#b0a898] mb-4">Information according to § 5 TMG</h2>
        <div className="space-y-1 text-lg text-charcoal">
          <p><ObfuscatedContact reversedValue="nielreböK sualokiN" /></p>
          <p><ObfuscatedContact reversedValue="ynamreG ,trufteiD 54329 ,81 nebargtdatS" /></p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[#b0a898] mb-4">Contact</h2>
        <div className="space-y-1 text-lg text-charcoal font-medium">
          <p>Email: <ObfuscatedContact reversedValue="ed.nielrebeokn@musserpmi" isEmail={true} /></p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[#b0a898] mb-4">Editorial Responsibility</h2>
        <p className="text-charcoal">
          Nikolaus Köberlein stays responsible for the contents of this website.
        </p>
      </section>

      <div className="pt-10 border-t border-[#e8e4db] text-sm text-[#9b9288] italic">
        This website is an open-source project and part of the Global Horizon Standard proposal.
      </div>
    </div>
  );
}
