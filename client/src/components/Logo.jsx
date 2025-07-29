import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "w-8 h-8" }) => (
    <div className={`relative ${className}`}>
        <motion.div
            animate={{
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-primary-gradient rounded-lg blur-[2px]"
        />
        <div className="absolute inset-0 bg-primary-gradient rounded-lg flex items-center justify-center border border-white/20">
            <div className="w-1/2 h-1/2 bg-white rounded-sm opacity-90 mix-blend-overlay" />
        </div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
    </div>
);

export default Logo;
