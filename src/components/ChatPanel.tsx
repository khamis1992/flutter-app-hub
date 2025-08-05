import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Zap, Brain, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ChatPanel = () => {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4.1");
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
        console.log('Sending message to chat function...');
        
        const { data, error } = await supabase.functions.invoke('chat', {
          body: {
            messages: newMessages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            model: selectedModel === 'gpt-4.1' ? 'gpt-4o-mini' : 'gpt-4o-mini'
          }
        });

        console.log('Response from chat function:', { data, error });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'خطأ في استدعاء الدالة');
        }

        if (data?.error) {
          console.error('Function returned error:', data.error);
          throw new Error(data.error);
        }

        const assistantMessage = {
          id: newMessages.length + 1,
          type: "assistant" as const,
          content: data?.content || 'عذراً، لم أتمكن من الحصول على رد صحيح.',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...newMessages, assistantMessage]);
        
        toast({
          title: "تم الإرسال",
          description: "تم إرسال الرسالة بنجاح",
        });
      } catch (error) {
        console.error('Chat error:', error);
        
        let errorMessage = "فشل في الاتصال بالذكاء الاصطناعي";
        
        if (error.message?.includes('Failed to fetch')) {
          errorMessage = "فشل في الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى";
        } else if (error.message?.includes('timeout')) {
          errorMessage = "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "خطأ في الاتصال",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Add error message to chat
        const errorAssistantMessage = {
          id: newMessages.length + 1,
          type: "assistant" as const,
          content: `عذراً، حدث خطأ: ${errorMessage}`,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...newMessages, errorAssistantMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };


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
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm">
      {/* Chat Header with Model Selector */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border p-4">
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
                  : 'bg-primary text-primary-foreground'
              }`}>
                {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
               <Card className={`p-3 shadow-card backdrop-blur-sm ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'bg-card/80 border-border/50'
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
      <div className="p-4 border-t border-border bg-card/80 backdrop-blur-md">
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
          اضغط Enter للإرسال، Shift+Enter لسطر جديد
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;