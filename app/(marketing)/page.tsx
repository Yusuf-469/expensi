"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  Users,
  Receipt,
  ArrowRight,
  Check,
  Globe,
  Bell,
  PieChart,
  Shield,
  Zap,
  Heart,
  Star,
  Smartphone,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Share2,
  Download,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Receipt,
    title: "Smart Splitting",
    description: "Equal, exact, or percentage splits. Handle any scenario with ease.",
    color: "#1D9C5A",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Support for USD, EUR, GBP, JPY, INR and more. Travel-friendly.",
    color: "#3B82F6",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Gentle nudges to keep balances settled without awkwardness.",
    color: "#F97316",
  },
  {
    icon: PieChart,
    title: "Visual Analytics",
    description: "See where your money goes with beautiful charts and insights.",
    color: "#8B5CF6",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is encrypted and secure. Privacy is our priority.",
    color: "#EF4444",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Add expenses in seconds. No more spreadsheet headaches.",
    color: "#EAB308",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a Group",
    description: "Start a group for your trip, apartment, or event.",
  },
  {
    number: "02",
    title: "Add Expenses",
    description: "Snap a receipt or quickly add expenses on the go.",
  },
  {
    number: "03",
    title: "Settle Up",
    description: "See who owes what and settle with one tap.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Travel Enthusiast",
    content: "Expensi made splitting costs on our 3-week Europe trip so easy. No more awkward money talks!",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Mike Johnson",
    role: "Roommate",
    content: "Finally, an app that handles our shared apartment expenses without the drama. Love it!",
    avatar: "MJ",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Event Planner",
    content: "Used it for my sister's bachelorette party. Everyone paid exactly what they owed. Perfect!",
    avatar: "ED",
    rating: 5,
  },
];

const stats = [
  { value: 2, suffix: "M+", label: "Active Users", icon: Users },
  { value: 500, suffix: "M+", label: "Expenses Tracked", icon: Receipt },
  { value: 4.9, suffix: "", label: "App Store Rating", icon: Star },
  { value: 150, suffix: "+", label: "Countries", icon: Globe },
];

// Interactive Demo Component
function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const demoSteps = [
    { title: "Add Expense", description: "Quickly add expenses with smart categorization" },
    { title: "Split Bill", description: "Choose equal, exact, or percentage splits" },
    { title: "Track Balance", description: "See who owes what in real-time" },
    { title: "Settle Up", description: "One-tap payments to clear debts" },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % demoSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
      {/* Demo Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setStep(0)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {step === 0 && (
          <div className="space-y-3">
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center px-4">
              <span className="text-slate-400">Dinner at Italian Place</span>
            </div>
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center px-4">
              <span className="text-slate-400">$85.50</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Food</Badge>
              <Badge variant="secondary">Group: Roommates</Badge>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <span>You</span>
              <span className="font-semibold">$28.50</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <span>Sarah</span>
              <span className="font-semibold">$28.50</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <span>Mike</span>
              <span className="font-semibold">$28.50</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-green-600">+$142.50</p>
              <p className="text-sm text-green-600">3 people owe you</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-700 rounded text-center">
                <p className="text-xs text-muted-foreground">Sarah</p>
                <p className="font-semibold text-green-600">$45</p>
              </div>
              <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-700 rounded text-center">
                <p className="text-xs text-muted-foreground">Mike</p>
                <p className="font-semibold text-green-600">$52.50</p>
              </div>
              <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-700 rounded text-center">
                <p className="text-xs text-muted-foreground">Emma</p>
                <p className="font-semibold text-green-600">$45</p>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-semibold mb-2">Settle up with Sarah</p>
              <p className="text-2xl font-bold text-blue-600">$45.00</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline">Cash</Button>
              <Button size="sm" className="bg-[#1D9C5A]">PayPal</Button>
              <Button size="sm" variant="outline">Venmo</Button>
              <Button size="sm" variant="outline">Card</Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Progress */}
      <div className="flex gap-2 mt-6">
        {demoSteps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i === step ? "bg-[#1D9C5A]" : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Step Info */}
      <div className="mt-4 text-center">
        <p className="font-semibold">{demoSteps[step].title}</p>
        <p className="text-sm text-muted-foreground">{demoSteps[step].description}</p>
      </div>
    </div>
  );
}

// Animated Counter Component
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = value * easeOut;
      setDisplayValue(value < 10 ? parseFloat(currentValue.toFixed(1)) : Math.round(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

// Floating Card Component
function FloatingCard({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#1D9C5A] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D9C5A] via-[#157A46] to-[#0d5c35] overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white mb-8 cursor-pointer hover:bg-white/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Now with AI-Powered Insights</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Split bills
            <br />
            <span className="text-emerald-200">without the drama</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            The easiest way to track expenses with friends, roommates, and groups.
            No more awkward IOUs or forgotten debts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-[#1D9C5A] hover:bg-white/90 px-8 py-6 text-lg font-semibold group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex items-center justify-center gap-6 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2 cursor-pointer hover:border-white/50 transition-colors"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <Badge className="mb-4 bg-[#1D9C5A]/10 text-[#1D9C5A] hover:bg-[#1D9C5A]/20">
                Interactive Demo
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                See how easy it is
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Watch how Expensi simplifies expense tracking in just a few taps.
                From adding expenses to settling up, everything is designed to be intuitive.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Receipt, text: "Add expenses in seconds" },
                  { icon: Users, text: "Split with anyone, anywhere" },
                  { icon: TrendingUp, text: "Track balances in real-time" },
                  { icon: Wallet, text: "Settle up with one tap" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1D9C5A]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#1D9C5A]" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <InteractiveDemo />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StaggerItem key={stat.label}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-[#1D9C5A]" />
                  <div className="text-4xl font-bold mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Three simple steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. You'll be splitting expenses in no time.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <StaggerItem key={step.number}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardContent className="p-8">
                      <motion.div 
                        className="text-6xl font-bold text-[#1D9C5A]/10 absolute top-4 right-4 group-hover:text-[#1D9C5A]/20 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {step.number}
                      </motion.div>
                      <div className="relative z-10">
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-[#1D9C5A]/10 flex items-center justify-center mb-6 group-hover:bg-[#1D9C5A] transition-colors"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {index === 0 && <Users className="w-6 h-6 text-[#1D9C5A] group-hover:text-white transition-colors" />}
                          {index === 1 && <Receipt className="w-6 h-6 text-[#1D9C5A] group-hover:text-white transition-colors" />}
                          {index === 2 && <Wallet className="w-6 h-6 text-[#1D9C5A] group-hover:text-white transition-colors" />}
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-[#1D9C5A]/10 text-[#1D9C5A] hover:bg-[#1D9C5A]/20">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to make expense splitting effortless.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6">
                      <motion.div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                        style={{ backgroundColor: `${feature.color}15` }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-[#1D9C5A]/10 text-[#1D9C5A] hover:bg-[#1D9C5A]/20">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about Expensi.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={testimonial.name}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-[#1D9C5A]/10 flex items-center justify-center text-[#1D9C5A] font-semibold"
                          whileHover={{ scale: 1.1 }}
                        >
                          {testimonial.avatar}
                        </motion.div>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <Badge className="mb-4 bg-[#1D9C5A]/10 text-[#1D9C5A] hover:bg-[#1D9C5A]/20">
                Mobile App
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Take Expensi anywhere
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Download our mobile app to track expenses on the go. Available on iOS and Android.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-black hover:bg-gray-800">
                    <Smartphone className="mr-2 w-5 h-5" />
                    App Store
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline">
                    <Download className="mr-2 w-5 h-5" />
                    Play Store
                  </Button>
                </motion.div>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1D9C5A]" />
                  <span>Offline mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1D9C5A]" />
                  <span>Push notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1D9C5A]" />
                  <span>Camera scan</span>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 max-w-sm mx-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Balance</p>
                      <p className="text-2xl font-bold text-green-600">+$142.50</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#1D9C5A]/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#1D9C5A]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah", amount: "+$45.00", positive: true },
                      { name: "Mike", amount: "+$52.50", positive: true },
                      { name: "Emma", amount: "+$45.00", positive: true },
                    ].map((person, i) => (
                      <motion.div
                        key={person.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1D9C5A]/10 flex items-center justify-center text-sm font-semibold text-[#1D9C5A]">
                            {person.name[0]}
                          </div>
                          <span className="font-medium">{person.name}</span>
                        </div>
                        <span className={person.positive ? "text-green-600" : "text-red-600"}>
                          {person.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#1D9C5A] via-[#157A46] to-[#0d5c35] relative overflow-hidden">
        {/* Background Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-8"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to split bills without the drama?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join millions of users who trust Expensi for their expense tracking needs.
              It's free to get started.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white text-[#1D9C5A] hover:bg-white/90 px-8 py-6 text-lg font-semibold group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/60 text-sm flex-wrap">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Check className="w-4 h-4" />
                <span>No credit card required</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Check className="w-4 h-4" />
                <span>Free forever</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Check className="w-4 h-4" />
                <span>Cancel anytime</span>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
