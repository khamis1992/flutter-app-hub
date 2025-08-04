import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2, Play, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="absolute top-10 right-1/4 w-20 h-20 bg-primary-foreground/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-float delay-1000" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-primary-foreground mb-8">
            <Sparkles className="w-4 h-4" />
            ابدأ رحلتك في تطوير Flutter اليوم
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
            جاهز لإنشاء تطبيقك
            <br />
            <span className="bg-gradient-to-r from-secondary to-primary-glow bg-clip-text text-transparent">
              القادم؟
            </span>
          </h2>
          
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            انضم إلى آلاف المطورين الذين يستخدمون FlutterHub لإنشاء تطبيقات استثنائية. ابدأ مجاناً ولا تحتاج بطاقة ائتمان.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg" className="text-lg px-10">
              <Code2 className="w-5 h-5 ml-2" />
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg bg-primary-foreground/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30"
            >
              <Play className="w-5 h-5 ml-2" />
              جولة سريعة (3 دقائق)
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-primary-foreground/60">
            لا حاجة لبطاقة ائتمان • 14 يوم تجريبي مجاني • إلغاء في أي وقت
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;