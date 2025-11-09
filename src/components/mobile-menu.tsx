"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <>
      {/* Burger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
              onClick={toggleMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              style={{
                position: "fixed",
                top: "80px",
                right: 0,
                bottom: 0,
                width: "280px",
                backgroundColor: "#fff",
                borderLeft: "1px solid #e5e7eb",
                boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
                zIndex: 70,
                overflowY: "auto",
              }}
              className="lg:hidden"
            >
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  padding: "24px",
                }}
              >
                {/* Navigation Links */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    marginBottom: "32px",
                  }}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={toggleMenu}
                      style={{
                        fontSize: "18px",
                        fontWeight: 500,
                        color: "#111827",
                        padding: "8px 0",
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    onClick={toggleMenu}
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button className="w-full" asChild onClick={toggleMenu}>
                    <Link href="/signup">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
