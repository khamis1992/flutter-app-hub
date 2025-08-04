import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Play, Pause, RotateCcw, AlertCircle, TrendingUp, Target } from 'lucide-react';

const TaskProgressPanel = ({ currentProject, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);

  useEffect(() => {
    if (currentProject) {
      setTasks(currentProject.tasks || []);
    }
  }, [currentProject]);

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTaskStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'in_progress':
        return 'قيد التنفيذ';
      case 'pending':
        return 'في الانتظار';
      case 'failed':
        return 'فشلت';
      default:
        return 'غير محددة';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const calculateProgress = () => {
    if (!tasks.length) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return (completedTasks / tasks.length) * 100;
  };

  const getNextTask = () => {
    return tasks.find(task => task.status === 'pending');
  };

  const addToExecutionLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('ar-SA');
    setExecutionLog(prev => [...prev, { message, timestamp }]);
  };

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">لا يوجد مشروع نشط</h3>
          <p className="text-gray-500">ابدأ محادثة جديدة لإنشاء مشروع</p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const nextTask = getNextTask();
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">{currentProject.name}</h3>
            <p className="text-sm opacity-90">{currentProject.project_type}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
            <div className="text-sm opacity-90">مكتمل</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 mb-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Stats */}
        <div className="flex justify-between text-sm">
          <span>{completedTasks} من {totalTasks} مهمة</span>
          <span>المهمة التالية: {nextTask ? nextTask.title : 'مكتمل'}</span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            قائمة المهام
          </h4>
          
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div 
                key={task.id || index}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  task.status === 'in_progress' ? 'ring-2 ring-blue-300' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTaskStatusIcon(task.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-gray-900 truncate">
                        {task.title}
                      </h5>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getTaskStatusColor(task.status)}`}>
                        {getTaskStatusText(task.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimated_time} دقيقة
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </div>
                      </div>
                      
                      {task.completed_at && (
                        <span className="text-xs text-green-600">
                          تم في {new Date(task.completed_at).toLocaleTimeString('ar-SA')}
                        </span>
                      )}
                    </div>
                    
                    {task.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {task.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Log */}
      {executionLog.length > 0 && (
        <div className="border-t bg-gray-50">
          <div className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              سجل التنفيذ
            </h4>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {executionLog.slice(-5).map((log, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{log.message}</span>
                  <span className="text-gray-500 text-xs">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          {nextTask && (
            <button
              onClick={() => onTaskUpdate && onTaskUpdate('execute-next')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Play className="w-4 h-4" />
              تنفيذ المهمة التالية
            </button>
          )}
          
          {tasks.some(task => task.status === 'pending') && (
            <button
              onClick={() => onTaskUpdate && onTaskUpdate('execute-all')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              تنفيذ جميع المهام
            </button>
          )}
        </div>
        
        {progress >= 100 && (
          <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg text-center">
            🎉 تم إنجاز المشروع بنجاح!
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskProgressPanel;

