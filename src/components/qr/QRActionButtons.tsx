
import React from 'react';
import { Download, Copy, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context';
import { useNavigate } from 'react-router-dom';
import { svgToPngDataUrl, shareImage } from '@/utils/imageUtils';

interface QRActionButtonsProps {
  generated: boolean;
  qrValue: string;
  qrURL: string;
  subscription: string;
  imageFormat?: string;
}

/**
 * Component for QR code action buttons
 */
const QRActionButtons = ({
  generated,
  qrValue,
  qrURL,
  subscription,
  imageFormat = 'svg'
}: QRActionButtonsProps) => {
  const { toast } = useToast();
  const { isLoggedIn, language } = useUser();
  const navigate = useNavigate();
  const shouldShow = (generated || (qrValue && subscription !== 'free')) && qrURL;
  
  // Add function to open the ad
  const openAd = () => {
    window.open("https://www.profitableratecpm.com/i05a32zv3x?key=e8aa2d7d76baecb611b49ce0d5af754f", "_blank");
  };
  
  const downloadQRCode = async () => {
    if (!isLoggedIn) {
      toast({
        title: language === "ar" ? "يرجى تسجيل الدخول" : "Login Required",
        description: language === "ar" ? "يجب تسجيل الدخول أولاً لتنزيل الباركود" : "You must log in first to download the QR code",
      });
      navigate("/login");
      return;
    }

    // Open the ad
    openAd();
    
    const svg = document.getElementById("qr-code-svg");
    if (!svg || !(svg instanceof SVGElement)) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في إنشاء الصورة" : "Failed to create the image",
      });
      return;
    }

    // For free users, always download as PNG
    const format = subscription === 'free' ? 'png' : imageFormat;
    
    try {
      if (format === 'svg') {
        // Download as SVG
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qrcode.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Download as PNG or JPEG using the utility function
        const dataUrl = await svgToPngDataUrl(svg);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `qrcode.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: language === "ar" ? "بدأ التنزيل" : "Download Started",
        description: language === "ar" 
          ? `تم تنزيل رمز QR بتنسيق ${format.toUpperCase()}`
          : `QR code downloaded in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في تنزيل رمز QR" : "Failed to download QR code",
      });
    }
  };
  
  const copyQRCodeToClipboard = async () => {
    if (!isLoggedIn) {
      toast({
        title: language === "ar" ? "يرجى تسجيل الدخول" : "Login Required",
        description: language === "ar" ? "يجب تسجيل الدخول أولاً لنسخ الباركود" : "You must log in first to copy the QR code",
      });
      navigate("/login");
      return;
    }

    // Open the ad
    openAd();
    
    const svg = document.getElementById("qr-code-svg");
    if (!svg || !(svg instanceof SVGElement)) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في نسخ رمز QR" : "Failed to copy QR code",
      });
      return;
    }

    try {
      // For copying, we'll convert to PNG for better clipboard compatibility
      const dataUrl = await svgToPngDataUrl(svg);
      
      // Create a temporary image element
      const img = document.createElement('img');
      img.src = dataUrl;
      
      // Use the clipboard API if available
      if (navigator.clipboard && navigator.clipboard.write) {
        const blob = await fetch(dataUrl).then(r => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      } else {
        // Fallback: create a temporary textarea for fallback text copy
        const textarea = document.createElement('textarea');
        textarea.value = 'QR Code (image not copied - browser does not support image copying)';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      toast({
        title: language === "ar" ? "تم النسخ" : "Copied",
        description: language === "ar" ? "تم نسخ رمز QR إلى الحافظة" : "QR code copied to clipboard",
      });
    } catch (error) {
      console.error("Copy error:", error);
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في نسخ رمز QR" : "Failed to copy QR code",
      });
    }
  };
  
  const shareQRCode = async () => {
    if (!isLoggedIn) {
      toast({
        title: language === "ar" ? "يرجى تسجيل الدخول" : "Login Required", 
        description: language === "ar" ? "يجب تسجيل الدخول أولاً لمشاركة الباركود" : "You must log in first to share the QR code",
      });
      navigate("/login");
      return;
    }

    // Open the ad
    openAd();
    
    const svg = document.getElementById("qr-code-svg");
    if (!svg || !(svg instanceof SVGElement)) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في مشاركة رمز QR" : "Failed to share QR code",
      });
      return;
    }

    try {
      // Convert SVG to PNG for better sharing compatibility
      const pngDataUrl = await svgToPngDataUrl(svg);
      
      // Use our utility function to share
      const shared = await shareImage(
        pngDataUrl,
        language === "ar" ? "رمز QR" : "QR Code",
        language === "ar" ? "شاهد رمز QR الخاص بي!" : "Check out my QR code!"
      );
      
      if (shared) {
        toast({
          title: language === "ar" ? "تمت المشاركة" : "Shared",
          description: language === "ar" ? "تمت مشاركة رمز QR بنجاح" : "QR code shared successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: language === "ar" ? "فشل المشاركة" : "Share Failed",
          description: language === "ar" 
            ? "فشل في مشاركة رمز QR، حاول بطريقة أخرى" 
            : "Failed to share QR code, try another method",
        });
      }
    } catch (error: any) {
      console.error("Share error:", error);
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: error.message || (language === "ar" ? "فشل في مشاركة رمز QR" : "Failed to share QR code"),
      });
    }
  };
  
  if (!shouldShow) return null;
  
  return (
    <div className="mt-6">
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={downloadQRCode} 
          variant="secondary" 
          className="w-full"
        >
          <Download className="mr-2" size={16} />
          {language === "ar" ? "تنزيل رمز QR" : "Download QR Code"}
        </Button>
        <Button 
          onClick={copyQRCodeToClipboard} 
          variant="secondary" 
          className="w-full"
        >
          <Copy className="mr-2" size={16} />
          {language === "ar" ? "نسخ رمز QR" : "Copy QR Code"}
        </Button>
        <Button 
          onClick={shareQRCode} 
          variant="secondary" 
          className="w-full"
        >
          <Share2 className="mr-2" size={16} />
          {language === "ar" ? "مشاركة" : "Share"}
        </Button>
      </div>
    </div>
  );
};

export default QRActionButtons;
