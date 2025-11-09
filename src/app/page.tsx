"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  UploadCloud,
  BarChart3,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Bot,
  X,
  Send,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/components/loading-screen";
import { motion } from "framer-motion";
import {
  fadeInDown,
  fadeInUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  smoothTransition,
  staggerContainer,
  useMotionPreferences,
  getReducedMotionTransition,
} from "@/lib/animations";
import { FloatingElement } from "@/components/floating-element";
import { ParallaxBackground } from "@/components/parallax-background";
import { AnimatedSection } from "@/components/animated/animated-section";
import { AnimatedCard } from "@/components/animated/animated-card";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "bot"; content: string }>
  >([
    {
      role: "bot",
      content:
        "Hi! 👋 I'm here to help you learn about HisaabScore. Ask me anything!",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useMotionPreferences();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Handle initial page load
  useEffect(() => {
    // Simulate loading time (in production, this would wait for actual resources)
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Complete loading within 1000ms as per requirements

    return () => clearTimeout(loadTimer);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const suggestedQuestions = [
    { icon: "💳", text: "How does HisaabScore work?" },
    { icon: "📊", text: "What documents can I upload?" },
    { icon: "🔒", text: "Is my data secure?" },
    { icon: "💰", text: "How much does it cost?" },
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("how") &&
      (lowerMessage.includes("work") || lowerMessage.includes("does"))
    ) {
      return "HisaabScore builds your credit score from everyday transactions! 📱 Simply upload receipts, bills, and mobile money statements. Our AI analyzes them to create a comprehensive credit score that you can share with lenders. It's designed specifically for people in the informal economy who don't have traditional credit history.";
    } else if (
      lowerMessage.includes("document") ||
      lowerMessage.includes("upload")
    ) {
      return "You can upload various documents! 📄 We accept receipts, utility bills, mobile money statements, rent payments, and more. Just snap a photo with your phone or upload PDFs. Our OCR technology automatically extracts transaction data. The more documents you upload, the more accurate your credit score becomes!";
    } else if (
      lowerMessage.includes("secure") ||
      lowerMessage.includes("safe") ||
      lowerMessage.includes("privacy")
    ) {
      return "Your security is our top priority! 🔒 We use bank-level encryption to protect your data. All documents are stored securely, and you control who sees your information. We never share your data without your explicit permission. You can also set password protection on shared reports.";
    } else if (
      lowerMessage.includes("cost") ||
      lowerMessage.includes("price") ||
      lowerMessage.includes("free")
    ) {
      return "Getting started is completely FREE! 🎉 You can create an account, upload documents, and get your credit score at no cost. We believe everyone deserves access to financial services. Premium features for advanced analytics are available, but the core service is always free.";
    } else if (
      lowerMessage.includes("credit score") ||
      lowerMessage.includes("score")
    ) {
      return "Your credit score is calculated using AI! 🤖 We analyze income consistency, expense management, bill payment history, and financial growth. Unlike traditional scores, we understand irregular income patterns common in the informal economy. Scores range from 300-850, and you'll get personalized tips to improve yours!";
    } else if (
      lowerMessage.includes("start") ||
      lowerMessage.includes("sign up") ||
      lowerMessage.includes("begin")
    ) {
      return "Getting started is easy! ✨ Click the 'Get Started' button above to create your free account. It takes just 5 minutes. After signing up, you can immediately start uploading documents. You'll see your credit score as soon as we've analyzed your first few transactions!";
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support")
    ) {
      return "I'm here to help! 💬 You can ask me about how HisaabScore works, what documents to upload, pricing, security, or anything else. If you need human support, our team is available 24/7 at support@hisaabscore.com or through the contact form in the footer.";
    } else if (
      lowerMessage.includes("financial passport") ||
      (lowerMessage.includes("what is") &&
        (lowerMessage.includes("financial passport") ||
          lowerMessage.includes("passport") ||
          lowerMessage.includes("hisaabscore")))
    ) {
      return "A Financial Passport is your digital credit identity! 🎫 HisaabScore creates this by analyzing your everyday transactions - receipts, bills, and mobile money. It proves your financial reliability to lenders, even without traditional bank history. Think of it as your ticket to loans, credit, and better financial opportunities!";
    } else if (
      lowerMessage.includes("informal economy") ||
      lowerMessage.includes("informal sector")
    ) {
      return "The informal economy includes workers and businesses that aren't formally registered or regulated - like street vendors, freelancers, home-based businesses, and gig workers. 🏪 These people often struggle to access traditional banking and credit because they don't have formal employment records. That's exactly who HisaabScore is designed to help!";
    } else {
      return "That's a great question! 🌟 HisaabScore helps people in the informal economy build credit from everyday transactions. You can upload receipts and bills to create a credit score that lenders actually recognize. Want to know more about our features, pricing, or how to get started?";
    }
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || chatMessage.trim();
    if (!textToSend) return;

    setChatMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setChatMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(textToSend);
      setChatMessages((prev) => [...prev, { role: "bot", content: response }]);
      setIsTyping(false);
    }, 800);
  };
  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div
        className={`flex flex-col min-h-screen ${
          isLoading ? "page-loading" : "page-loaded"
        }`}
      >
        {/* Header */}
        <motion.header
          className="px-4 lg:px-6 h-20 flex items-center bg-background/80 backdrop-blur-lg sticky top-0 z-50 border-b"
          initial="initial"
          animate="animate"
          variants={fadeInDown}
          transition={getReducedMotionTransition(prefersReducedMotion, {
            duration: 0.3,
            ease: "easeOut",
          })}
        >
          <Link href="/" className="flex items-center justify-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="ml-auto hidden lg:flex gap-8 mr-8">
            <motion.div
              style={{ borderRadius: "1rem", overflow: "hidden" }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.2,
              })}
            >
              <Link
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Features
              </Link>
            </motion.div>
            <motion.div
              style={{ borderRadius: "1rem", overflow: "hidden" }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.2,
              })}
            >
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                How It Works
              </Link>
            </motion.div>
            <motion.div
              style={{ borderRadius: "1", overflow: "hidden" }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.2,
              })}
            >
              <Link
                href="#testimonials"
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Testimonials
              </Link>
            </motion.div>
            <motion.div
              style={{ borderRadius: "1rem", overflow: "hidden" }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.2,
              })}
            >
              <Link
                href="#pricing"
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Pricing
              </Link>
            </motion.div>
          </nav>

          {/* Desktop Actions */}
          <div className="ml-auto lg:ml-0 hidden lg:flex items-center gap-3">
            <motion.div
              style={{ borderRadius: "1rem", overflow: "hidden" }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.2,
              })}
            >
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </motion.div>
            <motion.div
              style={{ borderRadius: "1rem", overflow: "hidden" }}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                    }
              }
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.2,
              })}
            >
              <Button size="sm" className="shadow-lg" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="ml-auto flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </motion.header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-0 right-0 z-50 lg:hidden bg-background border-b shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <nav className="container px-4 py-6 flex flex-col gap-4">
                <Link
                  href="#features"
                  className="text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
            {/* Parallax Background Gradient */}
            <ParallaxBackground speed={0.5} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-b from-background to-muted/20" />
            </ParallaxBackground>

            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                {/* Left Column - Text Content with Staggered Animations */}
                <motion.div
                  className="flex flex-col justify-center space-y-8"
                  initial="initial"
                  animate={isLoading ? "initial" : "animate"}
                  variants={staggerContainer}
                >
                  <div className="space-y-6">
                    {/* Badge - First element (delay: 0ms) */}
                    <motion.div
                      variants={scaleIn}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4, ease: "easeOut" }
                      )}
                    >
                      <Badge className="w-fit bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20">
                        <Zap className="h-3 w-3 mr-1" />
                        AI-Powered Credit Scoring
                      </Badge>
                    </motion.div>

                    {/* Heading - Second element (delay: 100ms via stagger) */}
                    <motion.h1
                      className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.5, ease: "easeOut" }
                      )}
                    >
                      Your Financial Passport for the{" "}
                      <span className="text-primary">Informal Economy</span>
                    </motion.h1>

                    {/* Description - Third element (delay: 200ms via stagger) */}
                    <motion.p
                      className="text-lg md:text-xl text-muted-foreground max-w-[600px]"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.5, ease: "easeOut" }
                      )}
                    >
                      HisaabScore builds your credit score from your everyday
                      financial life. Turn your receipts and mobile money
                      statements into opportunities.
                    </motion.p>
                  </div>

                  {/* Buttons - Fourth element (delay: 300ms via stagger) */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    variants={fadeInUp}
                    transition={getReducedMotionTransition(
                      prefersReducedMotion,
                      { duration: 0.5, ease: "easeOut" }
                    )}
                  >
                    <motion.div
                      style={{ borderRadius: "1rem", overflow: "hidden" }}
                      whileHover={
                        prefersReducedMotion
                          ? {}
                          : {
                              scale: 1.05,
                              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                            }
                      }
                      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.2 }
                      )}
                    >
                      <Button size="lg" className="text-base shadow-xl" asChild>
                        <Link href="/signup">
                          Get Your Free Score
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div
                      style={{ borderRadius: "1rem", overflow: "hidden" }}
                      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.2 }
                      )}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="text-base"
                        asChild
                      >
                        <Link href="#how-it-works">Learn More</Link>
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Statistics Section - Fifth element (delay: 400ms via stagger) with internal stagger */}
                  <motion.div
                    className="flex items-center gap-8 pt-4"
                    variants={scaleIn}
                    transition={getReducedMotionTransition(
                      prefersReducedMotion,
                      { duration: 0.5, ease: "easeOut" }
                    )}
                  >
                    <motion.div
                      className="flex flex-col"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={
                        isLoading
                          ? { opacity: 0, scale: 0.8 }
                          : { opacity: 1, scale: 1 }
                      }
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4, delay: 0.5, ease: "easeOut" }
                      )}
                    >
                      <div className="text-3xl font-bold text-primary">
                        10K+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Users
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex flex-col"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={
                        isLoading
                          ? { opacity: 0, scale: 0.8 }
                          : { opacity: 1, scale: 1 }
                      }
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4, delay: 0.6, ease: "easeOut" }
                      )}
                    >
                      <div className="text-3xl font-bold text-primary">95%</div>
                      <div className="text-sm text-muted-foreground">
                        Satisfaction
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex flex-col"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={
                        isLoading
                          ? { opacity: 0, scale: 0.8 }
                          : { opacity: 1, scale: 1 }
                      }
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4, delay: 0.7, ease: "easeOut" }
                      )}
                    >
                      <div className="text-3xl font-bold text-primary">
                        24/7
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Support
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right Column - Hero Image with Floating Animation */}
                <div className="flex justify-center lg:justify-end">
                  <FloatingElement duration={3} yOffset={15}>
                    <div className="relative w-full max-w-2xl">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                      <Image
                        src="/heroImage.svg"
                        alt="HisaabScore Dashboard"
                        width={700}
                        height={500}
                        className="relative w-full h-auto rounded-2xl"
                        priority
                      />
                    </div>
                  </FloatingElement>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <AnimatedSection variant="fadeInUp" once={true}>
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    How It Works
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Get Your Score in{" "}
                    <span className="text-primary">3 Simple Steps</span>
                  </h2>
                  <p className="max-w-[800px] text-lg text-muted-foreground">
                    Our secure platform makes it easy to build your financial
                    identity from the documents you already have.
                  </p>
                </div>
              </AnimatedSection>
              <motion.div
                className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                {/* Card 1 */}
                <motion.div
                  variants={fadeInUp}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.5,
                    ease: "easeOut",
                  })}
                >
                  <Card className="relative overflow-hidden border-2 hover:border-primary transition-all hover:shadow-xl h-full">
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        {
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: 0.2,
                        }
                      )}
                    >
                      <span className="text-2xl font-bold text-primary">1</span>
                    </motion.div>
                    <CardContent className="pt-8 pb-8 space-y-4">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                        whileHover={
                          prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }
                        }
                        transition={{ duration: 0.2 }}
                      >
                        <UploadCloud className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold">Upload Documents</h3>
                      <p className="text-muted-foreground">
                        Snap photos of receipts, or upload utility bills and
                        mobile money statements from your phone.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  variants={fadeInUp}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.5,
                    ease: "easeOut",
                  })}
                >
                  <Card className="relative overflow-hidden border-2 hover:border-primary transition-all hover:shadow-xl h-full">
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        {
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: 0.3,
                        }
                      )}
                    >
                      <span className="text-2xl font-bold text-primary">2</span>
                    </motion.div>
                    <CardContent className="pt-8 pb-8 space-y-4">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                        whileHover={
                          prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }
                        }
                        transition={{ duration: 0.2 }}
                      >
                        <BarChart3 className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                      <p className="text-muted-foreground">
                        Our smart OCR and AI categorize your transactions,
                        identifying income, expenses, and bill payments.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Card 3 */}
                <motion.div
                  variants={fadeInUp}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.5,
                    ease: "easeOut",
                  })}
                >
                  <Card className="relative overflow-hidden border-2 hover:border-primary transition-all hover:shadow-xl h-full">
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        {
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: 0.4,
                        }
                      )}
                    >
                      <span className="text-2xl font-bold text-primary">3</span>
                    </motion.div>
                    <CardContent className="pt-8 pb-8 space-y-4">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                        whileHover={
                          prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }
                        }
                        transition={{ duration: 0.2 }}
                      >
                        <FileText className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold">Receive Your Score</h3>
                      <p className="text-muted-foreground">
                        Get a comprehensive credit score and a detailed report
                        you can share with lenders.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="w-full py-16 md:py-24 lg:py-32 bg-muted/30"
          >
            <div className="container px-4 md:px-6">
              <AnimatedSection variant="fadeInUp" once={true}>
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Unlock Your{" "}
                    <span className="text-primary">Financial Future</span>
                  </h2>
                  <p className="max-w-[800px] text-lg text-muted-foreground">
                    Everything you need to build credit and access fair
                    financial services.
                  </p>
                </div>
              </AnimatedSection>

              {/* Feature 1 - Slide in from left */}
              <div className="grid gap-12 lg:grid-cols-2 items-center mb-24 max-w-6xl mx-auto">
                <motion.div
                  className="space-y-6"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideInLeft}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.6,
                    ease: "easeOut",
                  })}
                >
                  <motion.div
                    className="inline-block p-3 bg-primary/10 rounded-2xl transition-all duration-300"
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            boxShadow:
                              "0 0 20px rgba(var(--primary-rgb, 59, 130, 246), 0.5)",
                            scale: 1.05,
                          }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <UploadCloud className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">
                    Seamless Document Upload
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Use your phone's camera or file picker. Our app works online
                    and offline, queuing uploads for when you have a connection.
                  </p>
                  <motion.ul
                    className="space-y-3"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                  >
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Camera integration for instant receipt capture
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Offline mode with automatic sync
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Support for multiple file formats
                      </span>
                    </motion.li>
                  </motion.ul>
                </motion.div>
                <motion.div
                  className="relative"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideInRight}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.6,
                    ease: "easeOut",
                  })}
                >
                  <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                  <FloatingElement duration={4} yOffset={12}>
                    <Image
                      src="/heroImage2.svg"
                      width={600}
                      height={500}
                      alt="Document Upload"
                      className="relative w-full h-auto rounded-2xl"
                    />
                  </FloatingElement>
                </motion.div>
              </div>

              {/* Feature 2 - Slide in from right (reversed layout) */}
              <div className="grid gap-12 lg:grid-cols-2 items-center mb-24 max-w-6xl mx-auto">
                <motion.div
                  className="order-2 lg:order-1 relative"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideInLeft}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.6,
                    ease: "easeOut",
                  })}
                >
                  <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                  <FloatingElement duration={4} yOffset={12}>
                    <Image
                      src="/heroImage3.svg"
                      width={600}
                      height={500}
                      alt="Credit Reports"
                      className="relative w-full h-auto rounded-2xl"
                    />
                  </FloatingElement>
                </motion.div>
                <motion.div
                  className="order-1 lg:order-2 space-y-6"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideInRight}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.6,
                    ease: "easeOut",
                  })}
                >
                  <motion.div
                    className="inline-block p-3 bg-primary/10 rounded-2xl transition-all duration-300"
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            boxShadow:
                              "0 0 20px rgba(var(--primary-rgb, 59, 130, 246), 0.5)",
                            scale: 1.05,
                          }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <Shield className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">Bank-Ready PDF Reports</h3>
                  <p className="text-lg text-muted-foreground">
                    Generate professional, detailed credit reports to share with
                    lenders and financial institutions.
                  </p>
                  <motion.ul
                    className="space-y-3"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                  >
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Professional PDF format accepted by banks
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Secure sharing with time-limited links
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Optional password protection
                      </span>
                    </motion.li>
                  </motion.ul>
                </motion.div>
              </div>

              {/* Feature 3 - Slide in from left */}
              <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
                <motion.div
                  className="space-y-6"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideInLeft}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.6,
                    ease: "easeOut",
                  })}
                >
                  <motion.div
                    className="inline-block p-3 bg-primary/10 rounded-2xl transition-all duration-300"
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            boxShadow:
                              "0 0 20px rgba(var(--primary-rgb, 59, 130, 246), 0.5)",
                            scale: 1.05,
                          }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">
                    Holistic Credit Scoring
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Our algorithm looks beyond traditional metrics, considering
                    income consistency, expense management, and financial
                    discipline.
                  </p>
                  <motion.ul
                    className="space-y-3"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                  >
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        AI-powered transaction categorization
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Real-time score updates
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-3"
                      variants={fadeInUp}
                      transition={getReducedMotionTransition(
                        prefersReducedMotion,
                        { duration: 0.4 }
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Personalized improvement tips
                      </span>
                    </motion.li>
                  </motion.ul>
                </motion.div>
                <motion.div
                  className="relative"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideInRight}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.6,
                    ease: "easeOut",
                  })}
                >
                  <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                  <FloatingElement duration={4} yOffset={12}>
                    <Image
                      src="/heroImage4.svg"
                      width={600}
                      height={500}
                      alt="Credit Scoring"
                      className="relative w-full h-auto rounded-2xl"
                    />
                  </FloatingElement>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <AnimatedSection variant="fadeInUp" once={true}>
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Trusted by{" "}
                    <span className="text-primary">Entrepreneurs</span> and
                    Freelancers
                  </h2>
                  <p className="max-w-[800px] text-lg text-muted-foreground">
                    See how HisaabScore is helping people in the informal sector
                    unlock financial opportunities.
                  </p>
                </div>
              </AnimatedSection>
              <motion.div
                className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                {/* Testimonial Card 1 */}
                <motion.div
                  variants={scaleIn}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.5,
                    ease: "easeOut",
                  })}
                >
                  <AnimatedCard hoverScale={1.02} className="h-full">
                    <Card className="border-2 hover:border-primary transition-all hover:shadow-xl h-full">
                      <CardContent className="pt-8 pb-8 space-y-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                            whileHover={
                              prefersReducedMotion
                                ? {}
                                : { scale: 1.1, rotate: 5 }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-xl font-bold text-primary">
                              FS
                            </span>
                          </motion.div>
                          <div className="text-left">
                            <div className="font-semibold">Fatima S.</div>
                            <div className="text-sm text-muted-foreground">
                              Small Shop Owner
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          "For the first time, I could show a bank my real
                          income. HisaabScore helped me get a loan to expand my
                          shop."
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>

                {/* Testimonial Card 2 */}
                <motion.div
                  variants={scaleIn}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.5,
                    ease: "easeOut",
                  })}
                >
                  <AnimatedCard hoverScale={1.02} className="h-full">
                    <Card className="border-2 hover:border-primary transition-all hover:shadow-xl h-full">
                      <CardContent className="pt-8 pb-8 space-y-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                            whileHover={
                              prefersReducedMotion
                                ? {}
                                : { scale: 1.1, rotate: 5 }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-xl font-bold text-primary">
                              AK
                            </span>
                          </motion.div>
                          <div className="text-left">
                            <div className="font-semibold">Ahmed K.</div>
                            <div className="text-sm text-muted-foreground">
                              Delivery Rider & Freelancer
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          "As a freelancer, my income is irregular. HisaabScore
                          understood this and gave me a fair score that I used
                          to get a new motorcycle."
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>

                {/* Testimonial Card 3 */}
                <motion.div
                  variants={scaleIn}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.5,
                    ease: "easeOut",
                  })}
                >
                  <AnimatedCard hoverScale={1.02} className="h-full">
                    <Card className="border-2 hover:border-primary transition-all hover:shadow-xl h-full">
                      <CardContent className="pt-8 pb-8 space-y-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                            whileHover={
                              prefersReducedMotion
                                ? {}
                                : { scale: 1.1, rotate: 5 }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-xl font-bold text-primary">
                              ZH
                            </span>
                          </motion.div>
                          <div className="text-left">
                            <div className="font-semibold">Zainab H.</div>
                            <div className="text-sm text-muted-foreground">
                              Home-based Caterer
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          "The dashboard helped me understand where my money was
                          going. I've improved my score by 150 points in just 3
                          months!"
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary to-primary/80">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-8 text-primary-foreground">
                {/* Heading with scale-in animation (400ms duration) */}
                <motion.h2
                  className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-3xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.4,
                    ease: "easeOut",
                  })}
                >
                  Ready to Build Your Credit?
                </motion.h2>

                {/* Description with slide-up animation (200ms delay) */}
                <motion.p
                  className="text-lg md:text-xl max-w-2xl opacity-90"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 0.9, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.4,
                    delay: 0.2,
                    ease: "easeOut",
                  })}
                >
                  Join thousands of others and take the first step towards a
                  better financial future. It's free and takes only 5 minutes.
                </motion.p>

                {/* Button with pulse animation and enhanced hover effect */}
                <motion.div
                  style={{ borderRadius: "1rem", overflow: "hidden" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={getReducedMotionTransition(prefersReducedMotion, {
                    duration: 0.4,
                    delay: 0.3,
                    ease: "easeOut",
                  })}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.02, 1],
                        }
                  }
                  // Pulse animation with 2s cycle
                  {...(!prefersReducedMotion && {
                    transition: {
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    },
                  })}
                  whileHover={
                    prefersReducedMotion
                      ? { scale: 1.02 }
                      : {
                          scale: 1.08,
                          boxShadow:
                            "0 20px 60px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)",
                        }
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-base shadow-2xl"
                    asChild
                  >
                    <Link href="/signup">
                      Sign Up for Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <AnimatedSection variant="fadeInUp" once={true}>
          <footer className="w-full border-t bg-muted/30">
            <div className="container px-4 md:px-6 py-12 md:py-16">
              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
                {/* Company Info */}
                <div className="lg:col-span-2 space-y-4">
                  <Logo />
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Building financial inclusion for the informal economy. Turn
                    your everyday transactions into credit opportunities.
                  </p>
                  <div className="flex gap-4">
                    <motion.div
                      whileHover={
                        prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href="#"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Facebook className="h-5 w-5 text-primary" />
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={
                        prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href="#"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Twitter className="h-5 w-5 text-primary" />
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={
                        prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href="#"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Linkedin className="h-5 w-5 text-primary" />
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={
                        prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href="#"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Instagram className="h-5 w-5 text-primary" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Product */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Product</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#features"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#how-it-works"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        How It Works
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#pricing"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Company */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Company</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Press Kit
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Legal</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Cookie Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        Security
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-12 pt-8 border-t">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Email</div>
                      <a
                        href="mailto:support@hisaabscore.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        support@hisaabscore.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Phone</div>
                      <a
                        href="tel:+1234567890"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Address</div>
                      <p className="text-sm text-muted-foreground">
                        123 Finance Street, City, Country
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  &copy; 2025 HisaabScore. All rights reserved.
                </p>
                <div className="flex gap-6">
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Sitemap
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Accessibility
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Status
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </AnimatedSection>

        {/* Chatbot Widget */}
        {!isChatOpen ? (
          <motion.div
            style={{ borderRadius: "9999px", overflow: "hidden" }}
            className="fixed bottom-6 right-6 z-50"
            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            transition={getReducedMotionTransition(prefersReducedMotion, {
              duration: 0.2,
            })}
          >
            <Button
              onClick={() => setIsChatOpen(true)}
              size="lg"
              className="h-16 w-16 rounded-full shadow-2xl [&_svg]:size-10"
            >
              <Bot className="!h-8 !w-8" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
            transition={getReducedMotionTransition(prefersReducedMotion, {
              duration: 0.3,
              ease: "easeOut",
            })}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="w-[400px] h-[600px] shadow-2xl flex flex-col border-0 overflow-hidden rounded-3xl">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-5 bg-primary text-primary-foreground rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary-foreground flex items-center justify-center">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">HisaabScore Assistant</h3>
                    <p className="text-xs opacity-90">Always here to help</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-primary-foreground/20 text-primary-foreground rounded-full [&_svg]:size-4"
                  onClick={() => setIsChatOpen(false)}
                >
                  <X className="!h-4 !w-4" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-background">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      x: prefersReducedMotion
                        ? 0
                        : msg.role === "user"
                        ? 50
                        : -50,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={getReducedMotionTransition(
                      prefersReducedMotion,
                      {
                        duration: 0.2,
                        ease: "easeOut",
                      }
                    )}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`rounded-3xl px-4 py-3 max-w-[75%] shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-md"
                          : "bg-muted rounded-tl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary-foreground">
                          You
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={getReducedMotionTransition(
                      prefersReducedMotion,
                      {
                        duration: 0.2,
                      }
                    )}
                    className="flex gap-3"
                  >
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="rounded-3xl rounded-tl-md px-4 py-3 bg-muted">
                      <div className="flex gap-1.5">
                        <div
                          className={`h-2 w-2 rounded-full bg-primary/60 ${
                            prefersReducedMotion
                              ? "opacity-60"
                              : "animate-bounce"
                          }`}
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className={`h-2 w-2 rounded-full bg-primary/60 ${
                            prefersReducedMotion
                              ? "opacity-60"
                              : "animate-bounce"
                          }`}
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className={`h-2 w-2 rounded-full bg-primary/60 ${
                            prefersReducedMotion
                              ? "opacity-60"
                              : "animate-bounce"
                          }`}
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggested Questions */}
                {chatMessages.length === 1 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={getReducedMotionTransition(
                      prefersReducedMotion,
                      {
                        duration: 0.5,
                      }
                    )}
                    className="space-y-3 pt-2"
                  >
                    <p className="text-xs text-muted-foreground text-center font-medium">
                      Quick questions:
                    </p>
                    <div className="grid gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <motion.button
                          key={index}
                          initial={{
                            opacity: 0,
                            y: prefersReducedMotion ? 0 : 10,
                          }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={getReducedMotionTransition(
                            prefersReducedMotion,
                            {
                              duration: 0.3,
                              delay: prefersReducedMotion ? 0 : index * 0.1,
                            }
                          )}
                          onClick={() => handleSendMessage(question.text)}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-muted hover:bg-primary/10 hover:border-primary border border-transparent transition-all text-left group"
                        >
                          <span className="text-base">{question.icon}</span>
                          <span className="text-xs group-hover:text-primary transition-colors">
                            {question.text}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-5 border-t bg-background rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask me anything..."
                    className="flex-1 h-11 rounded-full px-4 bg-muted border-0 text-sm"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    size="icon"
                    disabled={!chatMessage.trim() || isTyping}
                    className="h-11 w-11 rounded-full [&_svg]:size-4"
                  >
                    <Send className="!h-4 !w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
}
