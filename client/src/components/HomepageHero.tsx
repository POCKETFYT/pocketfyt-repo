import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/marketplace_hero_background_image.png";

interface HomepageHeroProps {
  onGetStarted?: () => void;
}

export default function HomepageHero({ onGetStarted }: HomepageHeroProps) {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      
      <div className="relative z-10 container px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Find the best price that fits your pocket
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Compare prices across verified sellers in your area
        </p>
        <Button 
          size="lg" 
          onClick={onGetStarted}
          className="text-lg px-8 py-6"
          data-testid="button-get-started-hero"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
}
