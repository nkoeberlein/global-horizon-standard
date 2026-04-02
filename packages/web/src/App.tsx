import { HeroSection } from './components/HeroSection';
import { VisualizerSection } from './components/VisualizerSection';
import { PhilosophySection } from './components/PhilosophySection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <HeroSection />
      <VisualizerSection />
      <PhilosophySection />
      <Footer />
    </div>
  );
}
