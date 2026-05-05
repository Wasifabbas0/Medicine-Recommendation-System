import { Brain, FileText, Shield, Utensils, Dumbbell, Pill } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Disease Prediction",
      description: "Advanced machine learning algorithms analyze your symptoms to predict potential health conditions with high accuracy.",
    },
    {
      icon: FileText,
      title: "Detailed Health Reports",
      description: "Get comprehensive reports including disease descriptions, risk factors, and recommended next steps.",
    },
    {
      icon: Shield,
      title: "Preventive Care",
      description: "Receive personalized precautions and preventive measures to maintain optimal health and avoid complications.",
    },
    {
      icon: Pill,
      title: "Medication Guidance",
      description: "Evidence-based medication recommendations and drug interaction warnings for safer treatment.",
    },
    {
      icon: Utensils,
      title: "Nutritional Advice",
      description: "Customized diet plans and nutritional recommendations tailored to your health condition and goals.",
    },
    {
      icon: Dumbbell,
      title: "Exercise Plans",
      description: "Personalized workout routines and physical therapy exercises designed for your specific health needs.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Comprehensive Health Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            HealthMate combines cutting-edge AI technology with medical expertise to provide 
            you with complete health analysis and personalized recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Features;