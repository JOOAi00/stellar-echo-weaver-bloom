
import React from 'react';
import { Download, Copy, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context';
import { useNavigate } from 'react-router-dom';

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
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const shouldShow = (generated || (qrValue && subscription !== 'free')) && qrURL;
  
  // إضافة وظيفة لفتح الإعلان
  const openAd = () => {
    window.open("https://www.profitableratecpm.com/i05a32zv3x?key=e8aa2d7d76baecb611b49ce0d5af754f", "_blank");
  };
  
  const downloadQRCode = () => {
    if (!isLoggedIn) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول أولاً لتنزيل الباركود",
      });
      navigate("/login");
      return;
    }

    // فتح الإعلان
    openAd();
    
    const svg = document.getElementById("qr-code-svg");
    if (!svg) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في إنشاء الصورة",
      });
      return;
    }

    // For free users, always download as PNG
    const format = subscription === 'free' ? 'png' : imageFormat;
    
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
      // Download as PNG or JPEG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const downloadUrl = canvas.toDataURL(`image/${format === 'jpeg' ? 'jpeg' : 'png'}`);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `qrcode.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    }
    
    toast({
      title: "بدأ التنزيل",
      description: `تم تنزيل رمز QR بتنسيق ${format.toUpperCase()}`,
    });
  };
  
  const copyQRCodeToClipboard = () => {
    if (!isLoggedIn) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول أولاً لنسخ الباركود",
      });
      navigate("/login");
      return;
    }

    // فتح الإعلان
    openAd();
    
    const svg = document.getElementById("qr-code-svg");
    if (!svg) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في نسخ رمز QR",
      });
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    navigator.clipboard.writeText(svgData);
    
    toast({
      title: "تم النسخ",
      description: "تم نسخ رمز QR إلى الحافظة",
    });
  };
  
  const shareQRCode = async () => {
    if (!isLoggedIn) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول أولاً لمشاركة الباركود",
      });
      navigate("/login");
      return;
    }

    // فتح الإعلان
    openAd();
    
    const svg = document.getElementById("qr-code-svg");
    if (!svg) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في مشاركة رمز QR",
      });
      return;
    }

    try {
      // For sharing, convert to PNG for better compatibility
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], "qrcode.png", { type: "image/png" });
              if (navigator.share) {
                try {
                  await navigator.share({
                    files: [file],
                    title: "QR Code",
                    text: "شاهد رمز QR الخاص بي!"
                  });
                  toast({
                    title: "تمت المشاركة",
                    description: "تمت مشاركة رمز QR بنجاح",
                  });
                } catch (err: any) {
                  if (err.name !== 'AbortError') {
                    toast({
                      variant: "destructive",
                      title: "فشل المشاركة",
                      description: err.message || "فشل في مشاركة رمز QR",
                    });
                  }
                }
              } else {
                toast({
                  variant: "destructive",
                  title: "خطأ",
                  description: "واجهة برمجة المشاركة على الويب غير مدعومة في هذا المتصفح",
                });
              }
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل في مشاركة رمز QR",
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
          تنزيل رمز QR
        </Button>
        <Button 
          onClick={copyQRCodeToClipboard} 
          variant="secondary" 
          className="w-full"
        >
          <Copy className="mr-2" size={16} />
          نسخ رمز QR
        </Button>
        <Button 
          onClick={shareQRCode} 
          variant="secondary" 
          className="w-full"
        >
          <Share2 className="mr-2" size={16} />
          مشاركة
        </Button>
      </div>
    </div>
  );
};

export default QRActionButtons;
