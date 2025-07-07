import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Sparkles, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Star,
  Play,
  Award,
  Globe,
  Clock,
  MessageCircle,
  Mail,
  Phone,
  Building2,
  Rocket,
  Target,
  BarChart3,
  Layers,
  Lock,
  Smartphone
} from "lucide-react";

// Mock data for the landing page
export const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Process workflows 10x faster with our optimized automation engine powered by advanced AI algorithms."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption, SOC 2 compliance, and advanced threat protection."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Seamless real-time collaboration with advanced permission controls and activity tracking."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Advanced Analytics",
    description: "Deep insights and actionable analytics to optimize your workflows and boost productivity."
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Smart Integrations",
    description: "Connect with 500+ tools and platforms through our intelligent integration ecosystem."
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Mobile Ready",
    description: "Full-featured mobile experience with offline capabilities and push notifications."
  }
];


export const stats = [
  { icon: <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "50K+", label: "Active Users" },
  { icon: <Globe className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "120+", label: "Countries" },
  { icon: <Award className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "99.9%", label: "Uptime" },
  { icon: <TrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "4.8", label: "Rating" }
];

export const testimonials = [
  {
    content: "This platform transformed our entire workflow. We're now 3x more productive and our team loves using it every day.",
    name: "Sarah Johnson",
    role: "Head of Operations, TechCorp",
    avatar: "SJ",
    rating: 5
  },
  {
    content: "The automation features are incredible. We've saved hundreds of hours and eliminated manual errors completely.",
    name: "Michael Chen",
    role: "CEO, StartupXYZ",
    avatar: "MC",
    rating: 5
  },
  {
    content: "Best investment we've made for our business. The ROI was apparent within the first month of implementation.",
    name: "Emily Rodriguez",
    role: "Director, GlobalTech",
    avatar: "ER",
    rating: 5
  }
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 10 team members",
      "Basic workflow automation",
      "Email support",
      "5GB storage",
      "Mobile app access"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$89",
    period: "/month",
    description: "Ideal for growing businesses",
    features: [
      "Up to 50 team members",
      "Advanced automation",
      "Priority support",
      "50GB storage",
      "API access",
      "Custom integrations"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited team members",
      "Enterprise features",
      "24/7 dedicated support",
      "Unlimited storage",
      "On-premise deployment",
      "Custom SLA"
    ],
    popular: false
  }
];

export const partners = [
  { name: "Microsoft", logo: "MS" },
  { name: "Google", logo: "GG" },
  { name: "Amazon", logo: "AWS" },
  { name: "Salesforce", logo: "SF" },
  { name: "Slack", logo: "SL" },
  { name: "Zoom", logo: "ZM" },
  { name: "Notion", logo: "NT" },
  { name: "Stripe", logo: "ST" }
];
