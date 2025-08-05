import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Key, Trash2, Bot } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ApiKeyData {
  id: string;
  provider: string;
  key: string;
  createdAt: string;
}

const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", description: "GPT-4, GPT-3.5" },
  { id: "claude", name: "Anthropic Claude", description: "Claude 3, Claude 2" },
  { id: "gemini", name: "Google Gemini", description: "Gemini Pro" },
  { id: "mistral", name: "Mistral AI", description: "Mistral Large, Medium" },
  { id: "cohere", name: "Cohere", description: "Command, Generate" },
  { id: "perplexity", name: "Perplexity", description: "Sonar Models" },
  { id: "other", name: "أخرى", description: "نماذج أخرى" },
];

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedKeys, setSavedKeys] = useState<ApiKeyData[]>([]);
  const { toast } = useToast();

  // Load saved API keys on component mount
  useEffect(() => {
    const savedApiKeys = localStorage.getItem("api_keys");
    if (savedApiKeys) {
      try {
        setSavedKeys(JSON.parse(savedApiKeys));
      } catch (error) {
        console.error("Error parsing saved API keys:", error);
      }
    }
  }, [open]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال API key",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProvider) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مقدم الخدمة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newApiKey: ApiKeyData = {
        id: Date.now().toString(),
        provider: selectedProvider,
        key: apiKey,
        createdAt: new Date().toISOString(),
      };

      const updatedKeys = [...savedKeys, newApiKey];
      localStorage.setItem("api_keys", JSON.stringify(updatedKeys));
      setSavedKeys(updatedKeys);
      
      toast({
        title: "تم الحفظ بنجاح",
        description: `تم حفظ API key لـ ${AI_PROVIDERS.find(p => p.id === selectedProvider)?.name}`,
      });
      
      setApiKey("");
      setSelectedProvider("");
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

  const handleDeleteApiKey = (id: string) => {
    const updatedKeys = savedKeys.filter(key => key.id !== id);
    localStorage.setItem("api_keys", JSON.stringify(updatedKeys));
    setSavedKeys(updatedKeys);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف API key بنجاح",
    });
  };

  const handleClearAllData = () => {
    localStorage.removeItem("api_keys");
    setSavedKeys([]);
    
    toast({
      title: "تم مسح البيانات",
      description: "تم مسح جميع المفاتيح المحفوظة",
    });
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
        
        <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
          {/* Add new API key section */}
          <div className="grid gap-4 p-4 border rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <Bot className="w-4 h-4" />
              إضافة API key جديد
            </h3>
            
            <div className="grid gap-2">
              <Label htmlFor="provider">مقدم الخدمة</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مقدم الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{provider.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {provider.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
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
            </div>

            <Button onClick={handleSaveApiKey} disabled={isLoading || !selectedProvider || !apiKey.trim()}>
              {isLoading ? "جاري الحفظ..." : "حفظ API Key"}
            </Button>
          </div>

          {/* Saved API keys section */}
          {savedKeys.length > 0 && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">المفاتيح المحفوظة</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAllData}
                  className="text-xs"
                >
                  مسح الكل
                </Button>
              </div>
              <div className="grid gap-2">
                {savedKeys.map((keyData) => {
                  const provider = AI_PROVIDERS.find(p => p.id === keyData.provider);
                  return (
                    <Card key={keyData.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bot className="w-4 h-4" />
                          <div>
                            <p className="font-medium text-sm">{provider?.name || keyData.provider}</p>
                            <p className="text-xs text-muted-foreground">
                              {keyData.key.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteApiKey(keyData.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground text-center">
            سيتم حفظ المفاتيح محلياً على جهازك
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;