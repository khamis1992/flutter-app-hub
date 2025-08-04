import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Code, Smartphone, Palette } from "lucide-react";

const ChatPanel = () => {
  const [message, setMessage] = useState("");
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

  return (
    <div className="h-full flex flex-col bg-background">
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