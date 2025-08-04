import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import ChatPanel from '../components/ChatPanel';
import PreviewPanel from '../components/PreviewPanel';
import TaskProgressPanel from '../components/TaskProgressPanel';

const Index = () => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'tasks'

  const handleCodeGenerated = (code) => {
    setGeneratedCode(code);
  };

  const handleProjectUpdate = (project) => {
    setCurrentProject(project);
  };

  const handleTaskUpdate = (action) => {
    // Handle task updates from TaskProgressPanel
    console.log('Task update:', action);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Chat */}
        <div className="w-1/2 border-r border-gray-200">
          <ChatPanel 
            onCodeGenerated={handleCodeGenerated}
            onProjectUpdate={handleProjectUpdate}
          />
        </div>
        
        {/* Right Panel - Preview/Tasks */}
        <div className="w-1/2 flex flex-col">
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              معاينة الكود
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              إدارة المهام
              {currentProject && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                  {currentProject.tasks?.filter(t => t.status === 'completed').length || 0}/
                  {currentProject.tasks?.length || 0}
                </span>
              )}
            </button>
          </div>
          
          {/* Panel Content */}
          <div className="flex-1">
            {activeTab === 'preview' ? (
              <PreviewPanel generatedCode={generatedCode} />
            ) : (
              <TaskProgressPanel 
                currentProject={currentProject}
                onTaskUpdate={handleTaskUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

