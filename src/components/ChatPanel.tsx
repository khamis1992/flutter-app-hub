import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Zap, Brain, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChatPanel = ({ onCodeGenerated }: { onCodeGenerated?: (project: any) => void }) => {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4.1");
  const [appType, setAppType] = useState("productivity");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = {
        id: messages.length + 1,
        type: "user" as const,
        content: message,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setMessage("");
      setIsLoading(true);

      try {
        console.log('Sending request to Flutter AI Backend...');
        
        // Call the CTO Expert Backend
        const response = await fetch('http://localhost:8006/api/cto/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: message,
            app_type: appType,
            requirements: {
              features: ["modern_ui", "responsive_design"],
              platforms: ["android", "ios"],
              complexity: "medium"
            },
            preferences: {
              state_management: "provider",
              architecture: "clean",
              testing: true
            }
          })
        });

        const result = await response.json();
        console.log('Response from Flutter AI Backend:', result);

        if (result.success && result.project) {
          const botMessage = {
            id: newMessages.length + 1,
            type: "bot" as const,
            content: `تم إنشاء تطبيق Flutter بنجاح! 🎉\n\n**اسم المشروع:** ${result.project.name}\n**الوصف:** ${result.project.description}\n**نقاط الجودة:** ${result.project.quality_score}/100\n\n**الملفات المولدة:**\n${Object.keys(result.project.files).map(file => `• ${file}`).join('\n')}\n\n**الأنماط المطبقة:**\n${result.project.patterns?.map((pattern: string) => `• ${pattern}`).join('\n') || 'Clean Architecture, MVVM'}\n\n**التبعيات:**\n${result.project.dependencies?.map((dep: string) => `• ${dep}`).join('\n') || 'Provider, GetIt, Freezed'}`,
            timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            project: result.project
          };
          
          setMessages([...newMessages, botMessage]);
          
          // Pass the generated project to parent component
          if (onCodeGenerated) {
            onCodeGenerated(result.project);
          }
          
          toast({
            title: "تم إنشاء التطبيق بنجاح! 🎉",
            description: `تم توليد ${Object.keys(result.project.files).length} ملف بجودة ${result.project.quality_score}/100`,
          });
        } else {
          throw new Error(result.error || 'فشل في توليد الكود');
        }
      } catch (error) {
        console.error('Error calling Flutter AI Backend:', error);
        
        const errorMessage = {
          id: newMessages.length + 1,
          type: "bot" as const,
          content: `عذراً، حدث خطأ في توليد الكود. يرجى المحاولة مرة أخرى.\n\n**تفاصيل الخطأ:** ${error instanceof Error ? error.message : 'خطأ غير معروف'}\n\n**تأكد من:**\n• تشغيل الخادم الخلفي على المنفذ 8006\n• توفر مفتاح OpenAI API\n• الاتصال بالإنترنت`,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([...newMessages, errorMessage]);
        
        toast({
          title: "خطأ في توليد الكود",
          description: "يرجى التأكد من تشغيل الخادم الخلفي والمحاولة مرة أخرى",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const quickPrompts = [
    "أريد إنشاء تطبيق إدارة المهام",
    "تطبيق للتجارة الإلكترونية",
    "تطبيق للتواصل الاجتماعي",
    "تطبيق للياقة البدنية"
  ];

  const llmModels = [
    { 
      id: "gpt-4.1", 
      name: "GPT-4.1", 
      description: "النموذج الرئيسي - متوازن وقوي",
      icon: Brain,
      color: "text-primary"
    },
    { 
      id: "claude-4-opus", 
      name: "Claude 4 Opus", 
      description: "الأكثر ذكاءً - للمهام المعقدة",
      icon: Zap,
      color: "text-accent"
    },
    { 
      id: "claude-4-sonnet", 
      name: "Claude 4 Sonnet", 
      description: "عالي الأداء - سريع وذكي",
      icon: Clock,
      color: "text-secondary"
    }
  ];

  const appTypes = [
    { id: "productivity", name: "إنتاجية", description: "تطبيقات إدارة المهام والملاحظات" },
    { id: "ecommerce", name: "تجارة إلكترونية", description: "متاجر ومنصات البيع" },
    { id: "social", name: "تواصل اجتماعي", description: "شبكات التواصل والمحادثة" },
    { id: "fitness", name: "لياقة بدنية", description: "تطبيقات الرياضة والصحة" },
    { id: "education", name: "تعليمية", description: "منصات التعلم والتدريب" },
    { id: "entertainment", name: "ترفيه", description: "الألعاب والوسائط" }
  ];

  const currentModel = llmModels.find(model => model.id === selectedModel);

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm">
      {/* Chat Header with Model Selector */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">مولد Flutter AI - مستوى CTO</h2>
          
          {/* Model Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">النموذج:</span>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {currentModel && (
                      <>
                        <currentModel.icon className={`w-4 h-4 ${currentModel.color}`} />
                        <span className="font-medium">{currentModel.name}</span>
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {llmModels.map((model) => {
                  const Icon = model.icon;
                  return (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-3 py-1">
                        <Icon className={`w-4 h-4 ${model.color}`} />
                        <div className="flex flex-col">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* App Type Selector */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">نوع التطبيق:</span>
          <Select value={appType} onValueChange={setAppType}>
            <SelectTrigger className="w-64">
              <SelectValue>
                {appTypes.find(type => type.id === appType)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {appTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{type.name}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Current Model Info */}
        {currentModel && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <currentModel.icon className={`w-3 h-3 ${currentModel.color}`} />
            <span>يتم استخدام {currentModel.name} - {currentModel.description}</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">اقتراحات سريعة:</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 px-3 text-right justify-start"
                onClick={() => setMessage(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">مرحباً بك في مولد Flutter AI</p>
            <p className="text-sm">اكتب وصف التطبيق الذي تريد إنشاؤه وسأقوم بتوليد كود Flutter كامل بمعايير CTO خبير</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
               <Card className={`p-3 shadow-card backdrop-blur-sm ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'bg-card/80 border-border/50'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                <p className={`text-xs mt-2 ${
                  msg.type === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {msg.timestamp}
                </p>
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </div>
              <Card className="p-3 bg-card/80 border-border/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">جاري توليد كود Flutter...</span>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card/80 backdrop-blur-md">
        <div className="flex gap-2">
          <Textarea
            placeholder="اكتب وصف التطبيق الذي تريد إنشاؤه..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button 
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          اضغط Enter للإرسال، Shift+Enter لسطر جديد • مدعوم بـ Flutter AI CTO Expert
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;