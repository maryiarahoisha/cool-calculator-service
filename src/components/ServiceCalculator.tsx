
import React, { useState } from 'react';
import { Services } from '@/components/calculator/Services';
import { RoomParameters } from '@/components/calculator/RoomParameters';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ServiceCalculatorProps {
  onCalculationComplete?: (data: any) => void;
  currency?: string;
}

const ServiceCalculator: React.FC<ServiceCalculatorProps> = ({
  onCalculationComplete,
  currency = "BYN"
}) => {
  const [roomArea, setRoomArea] = useState<string>('');
  const [ceilingHeight, setCeilingHeight] = useState<string>('');
  const [insolation, setInsolation] = useState<'weak' | 'medium' | 'strong'>('medium');
  const [hasMansard, setHasMansard] = useState(false);
  const { toast } = useToast();
  
  const handleCalculate = () => {
    if (!roomArea || !ceilingHeight) {
      toast({
        title: "Заполните обязательные поля",
        description: "Необходимо указать площадь помещения и высоту потолка",
        variant: "destructive",
      });
      return;
    }

    // Calculate and callback for Bitrix integration if needed
    if (onCalculationComplete) {
      onCalculationComplete({
        roomArea,
        ceilingHeight,
        insolation,
        hasMansard,
      });
    }
  };

  return (
    <div className="calculator-container p-4 sm:p-6">
      <div className="calculator-content">
        <div className="p-6 space-y-8">
          <RoomParameters
            roomArea={roomArea}
            setRoomArea={setRoomArea}
            ceilingHeight={ceilingHeight}
            setCeilingHeight={setCeilingHeight}
            insolation={insolation}
            setInsolation={setInsolation}
          />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Мансардный этаж?</label>
              <Switch
                checked={hasMansard}
                onCheckedChange={setHasMansard}
              />
            </div>
            
            <Services />
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleCalculate}
              className="w-full bg-[#1886BD] hover:bg-[#1886BD]/90 text-white py-6 text-lg"
            >
              Подобрать
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Расчеты носят информационно-справочный характер. Конечная мощность рассчитывается индивидуально.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCalculator;
