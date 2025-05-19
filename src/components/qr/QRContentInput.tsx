
import React from 'react';
import { useUser } from '@/context';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WiFiNetworkInput from './WiFiNetworkInput';

interface QRContentInputProps {
  qrType: string;
  qrValue: string;
  handleContentChange: (value: string) => void;
}

/**
 * Input component for QR code content based on the selected type
 */
const QRContentInput = ({ qrType, qrValue, handleContentChange }: QRContentInputProps) => {
  const { language } = useUser();
  
  // Determine input type
  if (qrType === 'wifi') {
    return (
      <WiFiNetworkInput 
        value={qrValue}
        onChange={handleContentChange}
      />
    );
  }
  
  // For text type, use a textarea
  if (qrType === 'text') {
    return (
      <div>
        <h3 className="text-sm font-medium mb-2">
          {language === "ar" ? "النص" : "Text"}
        </h3>
        <Textarea
          value={qrValue}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={language === "ar" ? "أدخل النص هنا..." : "Enter text here..."}
          className="w-full min-h-24"
        />
      </div>
    );
  }
  
  // For other types, use a simple input with appropriate placeholders
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">
        {qrType === 'url' ? language === "ar" ? "رابط الموقع" : 'Website URL' : 
         qrType === 'email' ? language === "ar" ? "البريد الإلكتروني" : 'Email' :
         qrType === 'contact' ? language === "ar" ? "معلومات الاتصال" : 'Contact Info' :
         qrType === 'location' ? language === "ar" ? "الموقع" : 'Location' :
         qrType === 'event' ? language === "ar" ? "تفاصيل الحدث" : 'Event Details' :
         qrType === 'image' ? language === "ar" ? "رابط الصورة" : 'Image URL' :
         qrType === 'app' ? language === "ar" ? "رابط التطبيق" : 'App URL' : language === "ar" ? "رقم SMS" : 'SMS Number'}
      </h3>
      <Input
        value={qrValue}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder={
          qrType === 'url' ? 'https://example.com' : 
          qrType === 'email' ? 'email@example.com' :
          qrType === 'image' ? 'https://example.com/image.jpg' :
          language === "ar" ? "أدخل المحتوى" : "Enter content"
        }
        className="w-full"
      />
      
      {/* Add helper text for image type */}
      {qrType === 'image' && (
        <p className="text-xs text-gray-500 mt-1">
          {language === "ar" 
            ? "أدخل رابط URL مباشر لصورة متاحة على الإنترنت"
            : "Enter a direct URL to an image available on the internet"}
        </p>
      )}
    </div>
  );
};

export default QRContentInput;
