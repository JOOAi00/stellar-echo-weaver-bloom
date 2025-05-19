
import React from 'react';
import { Download, Copy, Share2, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context';
import { useNavigate } from 'react-router-dom';
import { svgToPngDataUrl } from '@/utils/imageUtils';

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
        description: language === "ar" ? "يجب تسجيل الدخول أولاً لتنزيل رمز QR" : "You must log in first to download the QR code",
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
        description: language === "ar" ? "يجب تسجيل الدخول أولاً لنسخ رمز QR" : "You must log in first to copy the QR code",
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
      
      // Request focus on the document before using clipboard
      window.focus();
      document.body.focus();
      
      // Try to copy the image to clipboard
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast({
          title: language === "ar" ? "تم النسخ" : "Copied",
          description: language === "ar" ? "تم نسخ رمز QR إلى الحافظة" : "QR code copied to clipboard",
        });
      } catch (clipboardError) {
        console.error("Clipboard API error:", clipboardError);
        
        // Fallback: open in new tab
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>QR Code</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>body { display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh; margin: 0; background: #f9f9f9; font-family: sans-serif; }</style>
              </head>
              <body>
                <img src="${dataUrl}" style="max-width: 80%; max-height: 80%; border: 1px solid #ccc;">
                <div style="margin-top: 20px;">
                  <p>${language === "ar" ? "انسخ رمز QR هذا بالنقر بزر الماوس الأيمن على الصورة واختيار \"نسخ الصورة\"." : "Copy this QR code by right-clicking on the image and selecting \"Copy image\"."}</p>
                </div>
              </body>
            </html>
          `);
          newTab.document.close();
          
          toast({
            title: language === "ar" ? "بديل النسخ" : "Copy Alternative",
            description: language === "ar" ? "تم فتح رمز QR في علامة تبويب جديدة. انقر بزر الماوس الأيمن للنسخ." : "QR code opened in new tab. Right-click to copy.",
          });
        }
      }
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
        description: language === "ar" ? "يجب تسجيل الدخول أولاً لمشاركة رمز QR" : "You must log in first to share the QR code",
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
      
      // Create a download option that always works
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>${language === "ar" ? "مشاركة رمز QR" : "Share QR Code"}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: #f5f5f5;
                  text-align: center;
                }
                img {
                  max-width: 250px;
                  margin: 20px auto;
                  display: block;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                h2 {
                  color: #333;
                }
                .share-options {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                  gap: 10px;
                  max-width: 500px;
                  margin: 30px auto;
                }
                .share-btn {
                  background: #fff;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  padding: 10px;
                  cursor: pointer;
                  transition: all 0.2s;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  text-decoration: none;
                  color: #333;
                }
                .share-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                }
                .share-btn img {
                  width: 40px;
                  height: 40px;
                  border: none;
                  box-shadow: none;
                  margin-bottom: 5px;
                }
                .download-btn {
                  background: #8A3FFC;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 16px;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body dir="${language === "ar" ? "rtl" : "ltr"}">
              <h2>${language === "ar" ? "مشاركة رمز QR الخاص بك" : "Share Your QR Code"}</h2>
              <p>${language === "ar" ? "اختر منصة للمشاركة أو قم بتنزيل الرمز" : "Choose a platform to share or download your code"}</p>
              
              <img src="${pngDataUrl}" alt="QR Code">
              
              <div class="share-options">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook">
                  <span>Facebook</span>
                </a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(language === "ar" ? 'شاهد رمز QR الخاص بي!' : 'Check out my QR code!')}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter">
                  <span>Twitter</span>
                </a>
                <a href="https://wa.me/?text=${encodeURIComponent(language === "ar" ? 'شاهد رمز QR الخاص بي!' : 'Check out my QR code! ') + encodeURIComponent(window.location.href)}" target="_blank" class="share-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp">
                  <span>WhatsApp</span>
                </a>
                <a href="https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(language === "ar" ? 'شاهد رمز QR الخاص بي!' : 'Check out my QR code!')}" target="_blank" class="share-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" alt="Telegram">
                  <span>Telegram</span>
                </a>
                <a href="mailto:?subject=${encodeURIComponent(language === "ar" ? 'رمز QR للمشاركة' : 'QR Code to Share')}&body=${encodeURIComponent((language === "ar" ? 'شاهد رمز QR هذا:\n\n' : 'Check out this QR code:\n\n') + window.location.href)}" class="share-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email">
                  <span>Email</span>
                </a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn">
                  <span>LinkedIn</span>
                </a>
              </div>
              
              <button id="downloadBtn" class="download-btn">
                ${language === "ar" ? "تنزيل رمز QR" : "Download QR Code"}
              </button>
              <script>
                document.getElementById("downloadBtn").addEventListener("click", function() {
                  const link = document.createElement("a");
                  link.href = "${pngDataUrl}";
                  link.download = "qrcode.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                });
              </script>
            </body>
          </html>
        `);
        newTab.document.close();
        
        toast({
          title: language === "ar" ? "خيارات المشاركة" : "Sharing Options",
          description: language === "ar" ? "تم فتح خيارات المشاركة في علامة تبويب جديدة" : "Sharing options opened in a new tab",
        });
        return;
      }
      
      // If we can't open a new tab, show an error toast
      toast({
        variant: "destructive",
        title: language === "ar" ? "فشلت المشاركة" : "Share Failed",
        description: language === "ar" ? "فشل في مشاركة رمز QR، جرب طريقة أخرى" : "Failed to share QR code, try another method",
      });
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
