export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 font-sans text-charcoal-light leading-relaxed">
      <h1 className="font-serif text-4xl text-charcoal mb-10 tracking-tight">Privacy Policy</h1>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[#b0a898] mb-4">I. Data Protection at a Glance</h2>
        <p>
          We take the protection of your personal data very seriously. This website is designed to be minimal and privacy-preserving. 
          We do not use tracking cookies, analytics services, or social media plugins.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[#b0a898] mb-4">II. Hosting and Server Log Files</h2>
        <p>
          This website is hosted by <strong>Vercel</strong> (Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA). 
          When you access our website, Vercel automatically collects information that your browser sends. 
          This includes your IP address, browser type, operating system, and the time of access.
        </p>
        <p className="mt-4">
          This data is used solely to ensure the security and stability of the platform. 
          Vercel is GDPR compliant through its Data Processing Addendum.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-[#b0a898] mb-4">III. Your Rights</h2>
        <p>
          As a user, you have the right to request information about the data stored about you at any time. 
          You also have the right to request the correction, blocking, or deletion of this data. 
          If you have any questions, please contact the address provided in the Imprint.
        </p>
      </section>

      <div className="pt-10 border-t border-[#e8e4db] text-sm text-[#9b9288] italic">
        Status: April 2026 — Global Horizon Standard Project
      </div>
    </div>
  );
}
