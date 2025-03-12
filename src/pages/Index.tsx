
import React, { useEffect } from 'react';
import ServiceCalculator from '@/components/ServiceCalculator';

// Interface for 1C-Bitrix global object
interface BitrixGlobal {
  initialized?: boolean;
  onCalculate?: (data: any) => void;
}

// Declare global Bitrix object for TypeScript
declare global {
  interface Window {
    BX?: BitrixGlobal;
  }
}

const Index = () => {
  // Apply smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Load Bitrix scripts if needed
  useEffect(() => {
    // This function would only execute if the app is embedded in a Bitrix environment
    const loadBitrixIntegration = () => {
      if (window.BX && !window.BX.initialized) {
        console.log('Bitrix integration initialized');
        window.BX.initialized = true;
      }
    };

    // Check if we're in a Bitrix environment
    if (typeof window !== 'undefined' && window.BX) {
      loadBitrixIntegration();
    }
  }, []);

  // Handler for when calculation is complete (for Bitrix integration)
  const handleCalculationComplete = (data: any) => {
    if (window.BX && window.BX.onCalculate) {
      window.BX.onCalculate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30 pb-12">
      <header className="w-full">
        <div className="max-w-screen-lg mx-auto py-8 px-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Калькулятор услуг по установке кондиционеров
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Быстрый расчет стоимости услуг для специалистов-замерщиков
            </p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-screen-lg mx-auto">
        <ServiceCalculator onCalculationComplete={handleCalculationComplete} currency="BYN" />
      </main>

      <footer className="w-full max-w-screen-lg mx-auto mt-12 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Калькулятор услуг кондиционирования | Все цены указаны в BYN
        </p>
      </footer>
    </div>
  );
};

export default Index;
