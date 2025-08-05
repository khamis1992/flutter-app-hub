import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Play, Pause, CheckCircle, Clock, List, Zap } from 'lucide-react';

const ChatPanel = ({ onCodeGenerated, onProjectAnalyzed }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'مرحباً! أنا مساعد Flutter AI الذكي الحقيقي. يمكنني إنشاء تطبيقات Flutter حقيقية وتوليد كود فعلي. جرب أن تقول: "أريد إنشاء تطبيق متجر إلكتروني"',
      timestamp: new Date().toLocaleTimeString('ar-SA')
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4 Turbo');
  const [currentProject, setCurrentProject] = useState(null);
  const [isExecutingTasks, setIsExecutingTasks] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      // Send to real AI backend
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          context: messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString('ar-SA')
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Generate code based on the message
        await generateCode(currentMessage);
        
        // Analyze project if it seems like a project request
        if (currentMessage.includes('تطبيق') || currentMessage.includes('مشروع') || currentMessage.includes('أريد')) {
          await analyzeProject(currentMessage);
        }
      } else {
        throw new Error(data.message || 'فشل في الحصول على رد من الذكاء الاصطناعي');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي: ${error.message}. يرجى التأكد من أن الخادم يعمل على المنفذ 5000.`,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCode = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          project_type: selectedModel === 'ecommerce' ? 'ecommerce' : 
                       selectedModel === 'social' ? 'social' : 'general'
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.code) {
        let codeString = '';
        
        if (typeof data.code === 'string') {
          codeString = data.code;
        } else if (data.code.main_dart) {
          codeString = data.code.main_dart;
        } else {
          codeString = JSON.stringify(data.code, null, 2);
        }
        
        // Send generated code to preview panel
        if (onCodeGenerated) {
          onCodeGenerated(codeString);
        }
        
        // Add code generation message
        const codeMessage = {
          id: Date.now() + 2,
          type: 'assistant',
          content: '✅ تم توليد الكود بنجاح! يمكنك رؤيته في لوحة المعاينة.',
          timestamp: new Date().toLocaleTimeString('ar-SA')
        };
        setMessages(prev => [...prev, codeMessage]);
      }
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const analyzeProject = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/analyze-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.analysis) {
        setCurrentProject(data.analysis);
        
        // Send project analysis to parent component
        if (onProjectAnalyzed) {
          onProjectAnalyzed(data.analysis);
        }
        
        // Add project analysis message
        const analysisMessage = {
          id: Date.now() + 3,
          type: 'assistant',
          content: `📋 **تحليل المشروع:**

🎯 **اسم المشروع:** ${data.analysis.project_name}
📱 **نوع المشروع:** ${data.analysis.project_type}
📝 **الوصف:** ${data.analysis.description}
🔧 **مستوى التعقيد:** ${data.analysis.complexity}

✨ **الميزات المطلوبة:**
${data.analysis.features ? data.analysis.features.map(f => `• ${f}`).join('\n') : '• ميزات أساسية'}

📋 **المهام المطلوبة:**
${data.analysis.tasks ? data.analysis.tasks.map((t, i) => `${i+1}. ${t.title} (${t.priority})`).join('\n') : '• مهام أساسية'}

🛠️ **التقنيات المقترحة:**
${data.analysis.technologies ? data.analysis.technologies.join(', ') : 'Flutter, Dart'}`,
          timestamp: new Date().toLocaleTimeString('ar-SA'),
          project: data.analysis
        };
        
        setMessages(prev => [...prev, analysisMessage]);
      }
    } catch (error) {
      console.error('Error analyzing project:', error);
    }
  };

  const executeTask = async (taskIndex) => {
    if (!currentProject || !currentProject.tasks || isExecutingTasks) return;

    setIsExecutingTasks(true);
    const task = currentProject.tasks[taskIndex];

    try {
      const response = await fetch('http://localhost:5000/api/ai/execute-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: task,
          project_context: currentProject
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update task status
        const updatedProject = { ...currentProject };
        updatedProject.tasks[taskIndex].status = 'completed';
        setCurrentProject(updatedProject);

        // Add task completion message
        const taskMessage = {
          id: Date.now(),
          type: 'assistant',
          content: `✅ **تم تنفيذ المهمة بنجاح!**

📋 **المهمة:** ${task.title}
📝 **الوصف:** ${task.description}
⏱️ **الوقت المقدر:** ${task.estimated_time}

🎯 **تم إنشاء الكود المطلوب وإضافته للمعاينة.**`,
          timestamp: new Date().toLocaleTimeString('ar-SA')
        };

        setMessages(prev => [...prev, taskMessage]);

        // Generate code for the task
        if (data.code && onCodeGenerated) {
          let codeString = '';
          if (typeof data.code === 'string') {
            codeString = data.code;
          } else if (data.code.main_dart) {
            codeString = data.code.main_dart;
          } else {
            codeString = JSON.stringify(data.code, null, 2);
          }
          onCodeGenerated(codeString);
        }
      } else {
        throw new Error(data.message || 'فشل في تنفيذ المهمة');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        type: 'assistant',
        content: `❌ خطأ في تنفيذ المهمة: ${error.message}`,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsExecutingTasks(false);
    }
  };

  const quickPrompts = [
    'أريد إنشاء تطبيق متجر إلكتروني متكامل',
    'اعمل لي تطبيق شبكة اجتماعية',
    'أريد تطوير تطبيق إدارة المهام',
    'كيف يمكنني إنشاء واجهة جميلة؟'
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
            <h3 className="font-bold text-gray-800">مساعد Flutter الذكي الحقيقي</h3>
            <p className="text-sm text-gray-600">متصل بـ OpenAI GPT-4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">متصل</span>
        </div>
      </div>

      {/* Project Status */}
      {currentProject && (
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">{currentProject.project_name}</h4>
              <p className="text-sm opacity-90">نوع المشروع: {currentProject.project_type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">المهام: {currentProject.tasks ? currentProject.tasks.filter(t => t.status === 'completed').length : 0}/{currentProject.tasks ? currentProject.tasks.length : 0}</p>
              <p className="text-xs opacity-75">التعقيد: {currentProject.complexity}</p>
            </div>
          </div>
          
          {/* Tasks */}
          {currentProject.tasks && (
            <div className="mt-3 space-y-2">
              {currentProject.tasks.slice(0, 3).map((task, index) => (
                <div key={index} className="flex items-center justify-between bg-white/20 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-300" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-300" />
                    )}
                    <span className="text-sm">{task.title}</span>
                  </div>
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => executeTask(index)}
                      disabled={isExecutingTasks}
                      className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded text-xs hover:bg-white/30 disabled:opacity-50"
                    >
                      {isExecutingTasks ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      تنفيذ
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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
                <span className="text-sm text-gray-600">جاري التفكير مع GPT-4...</span>
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

