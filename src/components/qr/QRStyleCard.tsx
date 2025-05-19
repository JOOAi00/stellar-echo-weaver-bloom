
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ColorPicker } from "@/components/ui/color-picker";
import { useUser } from '@/context';
import QRAdvancedOptions from './QRAdvancedOptions';

interface QRStyleCardProps {
  dotColor: string;
  backgroundColor: string;
  dotSize: number;
  cornerRadius: number;
  level: string;
  imageFormat: string;
  setDotColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setDotSize: (size: number) => void;
  setCornerRadius: (radius: number) => void;
  setLevel: (level: string) => void;
  setImageFormat: (format: string) => void;
  subscription: string;
}

/**
 * Card component for QR code styling options
 */
const QRStyleCard = ({
  dotColor,
  backgroundColor,
  setDotColor,
  setBackgroundColor,
  cornerRadius,
  setCornerRadius,
  level,
  setLevel,
  imageFormat,
  setImageFormat,
  subscription
}: QRStyleCardProps) => {
  const { language } = useUser();
  
  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-4">
          {language === "ar" ? "تخصيص النمط" : "Customize Style"}
        </h3>
        
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="design" className="text-center">
              {language === "ar" ? "التصميم" : "Design"}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-center">
              {language === "ar" ? "خيارات متقدمة" : "Advanced Options"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="design">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {language === "ar" ? "لون كود QR" : "QR Code Color"}
                  </h3>
                  <ColorPicker color={dotColor} onChange={setDotColor} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {language === "ar" ? "لون الخلفية" : "Background Color"}
                  </h3>
                  <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <QRAdvancedOptions
              cornerRadius={cornerRadius}
              setCornerRadius={setCornerRadius}
              level={level}
              setLevel={setLevel}
              imageFormat={imageFormat}
              setImageFormat={setImageFormat}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QRStyleCard;
