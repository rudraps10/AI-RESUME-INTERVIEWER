import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Square, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Interview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        const resumeText = localStorage.getItem("resumeText") || "No resume provided";
        const interviewType = localStorage.getItem("interviewType") || "general";

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resumeText, interviewType }),
          }
        );

        if (!response.ok) throw new Error("Failed to generate questions");

        const data = await response.json();
        setQuestions(data.questions);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error generating questions",
          description: "Using default questions",
          variant: "destructive",
        });
        setQuestions([
          "Tell me about yourself and your professional background.",
          "What are your greatest strengths?",
          "Describe a challenging situation you faced.",
          "Where do you see yourself in five years?",
          "Why are you interested in this position?",
        ]);
        setIsLoading(false);
      }
    };

    generateQuestions();
  }, [toast]);

  const handleNextQuestion = () => {
    if (!answer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer before continuing",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      localStorage.setItem("interviewAnswers", JSON.stringify(newAnswers));
      localStorage.setItem("interviewQuestions", JSON.stringify(questions));
      navigate("/results");
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Speak your answer clearly",
      });
    } else {
      toast({
        title: "Recording stopped",
        description: "Your answer has been captured",
      });
      setAnswer("This is a simulated transcription of your audio answer.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Generating interview questions...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </h1>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-8 shadow-elevated mb-6 animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                {questions[currentQuestion]}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Your Answer
                </label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[200px] resize-none"
                  disabled={isRecording}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={toggleRecording}
                  className="flex items-center gap-2"
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Record Answer
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!answer.trim()}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  ) : (
                    "Submit Interview"
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Take your time to provide thoughtful answers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
