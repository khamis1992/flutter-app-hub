import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Smartphone, Code2, Zap } from "lucide-react";
import heroImage from "@/assets/flutter-hero.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-hero flex items-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-float delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-primary-foreground mb-6">
              <Zap className="w-4 h-4" />
              منصة متطورة لتطوير تطبيقات Flutter
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              طور تطبيقات
              <br />
              <span className="bg-gradient-to-r from-secondary to-primary-glow bg-clip-text text-transparent">
                Flutter احترافية
              </span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto lg:mx-0">
              منصة شاملة لتطوير تطبيقات الهواتف الذكية باستخدام Flutter مع أدوات ذكية ومساعد AI لتسريع عملية التطوير
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="gradient" size="lg" className="text-lg px-8">
                <Code2 className="w-5 h-5 ml-2" />
                ابدأ المشروع الآن
              </Button>
              <Button variant="outline" size="lg" className="text-lg bg-background/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/30">
                <Play className="w-5 h-5 ml-2" />
                شاهد العرض التوضيحي
              </Button>
            </div>
            
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">50K+</div>
                <div className="text-sm text-primary-foreground/70">مطور نشط</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">100K+</div>
                <div className="text-sm text-primary-foreground/70">تطبيق منشور</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">99%</div>
                <div className="text-sm text-primary-foreground/70">رضا المستخدمين</div>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Flutter Development Platform" 
                className="w-full h-auto rounded-2xl shadow-2xl animate-float"
              />
              <div className="absolute inset-0 bg-gradient-primary/20 rounded-2xl" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-background shadow-card rounded-xl p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">تطبيق جديد</div>
                  <div className="text-xs text-muted-foreground">تم إنشاؤه بنجاح</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background shadow-card rounded-xl p-4 animate-float delay-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">AI مساعد</div>
                  <div className="text-xs text-muted-foreground">جاهز للمساعدة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;