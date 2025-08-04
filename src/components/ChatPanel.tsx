import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Code, Smartphone, Palette, Zap, Brain, Clock, Terminal, Cpu } from "lucide-react";

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
    <motion.div 
      className="h-full flex flex-col bg-background matrix-bg font-rajdhani"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Chat Header with Model Selector */}
      <motion.div 
        className="bg-background neon-border p-4 scan-line"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <motion.h2 
            className="text-xl font-bold neon-text font-orbitron"
            animate={{ 
              textShadow: [
                "0 0 5px hsl(var(--primary))",
                "0 0 20px hsl(var(--primary))",
                "0 0 5px hsl(var(--primary))"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Terminal className="w-5 h-5 inline mr-2" />
            المحادثة
          </motion.h2>
          
          {/* Model Selector */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm text-muted-foreground font-space-mono">النموذج:</span>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 cyber-card neon-border">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {currentModel && (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <currentModel.icon className={`w-4 h-4 ${currentModel.color}`} />
                        </motion.div>
                        <span className="font-medium font-rajdhani">{currentModel.name}</span>
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="cyber-card neon-border">
                {llmModels.map((model) => {
                  const Icon = model.icon;
                  return (
                    <SelectItem key={model.id} value={model.id} className="hover:bg-muted/20">
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
          </motion.div>
        </div>
        
        {/* Current Model Info */}
        {currentModel && (
          <motion.div 
            className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <currentModel.icon className={`w-3 h-3 ${currentModel.color}`} />
            </motion.div>
            <span>يتم استخدام {currentModel.name} - {currentModel.description}</span>
            <motion.div
              className="w-2 h-2 bg-secondary rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div 
              key={msg.id} 
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 300
              }}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-glow ${
                    msg.type === 'user' 
                      ? 'bg-gradient-primary neon-border' 
                      : 'bg-gradient-secondary neon-border'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ 
                    boxShadow: msg.type === 'user' 
                      ? ["0 0 10px hsl(var(--primary) / 0.3)", "0 0 20px hsl(var(--primary) / 0.6)", "0 0 10px hsl(var(--primary) / 0.3)"]
                      : ["0 0 10px hsl(var(--secondary) / 0.3)", "0 0 20px hsl(var(--secondary) / 0.6)", "0 0 10px hsl(var(--secondary) / 0.3)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {msg.type === 'user' ? (
                    <User className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Cpu className="w-5 h-5 text-secondary-foreground" />
                    </motion.div>
                  )}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={`p-4 cyber-card shadow-glow ${
                    msg.type === 'user' 
                      ? 'bg-gradient-primary text-primary-foreground neon-border' 
                      : 'bg-gradient-card neon-border'
                  }`}>
                    <motion.p 
                      className="text-sm leading-relaxed font-rajdhani"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {msg.content}
                    </motion.p>
                    <motion.p 
                      className={`text-xs mt-2 font-space-mono ${
                        msg.type === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {msg.timestamp}
                    </motion.p>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <motion.div 
        className="p-4 neon-border"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex gap-3">
          <motion.div className="flex-1" whileFocus={{ scale: 1.02 }}>
            <Textarea
              placeholder="اكتب رسالتك هنا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none cyber-card neon-border font-rajdhani text-foreground"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleSend}
              disabled={!message.trim()}
              className="self-end cyber-button h-[84px] w-16 p-0"
            >
              <motion.div
                animate={message.trim() ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
        <motion.p 
          className="text-xs text-muted-foreground mt-2 text-center font-space-mono"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          اضغط Enter للإرسال، Shift+Enter لسطر جديد
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default ChatPanel;