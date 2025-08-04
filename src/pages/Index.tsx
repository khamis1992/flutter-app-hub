import AppHeader from "@/components/AppHeader";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";

const Index = () => {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      
      <div className="flex-1 flex">
        {/* Chat Panel - Left Side */}
        <div className="w-1/2 border-r border-border">
          <ChatPanel />
        </div>
        
        {/* Preview Panel - Right Side */}
        <div className="w-1/2">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
