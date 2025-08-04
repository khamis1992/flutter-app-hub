import { Button } from "@/components/ui/button";
import { Menu, Smartphone, Code, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FlutterHub</h1>
              <p className="text-xs text-muted-foreground">منصة تطوير تطبيقات Flutter</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              المميزات
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
              الأسعار
            </a>
            <a href="#docs" className="text-foreground hover:text-primary transition-colors">
              التوثيق
            </a>
            <a href="#examples" className="text-foreground hover:text-primary transition-colors">
              أمثلة
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:flex">
              تسجيل دخول
            </Button>
            <Button variant="hero">
              <Code className="w-4 h-4" />
              ابدأ التطوير
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;