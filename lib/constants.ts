import {
  Zap,
  Github,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Database,
  Globe,
  Cloud,
  Search,
  Mail,
  Terminal,
  Layers,
  CreditCard,
} from "lucide-react";

export const stackServices = [
  {
    id: "stripe",
    name: "Stripe",
    icon: CreditCard,
    placeholder: "sk_live_...",
  },
  { id: "supabase", name: "Supabase", icon: Database, placeholder: "Anon Key" },
  {
    id: "neon",
    name: "Neon DB",
    icon: Database,
    placeholder: "Connection String or API Key",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    placeholder: "Personal Access Token",
  },
  { id: "linear", name: "Linear", icon: CheckCircle2, placeholder: "API Key" },
];
