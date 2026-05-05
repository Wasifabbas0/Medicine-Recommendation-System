import { Button } from "@/components/ui/button";
import { ArrowRight, Stethoscope, Activity, Shield } from "lucide-react";

const Hero = () => {
  return(
    <section id="home" className="min-h-screen flex items-center gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your AI-Powered
                <span className="text-primary"> Health</span>
                <span className="text-secondary"> Companion</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Get instant disease predictions, personalized health recommendations, 
                and expert medical guidance powered by advanced machine learning technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => document.getElementById('symptom-checker')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Check Your Symptoms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/5"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-8">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Medically Reviewed</span>
              </div>
            </div>
          </div>

          {/* Visual/Illustration */}
          <div className="relative">
            <div className="relative p-10">
              <img 
                src="/doctor.png" 
                alt="Health Companion Illustration" 
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;