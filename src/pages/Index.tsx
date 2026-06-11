import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Target, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Upload Resume",
      description: "Automatically extract and analyze your skills, experience, and expertise",
    },
    {
      icon: Target,
      title: "Personalized Questions",
      description: "Get tailored interview questions based on your background and role",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Feedback",
      description: "Receive detailed evaluation on clarity, confidence, and communication",
    },
    {
      icon: CheckCircle,
      title: "Improve Skills",
      description: "Practice and refine your interview skills with actionable insights",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              AI-Powered Mock
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Interview System</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Practice interviews with AI-generated questions, get instant feedback, 
              and land your dream job with confidence
            </p>
            <Button
              onClick={() => navigate("/upload")}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6"
            >
              Start Your Mock Interview
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="p-6 text-center hover:shadow-elevated transition-all hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8 bg-gradient-primary shadow-elevated">
          <div className="grid md:grid-cols-3 gap-8 text-center text-primary-foreground">
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-sm opacity-90">Interview Types</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">AI-Powered</div>
              <div className="text-sm opacity-90">Question Generation</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Instant</div>
              <div className="text-sm opacity-90">Detailed Feedback</div>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals improving their interview skills with AI-powered practice
          </p>
          <Button
            onClick={() => navigate("/upload")}
            size="lg"
            className="bg-gradient-accent hover:opacity-90 text-lg px-8 py-6"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
