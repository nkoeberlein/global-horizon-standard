import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HeroSection } from './components/HeroSection';
import { VisualizerSection } from './components/VisualizerSection';
import { PhilosophySection } from './components/PhilosophySection';
import { ImprintPage } from './pages/ImprintPage';
import { PrivacyPage } from './pages/PrivacyPage';

function LandingPage() {
  return (
    <>
      <HeroSection />
      <VisualizerSection />
      <PhilosophySection />
    </>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/imprint" element={<ImprintPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </Layout>
  );
}
