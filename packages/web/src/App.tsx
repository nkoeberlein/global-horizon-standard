import { Route, Routes } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { Layout } from './components/Layout';
import { PhilosophySection } from './components/PhilosophySection';
import { VisualizerSection } from './components/VisualizerSection';
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
