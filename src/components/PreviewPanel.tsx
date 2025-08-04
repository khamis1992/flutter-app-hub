import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  ExternalLink, 
  Code,
  Eye,
  Maximize2,
  Download,
  Share2,
  Settings2
} from "lucide-react";

const PreviewPanel = () => {
  const [selectedDevice, setSelectedDevice] = useState("mobile");
  const [viewMode, setViewMode] = useState("preview"); // preview or code

  const devices = [
    { id: "mobile", icon: Smartphone, label: "iPhone 15", width: "w-80", height: "h-[650px]", scale: "scale-90" },
    { id: "tablet", icon: Tablet, label: "iPad Pro", width: "w-[500px]", height: "h-[650px]", scale: "scale-75" },
    { id: "desktop", icon: Monitor, label: "سطح المكتب", width: "w-full", height: "h-[650px]", scale: "scale-100" }
  ];

  const selectedDeviceConfig = devices.find(d => d.id === selectedDevice);

  return (
    <div className="h-full flex flex-col bg-gradient-mesh relative">
      {/* Preview Header */}
      <div className="bg-glass-bg backdrop-blur-glass border-b border-glass-border p-4">
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
                  className="gap-2 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{device.label}</span>
                </Button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={viewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="h-8"
            >
              <Eye className="w-4 h-4 ml-1" />
              معاينة
            </Button>
            <Button
              variant={viewMode === "code" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("code")}
              className="h-8"
            >
              <Code className="w-4 h-4 ml-1" />
              الكود
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              تحميل
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              مشاركة
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Maximize2 className="w-4 h-4" />
              ملء الشاشة
            </Button>
            <Button variant="ghost" size="icon">
              <Settings2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-8 flex items-center justify-center">
        {viewMode === "preview" ? (
          <div className={`${selectedDeviceConfig?.width} ${selectedDeviceConfig?.height} ${selectedDeviceConfig?.scale} transition-all duration-500`}>
            <Card className="w-full h-full bg-background shadow-2xl overflow-hidden relative">
              {/* Phone Frame for Mobile */}
              {selectedDevice === "mobile" && (
                <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 p-4 rounded-[2.5rem] shadow-2xl">
                  {/* Camera notch */}
                  <div className="w-32 h-6 bg-black rounded-full mx-auto mb-2 relative">
                    <div className="absolute top-1 left-4 w-4 h-4 bg-slate-800 rounded-full"></div>
                    <div className="absolute top-2 right-6 w-2 h-2 bg-slate-700 rounded-full"></div>
                  </div>
                  
                  <div className="w-full h-[calc(100%-2rem)] bg-white rounded-2xl overflow-hidden shadow-inner">
                    {/* Mock App Content */}
                    <div className="h-full flex flex-col">
                      {/* Status Bar */}
                      <div className="h-10 bg-primary flex items-center justify-between px-6 text-primary-foreground text-sm font-medium">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="w-1 h-3 bg-primary-foreground rounded-full"></div>
                            ))}
                          </div>
                          <span className="text-xs ml-2">100%</span>
                        </div>
                      </div>
                      
                      {/* App Header */}
                      <div className="bg-gradient-primary text-primary-foreground p-6 shadow-large">
                        <h1 className="text-xl font-bold text-center mb-2">متجر إلكتروني</h1>
                        <div className="bg-primary-foreground/20 rounded-full px-4 py-2 backdrop-blur-sm">
                          <input 
                            type="text" 
                            placeholder="ابحث عن منتج..." 
                            className="w-full bg-transparent text-center text-primary-foreground placeholder:text-primary-foreground/70 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                        {/* Categories */}
                        <div className="flex gap-3">
                          {['إلكترونيات', 'ملابس', 'منزل', 'رياضة'].map((category, i) => (
                            <div key={i} className="flex-1 bg-gradient-card rounded-xl p-3 text-center shadow-soft">
                              <div className="w-8 h-8 bg-gradient-primary rounded-lg mx-auto mb-2"></div>
                              <span className="text-xs font-medium">{category}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Banner */}
                        <div className="bg-gradient-hero rounded-xl h-24 flex items-center justify-center shadow-large">
                          <span className="text-primary-foreground font-bold">خصم 50% على جميع المنتجات</span>
                        </div>
                        
                        {/* Products Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((item) => (
                            <Card key={item} className="p-3 shadow-medium hover:shadow-large transition-all duration-300 border-0">
                              <div className="bg-gradient-card rounded-lg h-20 mb-3 flex items-center justify-center">
                                <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                              </div>
                              <div className="text-sm font-semibold mb-1">منتج {item}</div>
                              <div className="text-xs text-muted-foreground mb-2">وصف المنتج</div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-primary">100 ريال</span>
                                <div className="w-6 h-6 bg-gradient-primary rounded-full"></div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bottom Navigation */}
                      <div className="h-16 bg-background border-t border-border flex items-center justify-around shadow-large">
                        {[
                          { name: 'الرئيسية', active: true },
                          { name: 'البحث', active: false },
                          { name: 'السلة', active: false },
                          { name: 'الملف', active: false }
                        ].map((tab, i) => (
                          <div key={i} className="text-center flex-1">
                            <div className={`w-6 h-6 rounded-lg mx-auto mb-1 ${
                              tab.active ? 'bg-gradient-primary' : 'bg-muted'
                            }`}></div>
                            <span className={`text-xs ${
                              tab.active ? 'text-primary font-semibold' : 'text-muted-foreground'
                            }`}>{tab.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tablet/Desktop View */}
              {selectedDevice !== "mobile" && (
                <div className="w-full h-full bg-background">
                  <div className="h-full flex flex-col">
                    <div className="bg-gradient-primary text-primary-foreground p-8 shadow-large">
                      <h1 className="text-3xl font-bold text-center mb-4">متجر إلكتروني</h1>
                      <div className="max-w-md mx-auto bg-primary-foreground/20 rounded-xl px-6 py-3 backdrop-blur-sm">
                        <input 
                          type="text" 
                          placeholder="ابحث عن أي منتج..." 
                          className="w-full bg-transparent text-center text-primary-foreground placeholder:text-primary-foreground/70 focus:outline-none text-lg"
                        />
                      </div>
                    </div>
                    <div className="flex-1 p-8 bg-gradient-mesh">
                      <div className="text-center text-muted-foreground">
                        <div className="w-20 h-20 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          {selectedDeviceConfig && (
                            <selectedDeviceConfig.icon className="w-10 h-10 text-primary-foreground" />
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">معاينة {selectedDeviceConfig?.label}</h3>
                        <p>التطبيق محسن لهذا الجهاز</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          // Code View
          <Card className="w-full h-full bg-slate-950 text-green-400 overflow-hidden border-0 shadow-2xl">
            <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-slate-400 text-sm">main.dart</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Code className="w-4 h-4 ml-1" />
                  تنسيق الكود
                </Button>
              </div>
            </div>
            
            <div className="p-6 font-mono text-sm overflow-auto h-[calc(100%-3rem)] bg-gradient-to-br from-slate-950 to-slate-900">
              <pre className="whitespace-pre-wrap leading-relaxed">
{`import 'package:flutter/material.dart';

void main() {
  runApp(ShoppingApp());
}

class ShoppingApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'متجر إلكتروني',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        fontFamily: 'Cairo',
        useMaterial3: true,
      ),
      home: HomePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          'متجر إلكتروني',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.indigo, Colors.purple],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Icon(Icons.search, color: Colors.grey),
                  SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'ابحث عن منتج...',
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 24),
            
            // Categories Section
            Text(
              'الفئات',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            
            SizedBox(height: 16),
            
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  CategoryCard('إلكترونيات', Icons.phone_android),
                  CategoryCard('ملابس', Icons.checkroom),
                  CategoryCard('منزل', Icons.home),
                  CategoryCard('رياضة', Icons.sports_soccer),
                ],
              ),
            ),
            
            SizedBox(height: 24),
            
            // Banner
            Container(
              height: 120,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.orange, Colors.red],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  'خصم 50% على جميع المنتجات',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            
            SizedBox(height: 24),
            
            // Products Grid
            Text(
              'المنتجات الشائعة',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            
            SizedBox(height: 16),
            
            GridView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.8,
              ),
              itemCount: 6,
              itemBuilder: (context, index) {
                return ProductCard(
                  title: 'منتج \${index + 1}',
                  price: '\${(index + 1) * 50} ريال',
                  image: 'assets/product_\${index + 1}.jpg',
                );
              },
            ),
          ],
        ),
      ),
      
      // Bottom Navigation
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.indigo,
        unselectedItemColor: Colors.grey,
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
            label: 'الملف الشخصي',
          ),
        ],
      ),
    );
  }
}

// Additional Widget Classes...
class CategoryCard extends StatelessWidget {
  final String title;
  final IconData icon;
  
  CategoryCard(this.title, this.icon);
  
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(right: 12),
      padding: EdgeInsets.all(16),
      width: 100,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.indigo, Colors.purple],
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}`}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;