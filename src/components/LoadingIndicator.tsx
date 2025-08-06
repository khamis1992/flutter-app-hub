import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  Brain, 
  Code, 
  FileCheck, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface LoadingIndicatorProps {
  stage?: 'connecting' | 'generating' | 'parsing' | 'validating' | 'complete';
  message?: string;
  progress?: number;
  model?: string;
  appType?: string;
}

const LoadingIndicator = ({ 
  stage = 'generating', 
  message, 
  progress,
  model = 'GPT-4.1',
  appType = 'productivity'
}: LoadingIndicatorProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [animatedStage, setAnimatedStage] = useState(stage);

  // Animate progress based on stage
  useEffect(() => {
    const progressMap = {
      connecting: 15,
      generating: 60,
      parsing: 80,
      validating: 95,
      complete: 100
    };

    const targetProgress = progress !== undefined ? progress : progressMap[stage];
    
    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= targetProgress) {
          clearInterval(interval);
          return targetProgress;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [stage, progress]);

  // Update animated stage with delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedStage(stage);
    }, 300);
    return () => clearTimeout(timeout);
  }, [stage]);

  const getStageInfo = (currentStage: string) => {
    const stages = {
      connecting: {
        icon: Brain,
        title: "جاري الاتصال...",
        description: `الاتصال بنموذج ${model}`,
        color: "text-blue-500",
        bgColor: "bg-blue-50"
      },
      generating: {
        icon: Sparkles,
        title: "توليد الكود...",
        description: `إنشاء تطبيق ${getAppTypeName(appType)} باستخدام أفضل الممارسات`,
        color: "text-primary",
        bgColor: "bg-primary/10"
      },
      parsing: {
        icon: Code,
        title: "تحليل الكود...",
        description: "تنظيم الملفات وتحليل البنية المعمارية",
        color: "text-orange-500",
        bgColor: "bg-orange-50"
      },
      validating: {
        icon: FileCheck,
        title: "فحص الجودة...",
        description: "التحقق من معايير الجودة والأمان",
        color: "text-green-500",
        bgColor: "bg-green-50"
      },
      complete: {
        icon: CheckCircle2,
        title: "اكتمل بنجاح!",
        description: "تم إنشاء تطبيق Flutter عالي الجودة",
        color: "text-green-600",
        bgColor: "bg-green-100"
      }
    };

    return stages[currentStage as keyof typeof stages] || stages.generating;
  };

  const getAppTypeName = (type: string) => {
    const names = {
      productivity: 'إنتاجية',
      ecommerce: 'تجارة إلكترونية',
      social: 'تواصل اجتماعي',
      fitness: 'لياقة بدنية',
      education: 'تعليمي',
      entertainment: 'ترفيه'
    };
    return names[type as keyof typeof names] || 'Flutter';
  };

  const stageInfo = getStageInfo(animatedStage);
  const Icon = stageInfo.icon;

  const tips = [
    "💡 يتم استخدام Clean Architecture لضمان جودة الكود",
    "🎯 Provider يدير حالة التطبيق بكفاءة",
    "🔒 يتم تطبيق أفضل معايير الأمان",
    "📱 التطبيق متوافق مع Android و iOS",
    "🌟 كود قابل للصيانة والتطوير",
    "⚡ أداء محسن وسريع الاستجابة"
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 space-y-4 bg-card/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 text-right">
        <div className={`p-2 rounded-full ${stageInfo.bgColor}`}>
          <Icon className={`w-5 h-5 ${stageInfo.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{stageInfo.title}</h3>
          <p className="text-sm text-muted-foreground">
            {message || stageInfo.description}
          </p>
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{currentProgress}%</span>
          <span>مولد Flutter AI CTO</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>

      {/* Model & App Type Info */}
      <div className="flex justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
        <div className="text-right">
          <div>النموذج: <span className="font-medium text-foreground">{model}</span></div>
          <div>نوع التطبيق: <span className="font-medium text-foreground">{getAppTypeName(appType)}</span></div>
        </div>
      </div>

      {/* Animated Tips */}
      <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
        <div className="text-sm text-primary/80 text-right transition-all duration-500">
          {tips[currentTip]}
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-center gap-2">
        {['connecting', 'generating', 'parsing', 'validating', 'complete'].map((stageName, index) => (
          <div
            key={stageName}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              Object.keys(getStageInfo('').constructor()).indexOf(animatedStage) >= index
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

export default LoadingIndicator;