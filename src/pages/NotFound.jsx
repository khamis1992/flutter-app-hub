import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground max-w-md">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

