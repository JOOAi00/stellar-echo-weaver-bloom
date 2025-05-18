
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
        title: "Login Required",
        description: "You must log in first to download the QR code",
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
        title: "Error",
        description: "Failed to create the image",
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
        title: "Download Started",
        description: `QR code downloaded in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download QR code",
      });
    }
  };
  
  const copyQRCodeToClipboard = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "You must log in first to copy the QR code",
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
        title: "Error",
        description: "Failed to copy QR code",
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
          title: "Copied",
          description: "QR code copied to clipboard",
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
                  <p>Copy this QR code by right-clicking on the image and selecting "Copy image".</p>
                </div>
              </body>
            </html>
          `);
          newTab.document.close();
          
          toast({
            title: "Copy Alternative",
            description: "QR code opened in new tab. Right-click to copy.",
          });
        }
      }
    } catch (error) {
      console.error("Copy error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy QR code",
      });
    }
  };
  
  const shareQRCode = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "You must log in first to share the QR code",
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
        title: "Error",
        description: "Failed to share QR code",
      });
      return;
    }

    try {
      // Convert SVG to PNG for better sharing compatibility
      const pngDataUrl = await svgToPngDataUrl(svg);
      
      // Use our utility function to share
      const shared = await shareImage(
        pngDataUrl,
        "QR Code",
        "Check out my QR code!"
      );
      
      if (shared) {
        toast({
          title: "Shared",
          description: "QR code shared successfully",
        });
      } else {
        // If normal sharing failed, try an alternative method
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>QR Code - Share</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>body { display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh; margin: 0; background: #f9f9f9; font-family: sans-serif; }</style>
              </head>
              <body>
                <img src="${pngDataUrl}" style="max-width: 80%; max-height: 80%; border: 1px solid #ccc;">
                <div style="margin-top: 20px;">
                  <p>You can download this QR code and share it manually.</p>
                  <button id="downloadBtn" style="background: #8A3FFC; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Download for Sharing</button>
                </div>
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
            title: "Alternative Sharing",
            description: "QR code opened in new tab for manual sharing",
          });
          return true;
        }
        
        toast({
          variant: "destructive",
          title: "Share Failed",
          description: "Failed to share QR code, try another method",
        });
      }
    } catch (error: any) {
      console.error("Share error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to share QR code",
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
          Download QR Code
        </Button>
        <Button 
          onClick={copyQRCodeToClipboard} 
          variant="secondary" 
          className="w-full"
        >
          <Copy className="mr-2" size={16} />
          Copy QR Code
        </Button>
        <Button 
          onClick={shareQRCode} 
          variant="secondary" 
          className="w-full"
        >
          <Share2 className="mr-2" size={16} />
          Share
        </Button>
      </div>
    </div>
  );
};

export default QRActionButtons;
