import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Play, Pause, CheckCircle, Clock, List, Zap } from 'lucide-react';

const ChatPanel = ({ onCodeGenerated }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'مرحباً! أنا مساعد Flutter AI الذكي المطور. يمكنني إنشاء مشاريع كاملة مع نظام إدارة المهام المتقدم. جرب أن تقول: "أريد إنشاء تطبيق متجر إلكتروني متكامل"',
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
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to enhanced backend
      const response = await fetch('http://localhost:8002/api/chat/project-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          model: selectedModel
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response_message,
          timestamp: new Date().toLocaleTimeString('ar-SA'),
          project: data.project_created ? data.project : null,
          nextTask: data.next_task || null
        };

        setMessages(prev => [...prev, assistantMessage]);

        if (data.project_created) {
          setCurrentProject(data.project);
        }

        // Generate code if there's a next task
        if (data.next_task && onCodeGenerated) {
          onCodeGenerated(`// المهمة التالية: ${data.next_task.title}
// ${data.next_task.description}

import 'package:flutter/material.dart';

class NextTaskWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${data.next_task.title}'),
      ),
      body: Center(
        child: Text('جاري تطوير هذه المهمة...'),
      ),
    );
  }
}`);
        }
      } else {
        throw new Error(data.error || 'خطأ في الاستجابة');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `عذراً، حدث خطأ: ${error.message}. سأحاول الرد بطريقة تقليدية.`,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeNextTask = async () => {
    if (!currentProject || isExecutingTasks) return;

    setIsExecutingTasks(true);

    try {
      const response = await fetch(`http://localhost:8002/api/projects/${currentProject.id}/execute-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        const taskMessage = {
          id: Date.now(),
          type: 'assistant',
          content: `✅ **تم تنفيذ المهمة بنجاح!**

📋 **المهمة:** ${data.task_completed.title}
📝 **الوصف:** ${data.task_completed.description}
⏱️ **الوقت المقدر:** ${data.task_completed.estimated_time} دقيقة
📊 **تقدم المشروع:** ${data.project_status.project.progress.toFixed(1)}%

🎯 **المهمة التالية:** ${data.project_status.next_task ? data.project_status.next_task.title : 'تم إنجاز جميع المهام! 🎉'}`,
          timestamp: new Date().toLocaleTimeString('ar-SA'),
          taskCompleted: data.task_completed,
          projectStatus: data.project_status
        };

        setMessages(prev => [...prev, taskMessage]);

        // Update current project
        setCurrentProject(data.project_status.project);

        // Generate code for the completed task
        if (data.code_result && data.code_result.files && onCodeGenerated) {
          const files = data.code_result.files;
          const mainFile = Object.keys(files)[0];
          if (mainFile && files[mainFile]) {
            onCodeGenerated(files[mainFile]);
          }
        }
      } else {
        throw new Error(data.error || 'فشل في تنفيذ المهمة');
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

  const executeAllTasks = async () => {
    if (!currentProject || isExecutingTasks) return;

    setIsExecutingTasks(true);

    try {
      const response = await fetch(`http://localhost:8002/api/projects/${currentProject.id}/execute-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        const allTasksMessage = {
          id: Date.now(),
          type: 'assistant',
          content: `🎉 **تم تنفيذ جميع المهام بنجاح!**

📊 **ملخص التنفيذ:**
✅ تم تنفيذ ${data.executed_tasks.length} مهمة
📈 تقدم المشروع: ${data.final_status.project.progress.toFixed(1)}%

📋 **سجل التنفيذ:**
${data.execution_log.join('\\n')}

🚀 **المشروع جاهز للاستخدام!**`,
          timestamp: new Date().toLocaleTimeString('ar-SA'),
          executedTasks: data.executed_tasks,
          finalStatus: data.final_status
        };

        setMessages(prev => [...prev, allTasksMessage]);

        // Update current project
        setCurrentProject(data.final_status.project);

        // Generate final code
        if (data.executed_tasks.length > 0 && onCodeGenerated) {
          const lastTask = data.executed_tasks[data.executed_tasks.length - 1];
          if (lastTask.code_result && lastTask.code_result.files) {
            const files = lastTask.code_result.files;
            const mainFile = Object.keys(files)[0];
            if (mainFile && files[mainFile]) {
              onCodeGenerated(files[mainFile]);
            }
          }
        }
      } else {
        throw new Error(data.error || 'فشل في تنفيذ المهام');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        type: 'assistant',
        content: `❌ خطأ في تنفيذ المهام: ${error.message}`,
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
    'كيف تعمل؟'
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
            <h3 className="font-bold text-gray-800">مساعد Flutter الذكي</h3>
            <p className="text-sm text-gray-600">نظام إدارة المهام المتقدم</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm bg-white"
          >
            <option>GPT-4 Turbo</option>
            <option>Claude 3.5</option>
            <option>Gemini Pro</option>
          </select>
        </div>
      </div>

      {/* Project Status */}
      {currentProject && (
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">{currentProject.name}</h4>
              <p className="text-sm opacity-90">التقدم: {currentProject.progress.toFixed(1)}%</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={executeNextTask}
                disabled={isExecutingTasks || currentProject.progress >= 100}
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 disabled:opacity-50"
              >
                {isExecutingTasks ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                مهمة واحدة
              </button>
              <button
                onClick={executeAllTasks}
                disabled={isExecutingTasks || currentProject.progress >= 100}
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 disabled:opacity-50"
              >
                {isExecutingTasks ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                تنفيذ الكل
              </button>
            </div>
          </div>
          <div className="mt-2 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${currentProject.progress}%` }}
            />
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
              
              {/* Project Info */}
              {message.project && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <List className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">تفاصيل المشروع</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p><strong>الاسم:</strong> {message.project.name}</p>
                    <p><strong>النوع:</strong> {message.project.project_type}</p>
                    <p><strong>عدد المهام:</strong> {message.project.tasks.length}</p>
                  </div>
                </div>
              )}
              
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
                <span className="text-sm text-gray-600">جاري التفكير والتحليل...</span>
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

