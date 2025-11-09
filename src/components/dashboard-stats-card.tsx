"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  borderColor: string;
  progress?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
  borderColor,
  progress,
  trend,
}: DashboardStatsCardProps) {
  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${borderColor} overflow-hidden`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {subtitle}
        </p>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-2" />
        )}
        {trend && (
          <div
            className={`text-xs mt-2 flex items-center gap-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
