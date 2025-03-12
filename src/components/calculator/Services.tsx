
import React from 'react';
import { Input } from "@/components/ui/input";

export const Services = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Количество компьютеров
          </label>
          <Input
            type="number"
            defaultValue="0"
            className="text-lg"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Количество телевизоров
          </label>
          <Input
            type="number"
            defaultValue="0"
            className="text-lg"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Количество другой бытовой техники
          </label>
          <Input
            type="number"
            defaultValue="0"
            className="text-lg"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};
