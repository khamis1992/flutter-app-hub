import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor, Eye, Code, Download } from "lucide-react";

const PreviewPanel = () => {
  const [selectedDevice, setSelectedDevice] = useState("mobile");
  const [viewMode, setViewMode] = useState("preview");
  const [generatedCode, setGeneratedCode] = useState(`import 'package:flutter/material.dart';

class ECommerceApp extends StatelessWidget {
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

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<Product> products = [
    Product(
      id: '1',
      name: 'هاتف ذكي',
      price: 1200.0,
      image: 'assets/phone.jpg',
      description: 'هاتف ذكي متطور مع كاميرا عالية الجودة'
    ),
    Product(
      id: '2', 
      name: 'لابتوب',
      price: 2500.0,
      image: 'assets/laptop.jpg',
      description: 'لابتوب قوي للعمل والألعاب'
    ),
    Product(
      id: '3',
      name: 'ساعة ذكية', 
      price: 800.0,
      image: 'assets/watch.jpg',
      description: 'ساعة ذكية مع مراقبة الصحة'
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('متجر إلكتروني'),
        backgroundColor: Colors.blue[600],
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart),
            onPressed: () {
              // Navigate to cart
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Header Section
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.blue[600]!, Colors.blue[400]!],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'مرحباً بك في متجرنا',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'اكتشف أفضل المنتجات بأسعار مميزة',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
          
          // Products Grid
          Expanded(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.8,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: products.length,
                itemBuilder: (context, index) {
                  final product = products[index];
                  return ProductCard(product: product);
                },
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.blue[600],
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'الرئيسية',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.category),
            label: 'الفئات',
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

class ProductCard extends StatelessWidget {
  final Product product;
  
  const ProductCard({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                color: Colors.grey[200],
              ),
              child: Center(
                child: Icon(
                  Icons.image,
                  size: 50,
                  color: Colors.grey[400],
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 4),
                Text(
                  '\${product.price.toStringAsFixed(0)} ريال',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.blue[600],
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      // Add to cart logic
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue[600],
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      'إضافة للسلة',
                      style: TextStyle(fontSize: 12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class Product {
  final String id;
  final String name;
  final double price;
  final String image;
  final String description;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    required this.description,
  });
}`);
  const [appInfo, setAppInfo] = useState({
    name: "متجر إلكتروني",
    description: "تطبيق تجارة إلكترونية متكامل",
    features: ["عربة التسوق", "نظام الدفع", "إدارة المنتجات", "المصادقة"]
  });

  useEffect(() => {
    // Listen for code generation events from ChatPanel
    const handleCodeGenerated = (event) => {
      const { code, appName, description, features } = event.detail;
      setGeneratedCode(code);
      setAppInfo({
        name: appName || "تطبيق مخصص",
        description: description || "تطبيق Flutter متقدم",
        features: features || ["واجهة جميلة", "أداء محسن", "دعم عربي"]
      });
      // Switch to code view to show the generated code
      setViewMode("code");
    };

    window.addEventListener('codeGenerated', handleCodeGenerated);
    
    return () => {
      window.removeEventListener('codeGenerated', handleCodeGenerated);
    };
  }, []);

  const deviceSizes = {
    mobile: { width: "375px", height: "667px" },
    tablet: { width: "768px", height: "1024px" },
    desktop: { width: "1200px", height: "800px" }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flutter_app.dart';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    // Refresh the preview by regenerating code
    try {
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: appInfo.description })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedCode(data.code);
        setAppInfo({
          name: data.app_name,
          description: data.description,
          features: data.features
        });
      }
    } catch (error) {
      console.error('Error refreshing code:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm">
      {/* Preview Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">معاينة التطبيق</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 ml-1" />
              إعادة تحميل
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 ml-1" />
              فتح في نافذة جديدة
            </Button>
          </div>
        </div>

        {/* Device Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant={selectedDevice === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDevice("mobile")}
          >
            <Smartphone className="w-4 h-4 ml-1" />
            موبايل
          </Button>
          <Button
            variant={selectedDevice === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDevice("tablet")}
          >
            <Tablet className="w-4 h-4 ml-1" />
            تابلت
          </Button>
          <Button
            variant={selectedDevice === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDevice("desktop")}
          >
            <Monitor className="w-4 h-4 ml-1" />
            سطح المكتب
          </Button>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant={viewMode === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("preview")}
          >
            <Eye className="w-4 h-4 ml-1" />
            معاينة
          </Button>
          <Button
            variant={viewMode === "code" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("code")}
          >
            <Code className="w-4 h-4 ml-1" />
            الكود
          </Button>
          {viewMode === "code" && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 ml-1" />
              تحميل
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4">
        {viewMode === "preview" ? (
          <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg">
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden border"
              style={{
                width: deviceSizes[selectedDevice].width,
                height: deviceSizes[selectedDevice].height,
                maxWidth: "100%",
                maxHeight: "100%"
              }}
            >
              {/* Mock App Preview */}
              <div className="h-full flex flex-col">
                {/* App Header */}
                <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                  <h3 className="font-bold">متجر إلكتروني</h3>
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">🛒</span>
                  </div>
                </div>
                
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4">
                  <h4 className="font-bold text-lg">مرحباً بك في متجرنا</h4>
                  <p className="text-sm opacity-90">اكتشف أفضل المنتجات بأسعار مميزة</p>
                </div>
                
                {/* Products Grid */}
                <div className="flex-1 p-4 grid grid-cols-2 gap-4">
                  {[
                    { name: "هاتف ذكي", price: "1200 ريال" },
                    { name: "لابتوب", price: "2500 ريال" },
                    { name: "ساعة ذكية", price: "800 ريال" },
                    { name: "سماعات", price: "300 ريال" }
                  ].map((product, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-3">
                      <div className="bg-gray-200 h-20 rounded mb-2 flex items-center justify-center">
                        <span className="text-gray-400">📱</span>
                      </div>
                      <h5 className="font-medium text-sm">{product.name}</h5>
                      <p className="text-blue-600 text-xs font-bold">{product.price}</p>
                      <button className="w-full bg-blue-600 text-white text-xs py-1 rounded mt-1">
                        إضافة للسلة
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Bottom Navigation */}
                <div className="border-t bg-white p-2 flex justify-around">
                  {["🏠", "📂", "🛒", "👤"].map((icon, index) => (
                    <div key={index} className="p-2 text-center">
                      <span className="text-lg">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <ScrollArea className="h-full">
              <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto">
                <code className="language-dart">{generatedCode}</code>
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;

