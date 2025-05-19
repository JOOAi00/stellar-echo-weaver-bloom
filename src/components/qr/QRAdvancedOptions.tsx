
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { useUser } from '@/context';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QRAdvancedOptionsProps {
  cornerRadius: number;
  setCornerRadius: (radius: number) => void;
  level: string;
  setLevel: (level: string) => void;
  imageFormat: string;
  setImageFormat: (format: string) => void;
}

/**
 * Component for QR code advanced styling options
 */
const QRAdvancedOptions = ({
  cornerRadius,
  setCornerRadius,
  level,
  setLevel,
  imageFormat,
  setImageFormat
}: QRAdvancedOptionsProps) => {
  const { language } = useUser();
  
  const handleLevelChange = (value: string) => {
    setLevel(value);
  };

  const handleFormatChange = (value: string) => {
    setImageFormat(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <Label className="text-sm font-medium">
            {language === "ar" ? "استدارة الزوايا" : "Corner Radius"}
          </Label>
          <span className="text-sm text-gray-500">{cornerRadius}%</span>
        </div>
        <Slider
          value={[cornerRadius]}
          min={0}
          max={50}
          step={1}
          onValueChange={(value) => setCornerRadius(value[0])}
          className="w-full"
          aria-label={language === "ar" ? "استدارة الزوايا" : "Corner radius"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="error-level" className="text-sm font-medium mb-2 block">
            {language === "ar" ? "مستوى تصحيح الخطأ" : "Error Correction Level"}
          </Label>
          <Select value={level} onValueChange={handleLevelChange}>
            <SelectTrigger id="error-level">
              <SelectValue placeholder={language === "ar" ? "اختر المستوى" : "Select Level"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L - 7%</SelectItem>
              <SelectItem value="M">M - 15%</SelectItem>
              <SelectItem value="Q">Q - 25%</SelectItem>
              <SelectItem value="H">H - 30%</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {language === "ar" ? "كلما زاد المستوى، زادت المقاومة للتلف" : "Higher level means more resistance to damage"}
          </p>
        </div>

        <div>
          <Label htmlFor="image-format" className="text-sm font-medium mb-2 block">
            {language === "ar" ? "تنسيق الصورة" : "Image Format"}
          </Label>
          <Select value={imageFormat} onValueChange={handleFormatChange}>
            <SelectTrigger id="image-format">
              <SelectValue placeholder={language === "ar" ? "اختر التنسيق" : "Select Format"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default QRAdvancedOptions;
