import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, FileText, Shield, Pill, Utensils, Dumbbell, Plus, X } from "lucide-react";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const analyzeSymptoms = () => {
    if (symptoms.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Server error");
        setResults(data);
        setShowResults(true);
      } catch (err: any) {
        setError(err.message || "Request failed");
        setShowResults(false);
      } finally {
        setIsAnalyzing(false);
      }
    })();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSymptom();
    }
  };

  

  return (
    <section id="symptom-checker" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            AI Symptom Checker
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your symptoms below and let our AI analyze them to predict potential health conditions
          </p>
        </div>

        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Symptom Analysis
            </CardTitle>
            <CardDescription>
              Add your symptoms one by one. The more details you provide, the more accurate the prediction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Symptom Input */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a symptom (e.g., headache, high_fever, cough)"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={addSymptom} disabled={!currentSymptom.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Added Symptoms */}
              {symptoms.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Your Symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {symptom}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeSymptom(symptom)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <Button 
                onClick={analyzeSymptoms} 
                disabled={symptoms.length === 0 || isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            {showResults && (
              <div className="space-y-6 animate-in fade-in-50 duration-500">
                <Separator />
                
                {/* Disease Prediction */}
                <div className="bg-primary/5 rounded-lg p-6 border-l-4 border-primary">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Predicted Condition
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {results?.disease ?? "—"}
                      </p>  
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {results?.description ?? "No description available."}
                    </p>
                  </CardContent>
                </Card>

                {/* Recommendations Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Precautions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-secondary" />
                        Precautions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(results?.precautions ?? []).map((precaution, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-secondary mt-1">•</span>
                            <span className="text-muted-foreground">{precaution}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Medications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-secondary" />
                        Medications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(results?.medications ?? []).map((medication, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-secondary mt-1">•</span>
                            <span className="text-muted-foreground">{medication}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Diet */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-secondary" />
                        Recommended Diet
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(results?.diet ?? []).map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-secondary mt-1">•</span>
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Workout */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-secondary" />
                        Exercise Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(results?.workout ?? []).map((exercise, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-secondary mt-1">•</span>
                            <span className="text-muted-foreground">{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Disclaimer */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    <strong>Disclaimer:</strong> This is an AI-powered prediction tool and should not replace professional medical advice. 
                    Please consult with a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SymptomChecker;