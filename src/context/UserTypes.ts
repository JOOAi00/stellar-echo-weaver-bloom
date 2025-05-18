
import { Session, User } from '@supabase/supabase-js';

export interface UserContextType {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  subscription: string;
  qrCodesGenerated: number;
  incrementQRCount: () => boolean;
  setUserSubscription: (plan: string) => void;
  subscriptionEndDate: Date | null;
  language: string;
  switchLanguage: (lang: string) => void;
  logout: () => Promise<void>;
  canAddLogo: () => boolean;
  canSubscribe: (plan: string) => boolean;
}
