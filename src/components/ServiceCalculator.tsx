
import React, { useState, useEffect, useRef } from 'react';
import { services, Service } from '@/data/services';
import ServiceItem from './ServiceItem';
import { cn } from '@/lib/utils';

interface Quantities {
  [key: number]: number;
}

const ServiceCalculator: React.FC = () => {
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
    Object.entries(quantities).forEach(([id, quantity]) => {
      const service = services.find(s => s.id === parseInt(id));
      if (service && quantity > 0) {
        newTotal += service.price * quantity;
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
    
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [quantities, isInitialLoad]);

  const handleQuantityChange = (id: number, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: quantity
    }));
  };

  const getServicesByCategory = () => {
    const installationServices = services.filter(s => 
      s.name.toLowerCase().includes('монтаж') || 
      s.name.toLowerCase().includes('установка')
    );
    
    const maintenanceServices = services.filter(s => 
      s.name.toLowerCase().includes('обслуживание') || 
      s.name.toLowerCase().includes('выезд')
    );
    
    const constructionServices = services.filter(s => 
      s.name.toLowerCase().includes('штробление') || 
      s.name.toLowerCase().includes('бурение') || 
      s.name.toLowerCase().includes('трасса') || 
      s.name.toLowerCase().includes('кабеля') || 
      s.name.toLowerCase().includes('короб')
    );
    
    const otherServices = services.filter(s => 
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
          />
        ))}
      </div>
    </div>
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  const hasSelectedServices = Object.values(quantities).some(q => q > 0);

  return (
    <div className="calculator-container p-4 sm:p-6 animate-fade-in">
      <div className="calculator-content animate-scale-in">
        <div 
          ref={headerRef}
          className="sticky top-0 z-10 bg-gradient-to-b from-white via-white to-white/80 backdrop-blur-sm pt-6 pb-4 px-6 rounded-t-[1.5rem]"
        >
          <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium mb-2">
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
                  {formatPrice(totalAmount)} ₽
                </div>
              </div>
              
              {hasSelectedServices && (
                <div className="p-3 bg-primary/10 rounded-lg text-primary text-sm font-medium animate-fade-in">
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
