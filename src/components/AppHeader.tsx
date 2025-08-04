import { Button } from "@/components/ui/button";
import { Smartphone, Settings, Share, Play, Code2, Zap, Save, FolderOpen } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="h-16 bg-glass-bg backdrop-blur-glass border-b border-glass-border flex items-center justify-between px-6 relative">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Logo & Project */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
              <Smartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FlutterHub</h1>
              <p className="text-xs text-muted-foreground">منصة تطوير احترافية</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border" />
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">متجر إلكتروني</h2>
              <p className="text-xs text-muted-foreground">آخر حفظ: منذ دقيقتين</p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft border border-border/50">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">متصل</span>
            <Zap className="w-4 h-4 text-accent" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            فتح
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            حفظ
          </Button>
          <Button variant="hero" size="sm" className="gap-2">
            <Play className="w-4 h-4" />
            تشغيل
          </Button>
          <Button variant="glass" size="sm" className="gap-2">
            <Share className="w-4 h-4" />
            مشاركة
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;