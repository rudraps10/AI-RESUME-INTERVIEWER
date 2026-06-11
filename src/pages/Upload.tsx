import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || 
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Read file content
      const text = await file.text();
      
      // Store resume data
      localStorage.setItem("resumeUploaded", "true");
      localStorage.setItem("resumeFileName", file.name);
      localStorage.setItem("resumeText", text);
      
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been analyzed",
      });
      setIsUploading(false);
      navigate("/select-type");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Upload Your Resume</h1>
            <p className="text-lg text-muted-foreground">
              Upload your resume to get started with personalized interview questions
            </p>
          </div>

          <Card className="p-8 shadow-elevated animate-fade-in">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-border bg-muted/30 hover:border-primary/50"
              }`}
            >
              {file ? (
                <div className="space-y-4">
                  <FileText className="w-16 h-16 mx-auto text-primary" />
                  <div>
                    <p className="text-lg font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <UploadIcon className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold mb-2">
                      Drag & drop your resume here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="secondary" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOCX (Max size: 10MB)
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Resume...
                    </>
                  ) : (
                    "Continue to Interview Type"
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
