import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Code, Smartphone, Palette, Sparkles, MessageSquare, Clock } from "lucide-react";

const ChatPanel = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "مرحباً! أنا مساعدك الذكي لتطوير تطبيقات Flutter. يمكنني مساعدتك في إنشاء تطبيقات احترافية بسرعة وسهولة.",
      timestamp: "10:30"
    },
    {
      id: 2,
      type: "user", 
      content: "أريد إنشاء تطبيق للتسوق الإلكتروني مع تصميم عصري",
      timestamp: "10:31"
    },
    {
      id: 3,
      type: "assistant",
      content: "ممتاز! سأساعدك في إنشاء تطبيق تسوق إلكتروني احترافي. سأبدأ بإنشاء الهيكل الأساسي مع الصفحة الرئيسية، قائمة المنتجات، والسلة. هل تفضل تصميماً معيناً أم تريدني أن أقترح عليك أفضل الممارسات؟",
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
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: "assistant" as const,
          content: "جاري العمل على طلبك... سأقوم بإنشاء الكود المطلوب وعرضه في منطقة المعاينة.",
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const suggestions = [
    { icon: Smartphone, text: "إنشاء صفحة رئيسية متقدمة", color: "from-blue-500 to-indigo-600" },
    { icon: Code, text: "إضافة قائمة منتجات تفاعلية", color: "from-purple-500 to-pink-600" },
    { icon: Palette, text: "تحسين الألوان والتصميم", color: "from-green-500 to-teal-600" },
    { icon: Sparkles, text: "إضافة رسوم متحركة", color: "from-orange-500 to-red-600" }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-mesh relative">
      {/* Header */}
      <div className="p-6 bg-glass-bg backdrop-blur-glass border-b border-glass-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">مساعد Flutter الذكي</h2>
            <p className="text-sm text-muted-foreground">اكتب أي شيء تريده وسأساعدك</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div 
            key={msg.id} 
            className={`animate-slide-up flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-medium ${
                msg.type === 'user' 
                  ? 'bg-gradient-primary text-primary-foreground' 
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
              }`}>
                {msg.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <Card className={`p-4 shadow-large border-0 relative overflow-hidden ${
                msg.type === 'user' 
                  ? 'bg-gradient-primary text-primary-foreground' 
                  : 'bg-background/80 backdrop-blur-sm'
              }`}>
                <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
                <div className="relative">
                  <p className="text-sm leading-relaxed mb-2">{msg.content}</p>
                  <div className={`flex items-center gap-2 text-xs ${
                    msg.type === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="p-6 bg-glass-bg backdrop-blur-glass border-t border-glass-border">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          اقتراحات سريعة
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="glass"
              className="justify-start h-auto p-4 text-right hover:scale-105 transition-all duration-300"
              onClick={() => setMessage(suggestion.text)}
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${suggestion.color} rounded-lg flex items-center justify-center mr-3`}>
                <suggestion.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">{suggestion.text}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-6 bg-background border-t border-border">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              placeholder="اكتب رسالتك هنا... مثال: أريد إضافة صفحة تسجيل دخول"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none border-0 bg-muted/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-300"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="absolute bottom-3 left-3 text-xs text-muted-foreground">
              Enter للإرسال • Shift+Enter لسطر جديد
            </div>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!message.trim()}
            variant="gradient"
            size="lg"
            className="self-end h-[84px] px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;