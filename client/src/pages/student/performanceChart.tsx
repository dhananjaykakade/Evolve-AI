"use client"

import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts"

import { Card } from "@/components/ui/card"

interface PerformanceData {
  date: string
  score: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
  isDarkMode: boolean
}

export function PerformanceChart({ data, isDarkMode }: PerformanceChartProps) {
  // Colors based on theme
  const gridColor = isDarkMode ? "#333" : "#eee"
  const textColor = isDarkMode ? "#ccc" : "#666"
  const gradientStart = isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"
  const gradientEnd = isDarkMode ? "rgba(59, 130, 246, 0)" : "rgba(59, 130, 246, 0)"
  const strokeColor = "#3b82f6" // Primary blue

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientStart} stopOpacity={0.8} />
            <stop offset="95%" stopColor={gradientEnd} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey="date" 
          tick={{ fill: textColor }} 
          tickLine={{ stroke: textColor }}
          axisLine={{ stroke: gridColor }}
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fill: textColor }} 
          tickLine={{ stroke: textColor }}
          axisLine={{ stroke: gridColor }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 shadow-lg border">
                  <p className="font-medium">{label}</p>
                  <p className="text-primary font-bold">
                    Score: {payload[0].value}
                  </p>
                </Card>
              )
            }
            return null
          }}
        />
        <Area 
          type="monotone" 
          dataKey="score" 
          stroke={strokeColor} 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#scoreGradient)" 
          activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
