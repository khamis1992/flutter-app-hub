import { Button } from "@/components/ui/button";
import { Smartphone, Settings, Share, Play, Code2 } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Smartphone className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">FlutterHub</h1>
        </div>
      </div>

      {/* Center - Project Name */}
      <div className="flex-1 text-center">
        <div className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">مشروع تطبيق جديد</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Play className="w-4 h-4 ml-1" />
          تشغيل
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="w-4 h-4 ml-1" />
          مشاركة
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;