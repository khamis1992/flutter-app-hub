import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Code2, 
  Zap, 
  Palette, 
  Database, 
  Cloud,
  Bot,
  Layers,
  ArrowLeft
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "مساعد AI ذكي",
      description: "مساعد ذكي يساعدك في كتابة الكود وحل المشاكل وتحسين الأداء",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Code2,
      title: "محرر كود متطور",
      description: "محرر كود مع ميزات IntelliSense وإكمال تلقائي مخصص لـ Flutter",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Smartphone,
      title: "معاينة مباشرة",
      description: "شاهد تطبيقك على أجهزة مختلفة في الوقت الفعلي أثناء التطوير",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Palette,
      title: "مكتبة تصاميم",
      description: "مكتبة واسعة من التصاميم والقوالب الجاهزة لتسريع التطوير",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Database,
      title: "قاعدة بيانات مدمجة",
      description: "إدارة قواعد البيانات والAPI بسهولة مع أدوات مرئية بديهية",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Cloud,
      title: "نشر سحابي",
      description: "انشر تطبيقاتك على متاجر التطبيقات بنقرة واحدة",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-6">
            <Layers className="w-4 h-4" />
            المميزات
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            كل ما تحتاجه لتطوير
            <span className="bg-gradient-primary bg-clip-text text-transparent"> تطبيقات احترافية</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            منصة شاملة تجمع جميع الأدوات والمميزات التي تحتاجها لتطوير تطبيقات Flutter متقدمة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-8 bg-gradient-card hover:shadow-card transition-all duration-300 group border-0">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="px-8">
            <Code2 className="w-5 h-5 ml-2" />
            اكتشف جميع المميزات
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;