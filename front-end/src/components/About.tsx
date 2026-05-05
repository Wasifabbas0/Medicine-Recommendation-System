import { CheckCircle, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  const stats = [
    { number: "10K+", label: "Health Analyses", icon: TrendingUp },
    { number: "100%", label: "Accuracy Rate", icon: Award },
    { number: "5K+", label: "Happy Users", icon: Users },
    { number: "24/7", label: "Available", icon: CheckCircle },
  ];

  const benefits = [
    "Advanced machine learning algorithms trained on medical datasets",
    "Instant symptom analysis and disease prediction",
    "Personalized health recommendations and lifestyle advice",
    "Evidence-based medical information and treatment options",
    "Privacy-focused approach with secure data handling",
    "Continuous learning and improvement of diagnostic accuracy",
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                About <span className="text-primary">Health</span><span className="text-secondary">Mate</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                HealthMate is an innovative AI-powered health recommendation system that revolutionizes 
                how you understand and manage your health. Our advanced machine learning model analyzes 
                your symptoms to provide accurate disease predictions and comprehensive health guidance.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Developed as a final year project, HealthMate represents the future of personalized 
                healthcare technology, combining artificial intelligence with medical expertise to 
                deliver reliable health insights at your fingertips.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">What Makes HealthMate Special:</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats and Visual */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-soft border border-border/50 text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mission Statement */}
            <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
              <h4 className="font-semibold text-primary mb-3">Our Mission</h4>
              <p className="text-muted-foreground">
                To democratize healthcare by making advanced medical AI accessible to everyone, 
                enabling early disease detection, and promoting preventive care through 
                intelligent health recommendations.
              </p>
            </div>

            {/* Technology Stack */}
            <div className="bg-secondary/5 rounded-xl p-6 border-l-4 border-secondary">
              <h4 className="font-semibold text-secondary mb-3">Powered by AI</h4>
              <p className="text-muted-foreground">
                Our machine learning model is trained on extensive medical datasets and 
                continuously updated to provide the most accurate and reliable health 
                predictions and recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;