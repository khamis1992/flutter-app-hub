import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  ExternalLink, 
  Code,
  Eye,
  Download,
  FileText,
  Folder
} from "lucide-react";

interface PreviewPanelProps {
  project?: any;
}

const PreviewPanel = ({ project }: PreviewPanelProps) => {
  const [selectedDevice, setSelectedDevice] = useState("mobile");
  const [selectedFile, setSelectedFile] = useState("lib/main.dart");

  const devices = [
    { id: "mobile", icon: Smartphone, label: "موبايل", width: "w-80", height: "h-[600px]" },
    { id: "tablet", icon: Monitor, label: "تابلت", width: "w-96", height: "h-[500px]" },
    { id: "desktop", icon: Monitor, label: "سطح المكتب", width: "w-full", height: "h-[600px]" }
  ];

  const selectedDeviceConfig = devices.find(d => d.id === selectedDevice);

  const downloadProject = () => {
    if (!project) return;
    
    // Create a zip-like structure for download
    const projectData = {
      name: project.name,
      files: project.files,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${project.name || 'flutter_project'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm">
      {/* Preview Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {project ? `معاينة: ${project.name}` : "معاينة المشروع"}
          </h2>
          
          {project && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadProject}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                تحميل المشروع
              </Button>
              <div className="text-sm text-muted-foreground">
                جودة: {project.quality_score}/100
              </div>
            </div>
          )}
        </div>
        
        {project && (
          <div className="mt-2 text-sm text-muted-foreground">
            {project.description} • {Object.keys(project.files || {}).length} ملف
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {!project ? (
          // Empty State
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">لا يوجد مشروع للمعاينة</h3>
              <p className="text-sm">ابدأ بكتابة وصف التطبيق في لوحة المحادثة لتوليد مشروع Flutter</p>
            </div>
          </div>
        ) : (
          // Project Content
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-3 mt-3">
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-4 h-4" />
                معاينة
              </TabsTrigger>
              <TabsTrigger value="files" className="gap-2">
                <Folder className="w-4 h-4" />
                الملفات
              </TabsTrigger>
              <TabsTrigger value="info" className="gap-2">
                <FileText className="w-4 h-4" />
                معلومات
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="flex-1 p-3">
              {/* Device Selector */}
              <div className="flex items-center gap-2 mb-4">
                {devices.map((device) => {
                  const Icon = device.icon;
                  return (
                    <Button
                      key={device.id}
                      variant={selectedDevice === device.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedDevice(device.id)}
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {device.label}
                    </Button>
                  );
                })}
              </div>
              
              {/* Device Preview */}
              <div className="flex justify-center">
                <Card className={`${selectedDeviceConfig?.width} ${selectedDeviceConfig?.height} bg-white border-2 border-border shadow-lg overflow-hidden`}>
                  <div className="h-full flex flex-col">
                    {/* App Bar */}
                    <div className="bg-blue-600 text-white p-3 text-center font-medium">
                      {project.name || "Flutter App"}
                    </div>
                    
                    {/* App Content Preview */}
                    <div className="flex-1 p-4 bg-gray-50">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h2 className="text-xl font-bold text-gray-800 mb-2">
                            مرحباً بك في {project.name}
                          </h2>
                          <p className="text-gray-600 text-sm">
                            {project.description}
                          </p>
                        </div>
                        
                        {/* Sample UI Elements */}
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg shadow-sm border">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm border">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <div className="text-center pt-4">
                          <div className="bg-blue-600 text-white py-2 px-4 rounded-lg inline-block text-sm">
                            ابدأ الاستخدام
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="flex-1 p-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                {/* File List */}
                <Card className="p-3">
                  <h3 className="font-medium mb-3">ملفات المشروع</h3>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {Object.keys(project.files || {}).map((fileName) => (
                        <Button
                          key={fileName}
                          variant={selectedFile === fileName ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => setSelectedFile(fileName)}
                        >
                          <FileText className="w-3 h-3 mr-2" />
                          {fileName}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
                
                {/* File Content */}
                <Card className="p-3">
                  <h3 className="font-medium mb-3">{selectedFile}</h3>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                      <code>{project.files?.[selectedFile] || "// اختر ملف لعرض محتواه"}</code>
                    </pre>
                  </ScrollArea>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="flex-1 p-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Project Info */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">معلومات المشروع</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">الاسم:</span>
                      <span className="ml-2">{project.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">الوصف:</span>
                      <span className="ml-2">{project.description}</span>
                    </div>
                    <div>
                      <span className="font-medium">نقاط الجودة:</span>
                      <span className="ml-2">{project.quality_score}/100</span>
                    </div>
                    <div>
                      <span className="font-medium">عدد الملفات:</span>
                      <span className="ml-2">{Object.keys(project.files || {}).length}</span>
                    </div>
                  </div>
                </Card>
                
                {/* Architecture & Patterns */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">البنية والأنماط</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">البنية المعمارية:</span>
                      <span className="ml-2">{project.architecture || "Clean Architecture"}</span>
                    </div>
                    <div>
                      <span className="font-medium">الأنماط المطبقة:</span>
                      <div className="mt-1">
                        {(project.patterns || ["MVVM", "Repository", "Dependency Injection"]).map((pattern: string, index: number) => (
                          <span key={index} className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs mr-1 mb-1">
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">التبعيات:</span>
                      <div className="mt-1">
                        {(project.dependencies || ["provider", "get_it", "freezed", "dio"]).map((dep: string, index: number) => (
                          <span key={index} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs mr-1 mb-1">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;

