import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Download, Star } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "مطور نشط",
      growth: "+25%"
    },
    {
      icon: Download,
      value: "2M+",
      label: "تحميل شهري",
      growth: "+40%"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "تقييم المستخدمين",
      growth: "+0.2"
    },
    {
      icon: TrendingUp,
      value: "99.9%",
      label: "وقت التشغيل",
      growth: "+0.1%"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 text-center bg-background/80 backdrop-blur-sm border-0 shadow-card hover:shadow-glow transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {stat.label}
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-secondary">
                  <TrendingUp className="w-3 h-3" />
                  {stat.growth}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;