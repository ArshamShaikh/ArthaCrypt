import React, { useState } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { ClassicalLab } from './components/ClassicalLab';
import { ModernLab } from './components/ModernLab';
import { FrequencySimulator } from './components/FrequencySimulator';
import { BruteForceDemo } from './components/BruteForceDemo';
import { SecurityMatrix } from './components/SecurityMatrix';
import { LearningCenter } from './components/LearningCenter';
import { QuizModule } from './components/QuizModule';
import { ReportHub } from './components/ReportHub';
import { Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('classical');
  const [sharedCiphertext, setSharedCiphertext] = useState<string>('');

  const handleSendToFrequency = (text: string) => {
    setSharedCiphertext(text);
    setActiveTab('frequency');
  };

  const handleSendToBruteForce = (text: string) => {
    setSharedCiphertext(text);
    setActiveTab('bruteforce');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased selection:bg-amber-500 selection:text-stone-950">
      {/* Top Sticky Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'classical' && (
          <ClassicalLab
            onSendToFrequency={handleSendToFrequency}
            onSendToBruteForce={handleSendToBruteForce}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'modern' && <ModernLab />}

        {activeTab === 'frequency' && (
          <FrequencySimulator
            ciphertext={sharedCiphertext}
            setCiphertext={setSharedCiphertext}
          />
        )}

        {activeTab === 'bruteforce' && (
          <BruteForceDemo initialCiphertext={sharedCiphertext} />
        )}

        {activeTab === 'comparison' && <SecurityMatrix />}

        {activeTab === 'learning' && <LearningCenter />}

        {activeTab === 'quiz' && <QuizModule />}

        {activeTab === 'report' && <ReportHub />}
      </main>

      {/* Product Footer */}
      <footer className="no-print border-t border-stone-900 bg-stone-950/80 text-stone-400 py-6 text-xs font-mono-code mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="text-stone-300 font-bold font-iks tracking-wider">ArthaCrypt</span>
            <span>• Classical to Modern Cryptographic Systems</span>
          </div>

          <div className="flex items-center space-x-4 text-stone-400">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Interactive Cryptanalysis & Security Suite</span>
            </span>
            <span>•</span>
            <span>AES-GCM & Statistical Cryptanalysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
