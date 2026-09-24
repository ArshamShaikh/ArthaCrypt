import React from 'react';
import { TabType } from '../types';
import { 
  Shield, 
  Cpu, 
  BarChart3, 
  Unlock, 
  SlidersHorizontal, 
  BookOpen, 
  Award, 
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'classical', label: 'Classical Lab', icon: <Shield className="w-4 h-4" /> },
    { id: 'modern', label: 'Modern AES Lab', icon: <Cpu className="w-4 h-4" /> },
    { id: 'frequency', label: 'Frequency Attack', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'bruteforce', label: 'Brute Force Demo', icon: <Unlock className="w-4 h-4" /> },
    { id: 'comparison', label: 'Security Matrix', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning Center', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('classical')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md shadow-amber-900/30 border border-amber-500/30">
              <Shield className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-iks text-lg font-bold tracking-wider text-amber-200">ArthaCrypt</span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Classical Ciphers & Modern Cryptography Suite
              </p>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="hidden lg:flex items-center space-x-2 bg-stone-900/80 border border-stone-800 px-3 py-1.5 rounded-full text-xs text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Crypto Lab</span>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('learning')}
              className="text-xs px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 border bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Guide</span>
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-stone-900">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
