
import React, { useState, useEffect, useRef } from 'react';
import { services, Service } from '@/data/services';
import ServiceItem from './ServiceItem';
import { cn } from '@/lib/utils';

interface Quantities {
  [key: number]: number;
}

// Interface for Bitrix integration
interface BitrixIntegrationProps {
  onCalculationComplete?: (data: {
    totalAmount: number;
    selectedServices: Array<{id: number; name: string; quantity: number; price: number; total: number}>
  }) => void;
  currency?: string;
  serviceData?: Service[];
}

const ServiceCalculator: React.FC<BitrixIntegrationProps> = ({ 
  onCalculationComplete,
  currency = "BYN",
  serviceData
}) => {
  // Use external service data if provided (for Bitrix CMS integration)
  const calculatorServices = serviceData || services;
  
  const [quantities, setQuantities] = useState<Quantities>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [showTotalAnimation, setShowTotalAnimation] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const prevTotalRef = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Calculate total amount when quantities change
  useEffect(() => {
    let newTotal = 0;
    const selectedServices: Array<{id: number; name: string; quantity: number; price: number; total: number}> = [];
    
    Object.entries(quantities).forEach(([id, quantity]) => {
      const service = calculatorServices.find(s => s.id === parseInt(id));
      if (service && quantity > 0) {
        const serviceTotal = service.price * quantity;
        newTotal += serviceTotal;
        
        selectedServices.push({
          id: service.id,
          name: service.name,
          quantity: quantity,
          price: service.price,
          total: serviceTotal
        });
      }
    });

    // Animate total only if it's not the initial render
    if (!isInitialLoad && prevTotalRef.current !== newTotal) {
      setShowTotalAnimation(true);
      const timer = setTimeout(() => setShowTotalAnimation(false), 300);
      return () => clearTimeout(timer);
    }

    setTotalAmount(newTotal);
    prevTotalRef.current = newTotal;
    
    // Call Bitrix callback if provided
    if (onCalculationComplete) {
      onCalculationComplete({
        totalAmount: newTotal,
        selectedServices
      });
    }
    
    // For Bitrix form integration - update hidden fields if they exist
    if (typeof window !== 'undefined') {
      const totalField = document.getElementById('bitrix_total_amount') as HTMLInputElement;
      if (totalField) {
        totalField.value = newTotal.toString();
      }
      
      const servicesField = document.getElementById('bitrix_selected_services') as HTMLInputElement;
      if (servicesField) {
        servicesField.value = JSON.stringify(selectedServices);
      }
    }
    
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [quantities, isInitialLoad, calculatorServices, onCalculationComplete]);

  const handleQuantityChange = (id: number, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: quantity
    }));
  };

  const getServicesByCategory = () => {
    const installationServices = calculatorServices.filter(s => 
      s.name.toLowerCase().includes('монтаж') || 
      s.name.toLowerCase().includes('установка')
    );
    
    const maintenanceServices = calculatorServices.filter(s => 
      s.name.toLowerCase().includes('обслуживание') || 
      s.name.toLowerCase().includes('выезд')
    );
    
    const constructionServices = calculatorServices.filter(s => 
      s.name.toLowerCase().includes('штробление') || 
      s.name.toLowerCase().includes('бурение') || 
      s.name.toLowerCase().includes('трасса') || 
      s.name.toLowerCase().includes('кабеля') || 
      s.name.toLowerCase().includes('короб')
    );
    
    const otherServices = calculatorServices.filter(s => 
      !installationServices.includes(s) && 
      !maintenanceServices.includes(s) && 
      !constructionServices.includes(s)
    );
    
    return {
      installationServices,
      maintenanceServices,
      constructionServices,
      otherServices
    };
  };

  const { 
    installationServices, 
    maintenanceServices, 
    constructionServices, 
    otherServices 
  } = getServicesByCategory();

  const renderServiceCategory = (
    categoryServices: Service[], 
    title: string, 
    description: string
  ) => (
    <div className="mb-4">
      <div className="px-6 pt-4 pb-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="divide-y divide-border/40">
        {categoryServices.map(service => (
          <ServiceItem
            key={service.id}
            service={service}
            quantity={quantities[service.id] || 0}
            onChange={handleQuantityChange}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-BY');
  };

  const hasSelectedServices = Object.values(quantities).some(q => q > 0);

  return (
    <div className="calculator-container p-4 sm:p-6 animate-fade-in bitrix-calculator">
      {/* Hidden fields for Bitrix form integration */}
      <div className="bitrix-data-container">
        <input type="hidden" id="bitrix_total_amount" name="TOTAL_AMOUNT" value={totalAmount.toString()} />
        <input type="hidden" id="bitrix_selected_services" name="SELECTED_SERVICES" value="" />
      </div>
      
      <div className="calculator-content animate-scale-in">
        <div 
          ref={headerRef}
          className="sticky top-0 z-10 bg-gradient-to-b from-white via-white to-white/80 backdrop-blur-sm pt-6 pb-4 px-6 rounded-t-md"
        >
          <div className="inline-block bg-primary/10 text-primary rounded-md px-3 py-1 text-xs font-medium mb-2">
            Калькулятор услуг
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Расчет стоимости установки кондиционеров
          </h1>
          <p className="text-muted-foreground mt-2">
            Выберите необходимые услуги и их количество для расчета
          </p>
        </div>

        <div 
          ref={listRef}
          className="overflow-y-auto pt-2 pb-20"
          style={{ maxHeight: 'calc(100vh - 250px)' }}
        >
          {renderServiceCategory(
            installationServices,
            "Монтаж и установка",
            "Базовые услуги по монтажу и установке кондиционеров и комплектующих"
          )}
          
          {renderServiceCategory(
            maintenanceServices,
            "Обслуживание и консультации",
            "Услуги по обслуживанию и консультации специалистов"
          )}
          
          {renderServiceCategory(
            constructionServices,
            "Строительные работы",
            "Прокладка трасс, штробление, монтаж коробов"
          )}
          
          {renderServiceCategory(
            otherServices,
            "Дополнительные услуги",
            "Альпинистские и другие специализированные работы"
          )}
        </div>

        <div className={cn(
          "total-section transition-all duration-300",
          hasSelectedServices ? "py-5" : "py-4"
        )}>
          <div className="px-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Итоговая стоимость</div>
                <div className={cn(
                  "text-2xl font-bold transition-all duration-300",
                  showTotalAnimation && "text-primary",
                  hasSelectedServices ? "text-3xl" : "text-2xl"
                )}>
                  {formatPrice(totalAmount)} {currency}
                </div>
              </div>
              
              {hasSelectedServices && (
                <div className="p-3 bg-primary/10 rounded-md text-primary text-sm font-medium animate-fade-in">
                  {Object.values(quantities).filter(q => q > 0).length} {' '}
                  {Object.values(quantities).filter(q => q > 0).length === 1 
                    ? 'услуга' 
                    : Object.values(quantities).filter(q => q > 0).length < 5 
                      ? 'услуги' 
                      : 'услуг'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCalculator;
