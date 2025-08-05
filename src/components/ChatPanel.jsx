import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Play, Pause, CheckCircle, Clock, List, Zap } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ChatPanel = ({ onCodeGenerated, onProjectAnalyzed }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'مرحباً! أنا مساعد الذكاء الاصطناعي. يمكنني مساعدتك في البرمجة وتطوير التطبيقات. اسأل عن أي شيء تريد مساعدة فيه!',
      timestamp: new Date().toLocaleTimeString('ar-SA')
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callAIWithRetry = async (messagesPayload, model, attempt = 1) => {
    const maxRetries = 3;
    const timeoutMs = 30000; // 30 seconds

    try {
      console.log(`Attempt ${attempt} to call AI service...`);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: messagesPayload,
          model: model 
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (error) {
        throw new Error(error.message || 'خطأ في استدعاء خدمة الذكاء الاصطناعي');
      }

      if (!data?.content) {
        throw new Error('لم يتم استلام رد صحيح من الذكاء الاصطناعي');
      }

      return data.content;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries && !error.name === 'AbortError') {
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return callAIWithRetry(messagesPayload, model, attempt + 1);
      }
      
      throw error;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('ar-SA')
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue('');
    setIsLoading(true);
    setRetryCount(0);

    try {
      // Prepare messages for AI
      const messagesPayload = [
        ...messages.slice(-5).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: currentMessage
        }
      ];

      const response = await callAIWithRetry(messagesPayload, selectedModel);

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "تم الإرسال بنجاح",
        description: "تم استلام رد من الذكاء الاصطناعي",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي';
      
      if (error.name === 'AbortError') {
        errorMessage = 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى';
      } else if (error.message?.includes('API key')) {
        errorMessage = 'خطأ في إعدادات الذكاء الاصطناعي. يرجى التحقق من المفاتيح';
      } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
        errorMessage = 'خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت';
      } else if (error.message) {
        errorMessage = error.message;
      }

      const errorMessageObj = {
        id: Date.now() + 1,
        type: 'assistant',
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
      
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // These functions are now removed as they were using localhost:5000
  // The main chat functionality now uses Supabase edge functions

  const quickPrompts = [
    'كيف يمكنني تطوير موقع ويب بسيط؟',
    'ما هي أفضل الممارسات في React؟',
    'كيف أستخدم Tailwind CSS؟',
    'كيف يمكنني إنشاء API بسيط؟'
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">مساعد الذكاء الاصطناعي</h3>
            <p className="text-sm text-gray-600">متصل بـ OpenAI عبر Supabase</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">متصل</span>
        </div>
      </div>

      {/* Connection Status */}
      {isLoading && (
        <div className="p-2 bg-blue-50 border-b">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري الاتصال بالذكاء الاصطناعي...</span>
            {retryCount > 0 && <span>(المحاولة {retryCount + 1})</span>}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-white shadow-sm border'
            }`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              
              <div className="text-xs opacity-70 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {message.timestamp}
              </div>
            </div>
            
            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white shadow-sm border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">جاري التفكير...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setInputValue(prompt)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال)"
              className="w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              rows="2"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

