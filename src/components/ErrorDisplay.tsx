import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  AlertTriangle, 
  RefreshCcw, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ErrorDisplayProps {
  error: string;
  errorType?: 'validation' | 'api' | 'parsing' | 'network' | 'general';
  onRetry?: () => void;
  onFallback?: () => void;
  context?: {
    model?: string;
    appType?: string;
    prompt?: string;
  };
}

const ErrorDisplay = ({ 
  error, 
  errorType = 'general', 
  onRetry, 
  onFallback, 
  context 
}: ErrorDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getErrorDetails = (type: string) => {
    const details = {
      validation: {
        title: "خطأ في التحقق من الكود المولد",
        description: "الكود المولد لا يلبي معايير الجودة المطلوبة",
        solutions: [
          "تحقق من أن الوصف واضح ومفصل",
          "جرب نموذج AI مختلف (Claude 4 Opus للمهام المعقدة)",
          "أضف تفاصيل أكثر عن الميزات المطلوبة",
          "تأكد من اختيار نوع التطبيق المناسب"
        ],
        icon: AlertTriangle,
        color: "destructive"
      },
      api: {
        title: "خطأ في خدمة الذكاء الاصطناعي",
        description: "حدث خطأ في الاتصال بخدمة توليد الكود",
        solutions: [
          "تحقق من صحة مفتاح OpenAI API",
          "تأكد من توفر رصيد كافي في حساب OpenAI",
          "جرب المحاولة مرة أخرى بعد دقائق قليلة",
          "تحقق من استقرار الاتصال بالإنترنت"
        ],
        icon: ExternalLink,
        color: "destructive"
      },
      parsing: {
        title: "خطأ في تحليل الكود المولد",
        description: "تعذر تحليل الكود المولد من الذكاء الاصطناعي",
        solutions: [
          "اجعل الوصف أكثر تحديداً ووضوحاً",
          "استخدم نموذج أكثر تقدماً (GPT-4.1 أو Claude 4)",
          "قلل من تعقيد المتطلبات في المحاولة الأولى",
          "جرب إعادة صياغة الطلب بطريقة مختلفة"
        ],
        icon: Info,
        color: "default"
      },
      network: {
        title: "خطأ في الشبكة",
        description: "تعذر الاتصال بخدمات توليد الكود",
        solutions: [
          "تحقق من اتصالك بالإنترنت",
          "جرب تحديث الصفحة",
          "تأكد من عدم حجب خدمات Supabase",
          "انتظر قليلاً ثم أعد المحاولة"
        ],
        icon: AlertTriangle,
        color: "default"
      },
      general: {
        title: "حدث خطأ غير متوقع",
        description: "واجهنا مشكلة أثناء توليد الكود",
        solutions: [
          "أعد المحاولة مع وصف مبسط",
          "تحقق من إعدادات المشروع",
          "جرب نموذج AI مختلف",
          "تواصل مع الدعم الفني إذا استمر الخطأ"
        ],
        icon: AlertTriangle,
        color: "destructive"
      }
    };

    return details[type as keyof typeof details] || details.general;
  };

  const errorDetails = getErrorDetails(errorType);
  const Icon = errorDetails.icon;

  const copyErrorDetails = async () => {
    const errorInfo = `
تفاصيل الخطأ:
- الوقت: ${new Date().toLocaleString('ar-SA')}
- النوع: ${errorDetails.title}
- النموذج: ${context?.model || 'غير محدد'}
- نوع التطبيق: ${context?.appType || 'غير محدد'}
- الخطأ: ${error}
- السياق: ${context?.prompt?.substring(0, 200)}...
    `.trim();

    try {
      await navigator.clipboard.writeText(errorInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "تم نسخ تفاصيل الخطأ",
        description: "يمكنك الآن إرسالها للدعم الفني"
      });
    } catch (err) {
      toast({
        title: "فشل في النسخ",
        description: "يرجى نسخ تفاصيل الخطأ يدوياً",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Alert variant={errorDetails.color as "default" | "destructive"}>
        <Icon className="h-4 w-4" />
        <AlertTitle className="text-right">{errorDetails.title}</AlertTitle>
        <AlertDescription className="text-right mt-2">
          {errorDetails.description}
        </AlertDescription>
      </Alert>

      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-3 text-right">الحلول المقترحة:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {errorDetails.solutions.map((solution, index) => (
            <li key={index} className="flex items-start gap-2 text-right">
              <span className="text-primary mt-1">•</span>
              <span>{solution}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4 bg-muted/30">
        <h4 className="font-medium text-foreground mb-2 text-right">تفاصيل تقنية:</h4>
        <div className="text-xs text-muted-foreground space-y-1 text-right">
          <div>النموذج: {context?.model || 'غير محدد'}</div>
          <div>نوع التطبيق: {context?.appType || 'غير محدد'}</div>
          <div>الخطأ: {error}</div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={copyErrorDetails}
          className="gap-2"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              نسخ التفاصيل
            </>
          )}
        </Button>

        {onFallback && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFallback}
            className="gap-2"
          >
            <Info className="w-4 h-4" />
            مشروع بديل
          </Button>
        )}

        {onRetry && (
          <Button
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;