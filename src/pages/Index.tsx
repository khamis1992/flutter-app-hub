import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";

const Index = () => {
  const [generatedProject, setGeneratedProject] = useState(null);

  const handleCodeGenerated = (project: any) => {
    setGeneratedProject(project);
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      
      <div className="flex-1 flex">
        {/* Chat Panel - Left Side */}
        <div className="w-1/2 border-r border-border">
          <ChatPanel onCodeGenerated={handleCodeGenerated} />
        </div>
        
        {/* Preview Panel - Right Side */}
        <div className="w-1/2">
          <PreviewPanel project={generatedProject} />
        </div>
      </div>
    </div>
  );
};

export default Index;
