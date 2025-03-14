
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoomParametersProps {
  roomArea: string;
  setRoomArea: (value: string) => void;
  ceilingHeight: string;
  setCeilingHeight: (value: string) => void;
  insolation: 'weak' | 'medium' | 'strong';
  setInsolation: (value: 'weak' | 'medium' | 'strong') => void;
}

export const RoomParameters: React.FC<RoomParametersProps> = ({
  roomArea,
  setRoomArea,
  ceilingHeight,
  setCeilingHeight,
  insolation,
  setInsolation,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Площадь помещения, кв. м
          </label>
          <Input
            type="number"
            value={roomArea}
            onChange={(e) => setRoomArea(e.target.value)}
            className="text-lg"
            placeholder="20"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Высота потолка, м
          </label>
          <Input
            type="number"
            value={ceilingHeight}
            onChange={(e) => setCeilingHeight(e.target.value)}
            className="text-lg"
            placeholder="2.75"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Инсоляция (степень освещенности солнечными лучами)
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setInsolation('weak')}
            variant={insolation === 'weak' ? 'default' : 'outline'}
            className={cn(
              "flex-1",
              insolation === 'weak' && "bg-[#1886BD] hover:bg-[#1886BD]/90"
            )}
          >
            Слабая
          </Button>
          <Button
            type="button"
            onClick={() => setInsolation('medium')}
            variant={insolation === 'medium' ? 'default' : 'outline'}
            className={cn(
              "flex-1",
              insolation === 'medium' && "bg-[#1886BD] hover:bg-[#1886BD]/90"
            )}
          >
            Средняя
          </Button>
          <Button
            type="button"
            onClick={() => setInsolation('strong')}
            variant={insolation === 'strong' ? 'default' : 'outline'}
            className={cn(
              "flex-1",
              insolation === 'strong' && "bg-[#1886BD] hover:bg-[#1886BD]/90"
            )}
          >
            Сильная
          </Button>
        </div>
      </div>
    </div>
  );
};
