
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context';
import { useRef } from 'react';

interface QRAdvancedOptionsProps {
  cornerRadius: number;
  setCornerRadius: (value: number) => void;
  level: string;
  setLevel: (level: string) => void;
  imageFormat: string;
  setImageFormat: (format: string) => void;
  subscription: string;
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

const QRAdvancedOptions = ({
  cornerRadius,
  setCornerRadius,
  level,
  setLevel,
  imageFormat,
  setImageFormat,
  subscription,
  logo,
  setLogo
}: QRAdvancedOptionsProps) => {
  const isPremium = subscription !== 'free';
  const { language, canAddLogo } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Error correction levels
  const errorLevels = [
    { value: 'L', label: language === "ar" ? 'L - منخفض (7%)' : 'L - Low (7%)' },
    { value: 'M', label: language === "ar" ? 'M - متوسط (15%)' : 'M - Medium (15%)' },
    { value: 'Q', label: language === "ar" ? 'Q - جودة (25%)' : 'Q - Quality (25%)' },
    { value: 'H', label: language === "ar" ? 'H - عالي (30%)' : 'H - High (30%)' }
  ];

  const imageFormats = [
    { value: 'svg', label: 'SVG' },
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' }
  ];
  
  // Handle error correction level change
  const handleErrorCorrectionChange = (value: string) => {
    setLevel(value);
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: language === "ar" ? "الملف كبير جدًا" : "File too large",
          description: language === "ar" 
            ? "يرجى تحميل صورة أصغر من 2 ميجابايت"
            : "Please upload an image smaller than 2MB"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: language === "ar" ? "نوع ملف غير صالح" : "Invalid file type",
          description: language === "ar"
            ? "يرجى تحميل ملف صورة"
            : "Please upload an image file"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setLogo(event.target.result as string);
          toast({
            title: language === "ar" ? "تم تحميل الشعار" : "Logo uploaded",
            description: language === "ar"
              ? "تمت إضافة شعارك إلى رمز QR"
              : "Your logo has been added to the QR code"
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-4">
          {language === "ar" ? "خيارات متقدمة" : "Advanced Options"}
        </h3>
        
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="design" className="text-center">
              {language === "ar" ? "التصميم" : "Design"}
            </TabsTrigger>
            <TabsTrigger value="export" className="text-center">
              {language === "ar" ? "التصدير" : "Export"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="design">
            <div className="space-y-6">
              <div>
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
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {language === "ar" ? "تصحيح الخطأ" : "Error Correction"}
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {errorLevels.map((errorLevel) => (
                    <button 
                      key={errorLevel.value}
                      onClick={() => handleErrorCorrectionChange(errorLevel.value)}
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                        level === errorLevel.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                      }`}
                      type="button"
                    >
                      <span className={`text-sm ${level === errorLevel.value ? 'font-semibold text-purple-700' : ''}`}>
                        {errorLevel.value}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {language === "ar" 
                    ? "المستويات العالية تمكن من تصحيح الخطأ بشكل أفضل ولكنها تنشئ رموزًا أكثر كثافة" 
                    : "Higher levels enable better error correction but create denser codes"}
                </p>
              </div>
              
              <div className="mt-6">
                <Label className="text-sm font-medium mb-2 block">
                  {language === "ar" ? "إضافة شعار (اختياري)" : "Add Logo (Optional)"}
                </Label>
                
                {isPremium ? (
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-8 bg-gray-50">
                    {logo ? (
                      <div className="relative">
                        <img src={logo} alt="Logo" className="h-24 w-auto" />
                        <button 
                          onClick={() => setLogo(null)} 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={36} className="mx-auto text-gray-400" />
                        <p className="text-gray-500 mt-2">
                          {language === "ar" ? "انقر لتحميل شعارك" : "Click to upload your logo"}
                        </p>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          id="logo-upload" 
                          ref={fileInputRef}
                          onChange={handleLogoUpload} 
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={handleClickUpload}
                          type="button"
                        >
                          {language === "ar" ? "اختر ملف" : "Choose File"}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <PlusCircle size={36} className="mx-auto text-gray-300" />
                      <p className="text-gray-400 mt-2">
                        {language === "ar" ? "قم بالترقية إلى Premium لإضافة شعار" : "Upgrade to Premium to add a logo"}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" disabled>
                        {language === "ar" ? "ميزة مدفوعة" : "Premium Feature"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="export">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {language === "ar" ? "تنسيق الصورة" : "Image Format"}
                </Label>
                {isPremium ? (
                  <Select value={imageFormat} onValueChange={setImageFormat}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={
                        language === "ar" ? "اختر التنسيق" : "Select format"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {imageFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-500">
                      {language === "ar" 
                        ? "الخطة المجانية تصدر بتنسيق PNG فقط" 
                        : "Free plan exports as PNG only"}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">
                  {language === "ar" ? "جودة الصورة" : "Image Quality"}
                </Label>
                <Select defaultValue="high" disabled={!isPremium}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      language === "ar" ? "اختر الجودة" : "Select quality"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      {language === "ar" ? "منخفضة" : "Low"} (72 DPI)
                    </SelectItem>
                    <SelectItem value="medium">
                      {language === "ar" ? "متوسطة" : "Medium"} (150 DPI)
                    </SelectItem>
                    <SelectItem value="high">
                      {language === "ar" ? "عالية" : "High"} (300 DPI)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!isPremium && (
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "ar" 
                      ? "الجودة العالية متاحة فقط للمستخدمين المميزين" 
                      : "High quality available only for premium users"}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QRAdvancedOptions;
