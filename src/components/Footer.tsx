import { Smartphone, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">FlutterHub</h3>
                <p className="text-xs text-muted-foreground">منصة تطوير Flutter</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              المنصة الرائدة لتطوير تطبيقات Flutter بأدوات متقدمة ومساعد ذكي
            </p>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">المنتج</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">المميزات</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الأسعار</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">القوالب</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">الموارد</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">التوثيق</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الدعم</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">المجتمع</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">المدونة</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الوظائف</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">اتصل بنا</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FlutterHub. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a>
              <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-primary transition-colors">الأمان</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;