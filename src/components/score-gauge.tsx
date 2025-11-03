"use client";
import React, { useEffect, useState } from "react";

type ScoreGaugeProps = {
  value: number;
  max?: number;
};

export function ScoreGauge({ value, max = 1000 }: ScoreGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [grade, setGrade] = useState("D");
  const [scoreColor, setScoreColor] = useState("#ef4444");

  // Animate the value
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startValue = animatedValue;
    const targetValue = Math.min(Math.max(value, 0), max); // Clamp between 0 and max

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
      
      setAnimatedValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, max, animatedValue]);

  // Update grade and color based on credit score ranges (A-D system)
  useEffect(() => {
    if (value >= 800) {
      setGrade("A");
      setScoreColor("#10b981"); // green-500 - Excellent, Very low risk
    } else if (value >= 700) {
      setGrade("B+");
      setScoreColor("#22c55e"); // green-400 - Good, Low risk
    } else if (value >= 600) {
      setGrade("B");
      setScoreColor("#eab308"); // yellow-500 - Fair, Moderate risk
    } else if (value >= 500) {
      setGrade("C");
      setScoreColor("#f97316"); // orange-500 - Needs improvement, Higher risk
    } else {
      setGrade("D");
      setScoreColor("#ef4444"); // red-500 - Poor, High risk
    }
  }, [value]);

  const circumference = 2 * Math.PI * 52;
  const percentage = Math.min(Math.max(animatedValue / max, 0), 1);
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative w-full max-w-[200px] aspect-square mx-auto">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          className="text-muted/20"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-1000 ease-out"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={scoreColor}
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline text-foreground">
          {Math.round(animatedValue)}
        </span>
        <span
          className="text-sm sm:text-base lg:text-lg font-semibold"
          style={{ color: scoreColor }}
        >
          Grade {grade}
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          out of {max}
        </span>
      </div>
    </div>
  );
}
