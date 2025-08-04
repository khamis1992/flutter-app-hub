import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  ExternalLink, 
  Code,
  Eye
} from "lucide-react";

const PreviewPanel = () => {
  const [selectedDevice, setSelectedDevice] = useState("mobile");
  const [viewMode, setViewMode] = useState("preview"); // preview or code

  const devices = [
    { id: "mobile", icon: Smartphone, label: "موبايل", width: "w-80", height: "h-[600px]" },
    { id: "desktop", icon: Monitor, label: "سطح المكتب", width: "w-full", height: "h-[600px]" }
  ];

  const selectedDeviceConfig = devices.find(d => d.id === selectedDevice);

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Preview Header */}
      <div className="bg-background border-b border-border p-3">
        <div className="flex items-center justify-between">
          {/* Device Selector */}
          <div className="flex items-center gap-2">
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
            >
              <Eye className="w-4 h-4 ml-1" />
              معاينة
            </Button>
            <Button
              variant={viewMode === "code" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("code")}
            >
              <Code className="w-4 h-4 ml-1" />
              الكود
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <RotateCcw className="w-4 h-4 ml-1" />
              إعادة تحميل
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4 ml-1" />
              فتح في نافذة جديدة
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 flex items-center justify-center">
        {viewMode === "preview" ? (
          <Card className={`${selectedDeviceConfig?.width} ${selectedDeviceConfig?.height} bg-background shadow-2xl overflow-hidden`}>
            {/* Phone Frame for Mobile */}
            {selectedDevice === "mobile" && (
              <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 p-4 rounded-3xl">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                  {/* Mock App Content */}
                  <div className="h-full flex flex-col">
                    {/* Status Bar */}
                    <div className="h-8 bg-primary flex items-center justify-between px-4 text-primary-foreground text-xs">
                      <span>9:41</span>
                      <span>●●●●● 100%</span>
                    </div>
                    
                    {/* App Header */}
                    <div className="bg-primary text-primary-foreground p-4">
                      <h1 className="text-lg font-bold text-center">متجر إلكتروني</h1>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4 space-y-4">
                      <div className="bg-muted rounded-lg h-32 flex items-center justify-center">
                        <span className="text-muted-foreground">بانر رئيسي</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((item) => (
                          <Card key={item} className="p-3">
                            <div className="bg-muted rounded h-16 mb-2"></div>
                            <div className="text-xs font-medium">منتج {item}</div>
                            <div className="text-xs text-muted-foreground">100 ريال</div>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    {/* Bottom Navigation */}
                    <div className="h-16 bg-background border-t border-border flex items-center justify-around">
                      <div className="text-center">
                        <div className="w-6 h-6 bg-primary rounded mx-auto mb-1"></div>
                        <span className="text-xs">الرئيسية</span>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 bg-muted rounded mx-auto mb-1"></div>
                        <span className="text-xs">البحث</span>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 bg-muted rounded mx-auto mb-1"></div>
                        <span className="text-xs">السلة</span>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 bg-muted rounded mx-auto mb-1"></div>
                        <span className="text-xs">الملف</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tablet/Desktop View */}
            {selectedDevice !== "mobile" && (
              <div className="w-full h-full bg-white">
                <div className="h-full flex flex-col">
                  <div className="bg-primary text-primary-foreground p-6">
                    <h1 className="text-2xl font-bold text-center">متجر إلكتروني</h1>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="text-center text-muted-foreground">
                      معاينة {selectedDeviceConfig?.label}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ) : (
          // Code View
          <Card className="w-full h-full bg-slate-900 text-green-400 p-4 font-mono text-sm overflow-auto">
            <pre className="whitespace-pre-wrap">
{`import 'package:flutter/material.dart';

class ShoppingApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'متجر إلكتروني',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Cairo',
      ),
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('متجر إلكتروني'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // بانر رئيسي
            Container(
              height: 150,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text('بانر رئيسي'),
              ),
            ),
            SizedBox(height: 20),
            
            // شبكة المنتجات
            GridView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: 4,
              itemBuilder: (context, index) {
                return ProductCard(productId: index + 1);
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'الرئيسية',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'البحث',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'السلة',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'الملف',
          ),
        ],
      ),
    );
  }
}`}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;