
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser } from '@/context';

interface QRContentInputProps {
  qrType: string;
  qrValue: string;
  handleContentChange: (value: string) => void;
}

/**
 * Component for different QR content input types
 */
const QRContentInput = ({ qrType, qrValue, handleContentChange }: QRContentInputProps) => {
  const { language } = useUser();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleContentChange(e.target.value);
  };

  // Get input label based on QR type
  const getInputLabel = () => {
    switch (qrType) {
      case 'url':
        return language === "ar" ? "رابط الموقع" : "Website URL";
      case 'text':
        return language === "ar" ? "نص" : "Text";
      case 'email':
        return language === "ar" ? "البريد الإلكتروني" : "Email";
      case 'wifi':
        return language === "ar" ? "شبكة WiFi" : "WiFi Network";
      case 'contact':
        return language === "ar" ? "معلومات الاتصال" : "Contact Info";
      case 'location':
        return language === "ar" ? "الموقع" : "Location";
      case 'event':
        return language === "ar" ? "تفاصيل الحدث" : "Event Details";
      case 'image':
        return language === "ar" ? "رابط الصورة" : "Image URL";
      case 'app':
        return language === "ar" ? "رابط التطبيق" : "App URL";
      case 'sms':
        return language === "ar" ? "رقم SMS" : "SMS Number";
      default:
        return language === "ar" ? "المحتوى" : "Content";
    }
  };

  // Get input placeholder based on QR type
  const getInputPlaceholder = () => {
    switch (qrType) {
      case 'url':
        return "https://example.com";
      case 'text':
        return language === "ar" ? "أدخل النص هنا..." : "Enter text here...";
      case 'email':
        return "email@example.com";
      case 'wifi':
        return "Network Name";
      case 'contact':
        return language === "ar" ? "اسم جهة الاتصال" : "Contact Name";
      case 'location':
        return "31.2001° N, 29.9187° E";
      case 'event':
        return language === "ar" ? "اسم الحدث" : "Event Name";
      case 'image':
        return "https://example.com/image.jpg";
      case 'app':
        return "https://play.google.com/store/apps/details?id=app.id";
      case 'sms':
        return "+201234567890";
      default:
        return language === "ar" ? "أدخل المحتوى هنا" : "Enter content here";
    }
  };
  
  // Show additional helper text for image type
  const getHelperText = () => {
    if (qrType === 'image') {
      return language === "ar" 
        ? "أدخل رابط URL مباشر لصورة متاحة على الإنترنت"
        : "Enter a direct URL to an image available on the internet";
    }
    return null;
  };

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium mb-2">
        {getInputLabel()}
      </Label>
      
      {qrType === 'text' ? (
        <Textarea 
          value={qrValue} 
          onChange={handleChange}
          placeholder={getInputPlaceholder()}
          rows={4}
          className="w-full"
        />
      ) : (
        <>
          <Input 
            type={qrType === 'email' ? 'email' : 'text'}
            value={qrValue} 
            onChange={handleChange}
            placeholder={getInputPlaceholder()}
            className="w-full"
          />
          {getHelperText() && (
            <p className="text-xs text-gray-500 mt-1">{getHelperText()}</p>
          )}
        </>
      )}
    </div>
  );
};

export default QRContentInput;
