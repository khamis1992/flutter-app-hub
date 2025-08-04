import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, Zap, Code, Palette, Smartphone } from "lucide-react";
import { useState } from "react";

const ModernChatPanel = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-10 animate-pulse" />
      
      {/* Floating orbs */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-slate-700/50"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-cosmic rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">FlutterGPT</h2>
              <p className="text-slate-400">مساعد ذكي متطور</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 bg-gradient-cosmic rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <Card className="flex-1 p-4 bg-slate-800/80 border-slate-700 backdrop-blur-sm">
              <p className="text-slate-200">مرحباً! أنا FlutterGPT، مساعدك الذكي لتطوير تطبيقات Flutter احترافية. ماذا تريد أن نبني اليوم؟</p>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Smartphone, text: "تطبيق موبايل", color: "from-purple-500 to-pink-500" },
              { icon: Code, text: "كود متقدم", color: "from-blue-500 to-cyan-500" },
              { icon: Palette, text: "تصميم UI", color: "from-emerald-500 to-teal-500" },
              { icon: Zap, text: "API تفاعلي", color: "from-orange-500 to-red-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="w-full h-auto p-4 bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50">
                  <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-3`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-200">{item.text}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-t border-slate-700/50"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                placeholder="اكتب هنا... مثال: أريد تطبيق تسوق مع انيميشن"
                className="bg-slate-800/80 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-purple-500"
                rows={3}
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="h-[84px] px-6 bg-gradient-cosmic hover:shadow-neon">
                <Send className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernChatPanel;