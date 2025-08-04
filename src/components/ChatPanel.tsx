import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Code, Smartphone, Palette, Zap, Brain, Clock } from "lucide-react";

const ChatPanel = () => {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4.1");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "مرحباً! أنا مساعدك الذكي لتطوير تطبيقات Flutter. كيف يمكنني مساعدتك اليوم؟",
      timestamp: "10:30"
    },
    {
      id: 2,
      type: "user", 
      content: "أريد إنشاء تطبيق للتسوق الإلكتروني",
      timestamp: "10:31"
    },
    {
      id: 3,
      type: "assistant",
      content: "ممتاز! سأساعدك في إنشاء تطبيق تسوق إلكتروني. سأبدأ بإنشاء الصفحة الرئيسية مع قائمة المنتجات وشريط البحث.",
      timestamp: "10:31"
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "user" as const,
        content: message,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const suggestions = [
    { icon: Smartphone, text: "إنشاء صفحة رئيسية" },
    { icon: Code, text: "إضافة قائمة المنتجات" },
    { icon: Palette, text: "تحسين التصميم" }
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

  const currentModel = llmModels.find(model => model.id === selectedModel);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header with Model Selector */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">المحادثة</h2>
          
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
        
        {/* Current Model Info */}
        {currentModel && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <currentModel.icon className={`w-3 h-3 ${currentModel.color}`} />
            <span>يتم استخدام {currentModel.name} - {currentModel.description}</span>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gradient-primary text-primary-foreground'
              }`}>
                {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <Card className={`p-3 ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
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
      </div>


      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            placeholder="اكتب رسالتك هنا..."
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
            disabled={!message.trim()}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          اضغط Enter للإرسال، Shift+Enter لسطر جديد
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;