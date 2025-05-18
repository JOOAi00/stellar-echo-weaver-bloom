
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from "@/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, X, Upload } from 'lucide-react';

// Import the QRTypeSelector component
import QRTypeSelector from "@/components/qr/QRTypeSelector";

const QRCodeTypePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, language, canAddLogo } = useUser();
  const [selectedType, setSelectedType] = useState("url");
  const [url, setUrl] = useState("");
  const [dotColor, setDotColor] = useState("#8A3FFC");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [dotSize, setDotSize] = useState(70);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [errorLevel, setErrorLevel] = useState("H");
  const { toast } = useToast();
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };
  
  const handleGenerate = () => {
    if (!isLoggedIn) {
      toast({
        title: language === "ar" ? "يرجى تسجيل الدخول" : "Login Required",
        description: language === "ar" 
          ? "يجب تسجيل الدخول أولاً لإنشاء الباركود" 
          : "You must log in first to create the QR code"
      });
      navigate("/login");
      return;
    }
    
    // Open the ad when clicking on Generate
    window.open("https://www.profitableratecpm.com/i05a32zv3x?key=e8aa2d7d76baecb611b49ce0d5af754f", "_blank");
    
    // Navigate to the QR code generation page
    navigate(`/?type=${selectedType}`);
  };

  // SEO schema for structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": language === "ar" ? "إنشاء كود QR - QRito" : "Create QR Code - QRito",
    "description": language === "ar" ? "اختر نوع كود QR وقم بتخصيصه حسب احتياجاتك" : "Choose your QR code type and customize it to your needs",
    "publisher": {
      "@type": "Organization",
      "name": "QRito"
    },
    "inLanguage": language === "ar" ? "ar" : "en"
  };
  
  // Error correction levels
  const errorLevels = [
    { value: 'L', label: language === "ar" ? 'L - منخفض (7%)' : 'L - Low (7%)' },
    { value: 'M', label: language === "ar" ? 'M - متوسط (15%)' : 'M - Medium (15%)' },
    { value: 'Q', label: language === "ar" ? 'Q - جودة (25%)' : 'Q - Quality (25%)' },
    { value: 'H', label: language === "ar" ? 'H - عالي (30%)' : 'H - High (30%)' }
  ];
  
  // Handle URL change based on QR type
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  // Handle error correction level change
  const handleErrorLevelChange = (value: string) => {
    setErrorLevel(value);
    toast({
      title: language === "ar" ? "تم تحديث مستوى تصحيح الخطأ" : "Error Correction Updated",
      description: language === "ar" 
        ? `تم تعيين مستوى تصحيح الخطأ إلى ${value}` 
        : `Error correction level set to ${value}`,
    });
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
    <div className="min-h-screen flex flex-col bg-gray-50" dir={language === "ar" ? "rtl" : "ltr"}>
      <Helmet>
        <title>{language === "ar" ? "إنشاء كود QR - أنواع مختلفة من رموز QR | QRito" : "Create QR Code - Various QR Code Types | QRito"}</title>
        <meta 
          name="description" 
          content={language === "ar" ? "أنشئ أنواع مختلفة من رموز QR: URL، نص، بريد إلكتروني، WiFi، جهات اتصال، موقع، أحداث، وأكثر. خصص الألوان والتصميم مجاناً." : "Create various types of QR codes: URL, text, email, WiFi, contact info, location, events, and more. Customize colors and design for free."} 
        />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-3">
            {language === "ar" ? "إنشاء كود QR الخاص بك" : "Create Your QR Code"}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {language === "ar" ? "خصص محتواك واختر نوع كود QR" : "Customize your content and choose QR code type"}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <QRTypeSelector 
                  qrType={selectedType}
                  onSelectType={handleTypeSelect}
                />
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">
                    {selectedType === 'url' ? language === "ar" ? "رابط الموقع" : 'Website URL' : 
                     selectedType === 'text' ? language === "ar" ? "نص" : 'Text' :
                     selectedType === 'email' ? language === "ar" ? "البريد الإلكتروني" : 'Email' :
                     selectedType === 'wifi' ? language === "ar" ? "شبكة WiFi" : 'WiFi Network' :
                     selectedType === 'contact' ? language === "ar" ? "معلومات الاتصال" : 'Contact Info' :
                     selectedType === 'location' ? language === "ar" ? "الموقع" : 'Location' :
                     selectedType === 'event' ? language === "ar" ? "تفاصيل الحدث" : 'Event Details' :
                     selectedType === 'image' ? language === "ar" ? "رابط الصورة" : 'Image URL' :
                     selectedType === 'app' ? language === "ar" ? "رابط التطبيق" : 'App URL' : language === "ar" ? "رقم SMS" : 'SMS Number'}
                  </h3>
                  <Input 
                    placeholder={selectedType === 'url' ? "https://example.com" : 
                               selectedType === 'image' ? "https://example.com/image.jpg" :
                               language === "ar" ? "أدخل المحتوى" : "Enter content"} 
                    value={url}
                    onChange={handleUrlChange}
                    className="w-full" 
                    aria-label={language === "ar" ? "محتوى كود QR" : "QR code content"}
                  />
                  {/* Add helper text for image type */}
                  {selectedType === 'image' && (
                    <p className="text-xs text-gray-500 mt-1">
                      {language === "ar" 
                        ? "أدخل رابط URL مباشر لصورة متاحة على الإنترنت"
                        : "Enter a direct URL to an image available on the internet"}
                    </p>
                  )}
                </div>
                
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
                      <div className="mb-8">
                        <div className="flex justify-between mb-2">
                          <h3 className="text-sm font-medium">
                            {language === "ar" ? "حجم كود QR" : "QR Code Size"}
                          </h3>
                          <span className="text-sm text-gray-500">{dotSize}%</span>
                        </div>
                        <Slider
                          value={[dotSize]}
                          min={10}
                          max={65}
                          step={1}
                          onValueChange={(value) => setDotSize(value[0])}
                          className="w-full"
                          aria-label={language === "ar" ? "حجم كود QR" : "QR Code size"}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    <div className="space-y-6">
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          <h3 className="text-sm font-medium">
                            {language === "ar" ? "استدارة الزوايا" : "Corner Radius"}
                          </h3>
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

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          {language === "ar" ? "تصحيح الخطأ" : "Error Correction"}
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                          {errorLevels.map((level) => (
                            <button 
                              key={level.value}
                              type="button"
                              onClick={() => handleErrorLevelChange(level.value)}
                              className={`flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                                errorLevel === level.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                              }`}
                            >
                              <span className={`text-sm ${errorLevel === level.value ? 'font-semibold text-purple-700' : ''}`}>
                                {level.value}
                              </span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === "ar" ? "المستويات العالية تمكن من تصحيح الخطأ بشكل أفضل ولكنها تنشئ رموزًا أكثر كثافة" : "Higher levels enable better error correction but create denser codes"}
                        </p>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">
                          {language === "ar" ? "إضافة شعار (اختياري)" : "Add Logo (Optional)"}
                        </h3>
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
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">
                          {language === "ar" ? "تنسيق الصورة" : "Image Format"}
                        </h3>
                        <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm">
                          <option value="svg">SVG</option>
                          <option value="png">PNG</option>
                          <option value="jpeg">JPEG</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  onClick={handleGenerate}
                  size="lg" 
                  className="w-full bg-purple-600 hover:bg-purple-700 rounded-full py-6 mt-4"
                >
                  <QrCode className="mr-2 h-5 w-5" /> 
                  {language === "ar" ? "إنشاء رمز QR" : "Generate QR Code"}
                </Button>
              </div>
            </div>
            
            <div>
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">
                  {language === "ar" ? "معاينة كود QR" : "QR Preview"}
                </h2>
                <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg h-64">
                  {url ? (
                    <div id="qr-code-svg" className="flex justify-center items-center">
                      {/* QR code would be rendered here by the actual implementation */}
                      <QrCode size={Math.max(128, 128 + dotSize)} className="text-purple-600" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <QrCode size={64} className="mx-auto mb-2 text-gray-300" aria-hidden="true" />
                      <p>{language === "ar" ? "معاينة كود QR" : "QR Preview"}</p>
                    </div>
                  )}
                </div>
                
                {url && (
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <Button variant="secondary" className="text-xs" onClick={() => {
                      if (isLoggedIn) {
                        window.open("https://www.profitableratecpm.com/i05a32zv3x?key=e8aa2d7d76baecb611b49ce0d5af754f", "_blank");
                      } else {
                        toast({
                          title: language === "ar" ? "يرجى تسجيل الدخول" : "Login Required",
                          description: language === "ar" ? "يجب تسجيل الدخول أولاً" : "You must log in first",
                        });
                        navigate("/login");
                      }
                    }}>
                      {language === "ar" ? "تنزيل" : "Download"}
                    </Button>
                    <Button variant="secondary" className="text-xs" onClick={() => {
                      if (isLoggedIn) {
                        window.open("https://www.profitableratecpm.com/i05a32zv3x?key=e8aa2d7d76baecb611b49ce0d5af754f", "_blank");
                      } else {
                        toast({
                          title: language === "ar" ? "يرجى تسجيل الدخول" : "Login Required",
                          description: language === "ar" ? "يجب تسجيل الدخول أولاً" : "You must log in first",
                        });
                        navigate("/login");
                      }
                    }}>
                      {language === "ar" ? "نسخ" : "Copy"}
                    </Button>
                    <Button variant="secondary" className="text-xs" onClick={() => {
                      if (isLoggedIn) {
                        window.open("https://www.profitableratecpm.com/i05a32zv3x?key=e8aa2d7d76baecb611b49ce0d5af754f", "_blank");
                      } else {
                        toast({
                          title: language === "ar" ? "يرجى تسجيل الدخول" : "Login Required",
                          description: language === "ar" ? "يجب تسجيل الدخول أولاً" : "You must log in first",
                        });
                        navigate("/login");
                      }
                    }}>
                      {language === "ar" ? "مشاركة" : "Share"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QRCodeTypePage;
