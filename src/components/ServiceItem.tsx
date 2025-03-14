
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Service } from '@/data/services';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ServiceItemProps {
  service: Service;
  quantity: number;
  onChange: (id: number, quantity: number) => void;
  currency?: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ 
  service, 
  quantity, 
  onChange,
  currency = 'BYN'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animateTotal, setAnimateTotal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevQuantity = useRef(quantity);
  const totalPrice = service.price * quantity;
  
  // Handle quantity changes with animation
  useEffect(() => {
    if (prevQuantity.current !== quantity && quantity > 0) {
      setAnimateTotal(true);
      const timer = setTimeout(() => setAnimateTotal(false), 300);
      return () => clearTimeout(timer);
    }
    prevQuantity.current = quantity;
  }, [quantity]);

  const handleQuantityChange = (value: string) => {
    const newQuantity = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
    onChange(service.id, newQuantity);
  };

  const incrementQuantity = () => {
    onChange(service.id, quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      onChange(service.id, quantity - 1);
    }
  };
  
  // Format price according to Belarusian locale
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-BY');
  };

  return (
    <div 
      className="service-item p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-service-id={service.id} // For Bitrix integration
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="text-sm text-primary/80 font-medium mb-0.5">
            {service.unit === 'шт' ? 'Услуга' : service.unit === 'м' ? 'Метраж' : 'Высотные работы'}
          </div>
          <div className="text-md font-medium text-foreground">{service.name}</div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
          <div className="service-price whitespace-nowrap">
            {formatPrice(service.price)} {currency}/{service.unit}
          </div>
          
          <div className="flex items-center gap-4 sm:min-w-[180px] justify-end">
            <div className="input-wrapper relative">
              <input
                ref={inputRef}
                type="number"
                min="0"
                value={quantity === 0 ? '' : quantity}
                placeholder="0"
                onChange={(e) => handleQuantityChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={cn(
                  "quantity-input w-[4.5rem] text-center rounded-md",
                  isFocused && "border-primary/40 ring-2 ring-primary/20",
                  quantity > 0 && "bg-primary/5 border-primary/20"
                )}
                name={`service_quantity_${service.id}`} // For Bitrix form integration
                data-price={service.price} // For Bitrix JS integration
              />
              
              {(isHovered || isFocused) && (
                <span className="input-control">
                  <button 
                    onClick={incrementQuantity}
                    className="input-button rounded-tr-md"
                    aria-label="Увеличить"
                    type="button"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button 
                    onClick={decrementQuantity}
                    className="input-button rounded-br-md"
                    aria-label="Уменьшить"
                    type="button"
                  >
                    <ChevronDown size={12} />
                  </button>
                </span>
              )}
            </div>
            
            <div 
              className={cn(
                "service-total min-w-[4.5rem] text-right",
                animateTotal && "animate-pulse-subtle text-primary",
                quantity > 0 ? "opacity-100" : "opacity-50"
              )}
              data-total={totalPrice} // For Bitrix JS integration
            >
              {formatPrice(totalPrice)} {currency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
