import { useNavigate } from "react-router-dom";
import { Briefcase, Code, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const interviewTypes = [
  {
    id: "general",
    title: "General Interview",
    description: "Broad questions covering your overall experience and background",
    icon: Briefcase,
    color: "text-blue-500",
  },
  {
    id: "technical",
    title: "Technical Interview",
    description: "Focus on technical skills, problem-solving, and domain expertise",
    icon: Code,
    color: "text-purple-500",
  },
  {
    id: "hr",
    title: "HR Interview",
    description: "Behavioral questions about teamwork, culture fit, and soft skills",
    icon: Users,
    color: "text-green-500",
  },
  {
    id: "managerial",
    title: "Managerial Interview",
    description: "Leadership, team management, and strategic thinking questions",
    icon: TrendingUp,
    color: "text-orange-500",
  },
];

const SelectType = () => {
  const navigate = useNavigate();

  const handleSelectType = (type: string) => {
    localStorage.setItem("interviewType", type);
    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Select Interview Type
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the type of interview you want to practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {interviewTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.id}
                  className="p-6 hover:shadow-elevated transition-all hover:scale-105 cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleSelectType(type.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {type.description}
                      </p>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Select This Type
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectType;
