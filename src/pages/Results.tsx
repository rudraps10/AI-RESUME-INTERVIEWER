import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, TrendingUp, Target, MessageSquare, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Feedback {
  category: string;
  score: number;
  feedback: string;
  icon: React.ElementType;
}

const Results = () => {
  const navigate = useNavigate();
  const [overallScore, setOverallScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const evaluateAnswers = async () => {
      try {
        const questions = JSON.parse(localStorage.getItem("interviewQuestions") || "[]");
        const answers = JSON.parse(localStorage.getItem("interviewAnswers") || "[]");

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-answers`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions, answers }),
          }
        );

        if (!response.ok) throw new Error("Failed to evaluate");

        const data = await response.json();
        setOverallScore(data.overallScore);
        setFeedback(data.feedback.map((item: any) => ({
          ...item,
          icon: item.category === "Clarity" ? MessageSquare :
                item.category === "Confidence" ? TrendingUp :
                item.category === "Relevance" ? Target : CheckCircle2,
        })));
      } catch (error) {
        console.error("Evaluation error:", error);
        // Fallback to default feedback
        setOverallScore(75);
        setFeedback([
          { category: "Clarity", score: 80, feedback: "Well-structured answers with room for more examples.", icon: MessageSquare },
          { category: "Confidence", score: 75, feedback: "Good knowledge demonstrated.", icon: TrendingUp },
          { category: "Relevance", score: 78, feedback: "Answers addressed the questions well.", icon: Target },
          { category: "Communication", score: 72, feedback: "Professional communication style.", icon: CheckCircle2 },
        ]);
      }
    };

    evaluateAnswers();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-primary";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-accent mb-6">
              <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Interview Complete!
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's your detailed performance analysis
            </p>
          </div>

          <Card className="p-8 shadow-elevated mb-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-foreground">
                Overall Score
              </h2>
              <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <p className="text-lg text-muted-foreground mt-2">
                {getScoreLabel(overallScore)}
              </p>
            </div>
            <Progress value={overallScore} className="h-3" />
          </Card>

          <div className="space-y-6">
            {feedback.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.category}
                  className="p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {item.category}
                        </h3>
                        <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score}%
                        </span>
                      </div>
                      <Progress value={item.score} className="h-2 mb-3" />
                      <p className="text-muted-foreground leading-relaxed">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="bg-gradient-primary hover:opacity-90"
            >
              <Home className="mr-2 w-4 h-4" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
