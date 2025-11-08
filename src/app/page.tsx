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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center bg-background/80 backdrop-blur-lg sticky top-0 z-50 border-b">
        <Link href="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto hidden lg:flex gap-8 mr-8">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="ml-auto lg:ml-0 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" className="shadow-lg" asChild>
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
                    <Zap className="h-3 w-3 mr-1" />
                    AI-Powered Credit Scoring
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Your Financial Passport for the{" "}
                    <span className="text-primary">Informal Economy</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
                    HisaabScore builds your credit score from your everyday
                    financial life. Turn your receipts and mobile money
                    statements into opportunities.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-base shadow-xl" asChild>
                    <Link href="/signup">
                      Get Your Free Score
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base"
                    asChild
                  >
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex flex-col">
                    <div className="text-3xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">
                      Active Users
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">
                      Satisfaction
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-3xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
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
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
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
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <Card className="relative overflow-hidden border-2 hover:border-primary transition-all hover:shadow-xl">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardContent className="pt-8 pb-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <UploadCloud className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Upload Documents</h3>
                  <p className="text-muted-foreground">
                    Snap photos of receipts, or upload utility bills and mobile
                    money statements from your phone.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 hover:border-primary transition-all hover:shadow-xl">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardContent className="pt-8 pb-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                  <p className="text-muted-foreground">
                    Our smart OCR and AI categorize your transactions,
                    identifying income, expenses, and bill payments.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 hover:border-primary transition-all hover:shadow-xl">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardContent className="pt-8 pb-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Receive Your Score</h3>
                  <p className="text-muted-foreground">
                    Get a comprehensive credit score and a detailed report you
                    can share with lenders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-16 md:py-24 lg:py-32 bg-muted/30"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Unlock Your{" "}
                <span className="text-primary">Financial Future</span>
              </h2>
              <p className="max-w-[800px] text-lg text-muted-foreground">
                Everything you need to build credit and access fair financial
                services.
              </p>
            </div>

            {/* Feature 1 */}
            <div className="grid gap-12 lg:grid-cols-2 items-center mb-24 max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="inline-block p-3 bg-primary/10 rounded-2xl">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Seamless Document Upload</h3>
                <p className="text-lg text-muted-foreground">
                  Use your phone's camera or file picker. Our app works online
                  and offline, queuing uploads for when you have a connection.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Camera integration for instant receipt capture
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Offline mode with automatic sync
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Support for multiple file formats
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                <Image
                  src="/heroImage2.svg"
                  width={600}
                  height={500}
                  alt="Document Upload"
                  className="relative w-full h-auto rounded-2xl"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid gap-12 lg:grid-cols-2 items-center mb-24 max-w-6xl mx-auto">
              <div className="order-2 lg:order-1 relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                <Image
                  src="/heroImage3.svg"
                  width={600}
                  height={500}
                  alt="Credit Reports"
                  className="relative w-full h-auto rounded-2xl"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <div className="inline-block p-3 bg-primary/10 rounded-2xl">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Bank-Ready PDF Reports</h3>
                <p className="text-lg text-muted-foreground">
                  Generate professional, detailed credit reports to share with
                  lenders and financial institutions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Professional PDF format accepted by banks
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Secure sharing with time-limited links
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Optional password protection
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="inline-block p-3 bg-primary/10 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Holistic Credit Scoring</h3>
                <p className="text-lg text-muted-foreground">
                  Our algorithm looks beyond traditional metrics, considering
                  income consistency, expense management, and financial
                  discipline.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      AI-powered transaction categorization
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Real-time score updates
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Personalized improvement tips
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                <Image
                  src="/heroImage.svg"
                  width={600}
                  height={500}
                  alt="Credit Scoring"
                  className="relative w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Trusted by <span className="text-primary">Entrepreneurs</span>{" "}
                and Freelancers
              </h2>
              <p className="max-w-[800px] text-lg text-muted-foreground">
                See how HisaabScore is helping people in the informal sector
                unlock financial opportunities.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <Card className="border-2 hover:border-primary transition-all">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">FS</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Fatima S.</div>
                      <div className="text-sm text-muted-foreground">
                        Small Shop Owner
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "For the first time, I could show a bank my real income.
                    HisaabScore helped me get a loan to expand my shop."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">AK</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Ahmed K.</div>
                      <div className="text-sm text-muted-foreground">
                        Delivery Rider & Freelancer
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "As a freelancer, my income is irregular. HisaabScore
                    understood this and gave me a fair score that I used to get
                    a new motorcycle."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">ZH</span>
                    </div>
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
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary to-primary/80">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8 text-primary-foreground">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-3xl">
                Ready to Build Your Credit?
              </h2>
              <p className="text-lg md:text-xl max-w-2xl opacity-90">
                Join thousands of others and take the first step towards a
                better financial future. It's free and takes only 5 minutes.
              </p>
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
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-muted/30">
        <div className="container px-4 md:px-6 py-12 md:py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground max-w-sm">
                Building financial inclusion for the informal economy. Turn your
                everyday transactions into credit opportunities.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Facebook className="h-5 w-5 text-primary" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Twitter className="h-5 w-5 text-primary" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-primary" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                </Link>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-sm text-muted-foreground hover:text-primary"
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
                    className="text-sm text-muted-foreground hover:text-primary"
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
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Accessibility
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Status
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
