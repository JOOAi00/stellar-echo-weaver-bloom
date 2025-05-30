
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context";

const Pricing = () => {
  const { isLoggedIn, subscription, subscriptionEndDate, setUserSubscription, canSubscribe, language } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Translation function
  const t = (en: string, ar: string) => {
    return language === "ar" ? ar : en;
  };
  
  const handlePlanSelection = (plan: string) => {
    if (!isLoggedIn) {
      toast({
        title: t("Login Required", "تسجيل الدخول مطلوب"),
        description: t("Please login to subscribe to a plan", "يرجى تسجيل الدخول للاشتراك في خطة"),
      });
      navigate("/login");
      return;
    }
    
    // For free plan
    if (plan === "free") {
      // Check if can downgrade to free plan (using the canSubscribe function)
      if (!canSubscribe(plan)) {
        return;
      }
      
      setUserSubscription('free');
      toast({
        title: t("Free Plan Selected", "تم اختيار الخطة المجانية"),
        description: t("You're now using the free plan with 5 QR codes.", "أنت الآن تستخدم الخطة المجانية مع 5 رموز QR."),
      });
      navigate("/");
      return;
    }
    
    // For paid plans - check if already on another paid plan
    if (!canSubscribe(plan)) {
      return;
    }
    
    // If eligible to subscribe, proceed
    setUserSubscription(plan);
    toast({
      title: t(`${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Selected`, `تم اختيار خطة ${plan === "pro" ? "الاحترافية" : "الأعمال"}`),
      description: t(`You're now on the ${plan} free trial for 30 days.`, `أنت الآن على فترة تجريبية مجانية لمدة 30 يومًا من خطة ${plan === "pro" ? "الاحترافية" : "الأعمال"}.`),
    });
    navigate("/");
  };

  const plans = [
    {
      name: t("Free", "مجاني"),
      tagline: t("For basic QR code needs", "للاحتياجات الأساسية لرمز QR"),
      price: t("$0", "٠ دولار"),
      period: t("forever", "للأبد"),
      description: t("Basic QR code needs", "احتياجات رمز QR الأساسية"),
      features: [
        t("Basic QR code creation", "إنشاء رمز QR أساسي"),
        t("QR codes for links, text, and email", "رموز QR للروابط والنص والبريد الإلكتروني"),
        t("Standard customization options", "خيارات التخصيص القياسية"),
        t("PNG downloads", "تنزيلات بصيغة PNG"),
        t("Limited - only 5 QR codes", "محدود - فقط 5 رموز QR"),
        t("Contains ads", "يحتوي على إعلانات")
      ],
      buttonText: subscription === 'free' ? 
        t("Current Plan", "الخطة الحالية") : 
        t("Start for Free", "ابدأ مجانًا"),
      buttonVariant: subscription === 'free' ? "default" : "outline",
      planId: "free",
      current: subscription === 'free'
    },
    {
      name: t("Pro", "احترافي"),
      tagline: t("For professionals and small businesses", "للمحترفين والشركات الصغيرة"),
      price: t("$9.99", "٩٫٩٩ دولار"),
      period: t("monthly", "شهريًا"),
      description: t("For professional needs", "للاحتياجات المهنية"),
      trialText: t("30-day free trial", "تجربة مجانية لمدة 30 يوم"),
      features: [
        t("All Free plan features", "جميع ميزات الخطة المجانية"),
        t("Unlimited QR codes", "رموز QR غير محدودة"),
        t("All QR code types", "جميع أنواع رموز QR"),
        t("Advanced customization options", "خيارات تخصيص متقدمة"),
        t("Logo embedding", "تضمين الشعار"),
        t("PNG, JPG, and SVG downloads", "تنزيلات بصيغة PNG وJPG وSVG"),
        t("Basic QR analytics", "تحليلات QR أساسية"),
        t("Dynamic QR codes", "رموز QR ديناميكية"),
        t("No ads", "بدون إعلانات")
      ],
      buttonText: subscription === 'pro' ? 
        t("Current Plan", "الخطة الحالية") : 
        t("Start Free Trial", "ابدأ الفترة التجريبية"),
      buttonVariant: "default",
      popular: true,
      planId: "pro",
      current: subscription === 'pro'
    },
    {
      name: t("Business", "أعمال"),
      tagline: t("For teams and organizations", "للفرق والمؤسسات"),
      price: t("$29.99", "٢٩٫٩٩ دولار"),
      period: t("monthly", "شهريًا"),
      description: t("For companies and enterprises", "للشركات والمؤسسات"),
      trialText: t("30-day free trial", "تجربة مجانية لمدة 30 يوم"),
      features: [
        t("All Pro features", "جميع ميزات الخطة الاحترافية"),
        t("Multiple team members", "أعضاء فريق متعددين"),
        t("Advanced QR analytics", "تحليلات QR متقدمة"),
        t("API access", "الوصول إلى API"),
        t("White label options", "خيارات العلامة البيضاء"),
        t("Bulk QR code creation", "إنشاء رموز QR بالجملة"),
        t("Priority support", "دعم ذو أولوية"),
        t("No ads", "بدون إعلانات")
      ],
      buttonText: subscription === 'business' ? 
        t("Current Plan", "الخطة الحالية") : 
        t("Start Free Trial", "ابدأ الفترة التجريبية"),
      buttonVariant: subscription === 'business' ? "default" : "outline",
      planId: "business",
      current: subscription === 'business'
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4" id="pricing" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {t("Simple and Transparent Pricing", "أسعار بسيطة وشفافة")}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("Choose the right plan for your QR code needs. Select the appropriate plan for your business or personal use.", 
             "اختر الخطة المناسبة لاحتياجات رمز QR الخاص بك. اختر الخطة المناسبة لعملك أو استخدامك الشخصي.")}
        </p>
        
        {subscriptionEndDate && subscription !== 'free' && (
          <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded-md inline-block">
            {t(
              `Your current ${subscription} plan is active until ${subscriptionEndDate.toLocaleDateString()}`,
              `اشتراكك الحالي في خطة ${subscription === 'pro' ? 'الاحترافية' : 'الأعمال'} نشط حتى ${subscriptionEndDate.toLocaleDateString()}`
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`border rounded-lg overflow-hidden ${
              plan.current 
                ? "border-green-500 shadow-lg relative transform hover:scale-105 transition-transform duration-300" 
                : plan.popular 
                  ? "border-qrito-purple shadow-lg relative transform hover:scale-105 transition-transform duration-300" 
                  : "border-gray-200 hover:shadow-md transition-shadow duration-300"
            }`}
          >
            {plan.popular && !plan.current && (
              <div className="absolute top-0 right-0 bg-qrito-purple text-white text-xs font-bold px-3 py-1 rounded-bl">
                {t("Popular", "الأكثر شيوعًا")}
              </div>
            )}
            {plan.current && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl">
                {t("Current Plan", "الخطة الحالية")}
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{plan.tagline}</p>
              <div className="mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">/ {plan.period}</span>
              </div>
              
              {plan.trialText && !plan.current && (
                <div className="mb-4 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs inline-block">
                  {plan.trialText}
                </div>
              )}
              
              <p className="text-gray-600 mb-6 text-sm">{plan.description}</p>
              <Button 
                className={`w-full ${
                  plan.buttonVariant === "default" 
                    ? plan.current 
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-qrito-purple hover:bg-qrito-purple-dark" 
                    : "border-qrito-purple text-qrito-purple hover:bg-qrito-background"
                } transition-all duration-300`}
                variant={plan.buttonVariant === "default" ? "default" : "outline"}
                onClick={() => handlePlanSelection(plan.planId)}
                disabled={plan.current}
              >
                {plan.buttonText}
              </Button>
              
              {plan.current && subscriptionEndDate && subscription !== 'free' && (
                <div className="mt-2 text-xs text-center text-gray-500">
                  {t(
                    `Active until ${subscriptionEndDate.toLocaleDateString()}`,
                    `نشط حتى ${subscriptionEndDate.toLocaleDateString()}`
                  )}
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 p-6">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-qrito-purple flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
