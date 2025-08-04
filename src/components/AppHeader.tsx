import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Smartphone, Settings, Share, Play, Code2, Zap, Activity } from "lucide-react";

const AppHeader = () => {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-16 bg-background border-b neon-border flex items-center justify-between px-6 matrix-bg"
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center gap-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-neon"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Smartphone className="w-5 h-5 text-primary-foreground" />
        </motion.div>
        <div>
          <motion.h1 
            className="text-xl font-bold neon-text hologram-text"
            animate={{ textShadow: ["0 0 5px #00ffff", "0 0 20px #00ffff", "0 0 5px #00ffff"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            FlutterHub
          </motion.h1>
          <div className="text-xs text-muted-foreground">Cyberpunk Edition</div>
        </div>
      </motion.div>

      {/* Center - Project Name */}
      <motion.div 
        className="flex-1 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.div 
          className="inline-flex items-center gap-3 cyber-card px-4 py-2 rounded-lg shadow-glow"
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(var(--primary) / 0.4)" }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Code2 className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">مشروع تطبيق جديد</span>
          <Activity className="w-4 h-4 text-secondary animate-pulse" />
        </motion.div>
      </motion.div>

      {/* Actions */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="cyber-button text-primary hover:text-primary-foreground">
            <Play className="w-4 h-4 ml-1" />
            تشغيل
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="cyber-button text-secondary hover:text-secondary-foreground">
            <Share className="w-4 h-4 ml-1" />
            مشاركة
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button className="cyber-button w-10 h-10 p-0">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Settings className="w-4 h-4 text-accent" />
            </motion.div>
          </Button>
        </motion.div>
        <motion.div 
          className="w-2 h-2 bg-secondary rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.header>
  );
};

export default AppHeader;