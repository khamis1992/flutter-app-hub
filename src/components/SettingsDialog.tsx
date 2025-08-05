import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Key } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store API key in localStorage for now
      // In production, this should be stored securely using Supabase Edge Function Secrets
      localStorage.setItem("llm_api_key", apiKey);
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ API key بنجاح",
      });
      
      onOpenChange(false);
      setApiKey("");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            إعدادات API
          </DialogTitle>
          <DialogDescription>
            قم بإدخال API key الخاص بـ LLM لاستخدام النموذج اللغوي
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">LLM API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="أدخل API key هنا..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
                dir="ltr"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              سيتم حفظ المفتاح محلياً على جهازك
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSaveApiKey} disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;