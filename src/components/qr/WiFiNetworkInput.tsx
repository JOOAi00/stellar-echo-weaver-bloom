
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { WifiHigh } from 'lucide-react';

interface WiFiNetworkInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Special input component for WiFi network QR codes
 */
const WiFiNetworkInput = ({ value, onChange }: WiFiNetworkInputProps) => {
  const { language } = useUser();
  
  // Parse existing value if available
  const [networkName, setNetworkName] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  
  // Parse existing value on mount
  useEffect(() => {
    if (value) {
      try {
        // Try to parse existing WiFi string
        // Format: WIFI:S:SSID;T:WPA;P:password;H:true;;
        const ssidMatch = value.match(/S:(.*?);/);
        const typeMatch = value.match(/T:(.*?);/);
        const passMatch = value.match(/P:(.*?);/);
        const hiddenMatch = value.match(/H:(.*?);/);
        
        if (ssidMatch && ssidMatch[1]) setNetworkName(ssidMatch[1]);
        if (typeMatch && typeMatch[1]) setEncryption(typeMatch[1]);
        if (passMatch && passMatch[1]) setPassword(passMatch[1]);
        if (hiddenMatch && hiddenMatch[1]) setHidden(hiddenMatch[1].toLowerCase() === 'true');
      } catch (error) {
        console.error("Error parsing WiFi value:", error);
      }
    }
  }, []);
  
  // Generate WiFi string when values change
  useEffect(() => {
    const wifiString = `WIFI:S:${networkName};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`;
    onChange(wifiString);
  }, [networkName, password, encryption, hidden]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center p-2 mb-2">
        <WifiHigh className="text-purple-600" size={28} />
        <h3 className="text-md font-medium ml-2">
          {language === "ar" ? "معلومات شبكة WiFi" : "WiFi Network Information"}
        </h3>
      </div>

      <div>
        <Label htmlFor="network-name" className="text-sm font-medium mb-2 block">
          {language === "ar" ? "اسم الشبكة (SSID)" : "Network Name (SSID)"}
        </Label>
        <Input
          id="network-name"
          value={networkName}
          onChange={(e) => setNetworkName(e.target.value)}
          placeholder={language === "ar" ? "أدخل اسم شبكة WiFi" : "Enter WiFi network name"}
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="encryption-type" className="text-sm font-medium mb-2 block">
          {language === "ar" ? "نوع التشفير" : "Encryption Type"}
        </Label>
        <Select value={encryption} onValueChange={setEncryption}>
          <SelectTrigger id="encryption-type">
            <SelectValue placeholder={language === "ar" ? "اختر نوع التشفير" : "Select encryption type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">{language === "ar" ? "بدون تشفير" : "No Encryption"}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {encryption !== "nopass" && (
        <div>
          <Label htmlFor="password" className="text-sm font-medium mb-2 block">
            {language === "ar" ? "كلمة المرور" : "Password"}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter password"}
            className="w-full"
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch 
          id="hidden-network" 
          checked={hidden} 
          onCheckedChange={setHidden} 
        />
        <Label htmlFor="hidden-network" className="text-sm">
          {language === "ar" ? "شبكة مخفية" : "Hidden Network"}
        </Label>
      </div>
    </div>
  );
};

export default WiFiNetworkInput;
