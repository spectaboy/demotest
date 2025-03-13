"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"

interface EarningsSpendingOverviewProps {
  userType: "driver" | "rider"
}

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const generateRandomPercentage = () => {
  return (Math.random() * 20 - 10).toFixed(1) // Random number between -10 and 10
}

export function EarningsSpendingOverview({ userType }: EarningsSpendingOverviewProps) {
  const isDriver = userType === "driver"
  const title = isDriver ? "Earnings Overview" : "Spending Overview"
  const currency = "$"

  const [data] = useState({
    week: {
      amount: isDriver ? generateRandomNumber(200, 300) : generateRandomNumber(50, 100),
      percentage: generateRandomPercentage(),
      ridesCompleted: generateRandomNumber(8, 15),
    },
    month: {
      amount: isDriver ? generateRandomNumber(800, 1200) : generateRandomNumber(200, 400),
      percentage: generateRandomPercentage(),
      ridesCompleted: generateRandomNumber(35, 50),
    },
    year: {
      amount: isDriver ? generateRandomNumber(10000, 15000) : generateRandomNumber(2400, 4800),
      percentage: generateRandomPercentage(),
      ridesCompleted: generateRandomNumber(420, 540),
    },
  })

  const renderAnalytics = (period: "week" | "month" | "year") => (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="bg-zinc-800 p-4 rounded-lg">
        <p className="text-sm font-medium text-zinc-400">Rides Completed</p>
        <p className="text-2xl font-bold text-white">{data[period].ridesCompleted}</p>
      </div>
      <div className="bg-zinc-800 p-4 rounded-lg">
        <p className="text-sm font-medium text-zinc-400">Total Passengers</p>
        <p className="text-2xl font-bold text-white">
          {generateRandomNumber(data[period].ridesCompleted, data[period].ridesCompleted * 2)}
        </p>
      </div>
      <div className="bg-zinc-800 p-4 rounded-lg">
        <p className="text-sm font-medium text-zinc-400">Average Rating</p>
        <p className="text-2xl font-bold text-white">{(4 + Math.random()).toFixed(1)}</p>
      </div>
      <div className="bg-zinc-800 p-4 rounded-lg">
        <p className="text-sm font-medium text-zinc-400">Total Hours</p>
        <p className="text-2xl font-bold text-white">
          {generateRandomNumber(data[period].ridesCompleted * 0.5, data[period].ridesCompleted * 1.5)}
        </p>
      </div>
    </div>
  )

  const renderFinancialLiteracy = () => (
    <Card className="mt-6 bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold">Financial Literacy & Personal Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <Button variant="link" className="text-[#CCFF00] p-0 h-auto text-left">
              Learn how to invest your earnings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-[#CCFF00] p-0 h-auto text-left">
              Open a Tax-Free Savings Account (TFSA) <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-[#CCFF00] p-0 h-auto text-left">
              Understand Registered Retirement Savings Plan (RRSP) <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-[#CCFF00] p-0 h-auto text-left">
              Tips for budgeting and saving <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-[#CCFF00] p-0 h-auto text-left">
              Improve your communication skills <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  )

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
            <TabsTrigger
              value="week"
              className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
            >
              This Month
            </TabsTrigger>
            <TabsTrigger
              value="year"
              className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
            >
              This Year
            </TabsTrigger>
          </TabsList>
          {(Object.keys(data) as Array<"week" | "month" | "year">).map((key) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div>
                <p className="text-4xl font-extrabold text-[#CCFF00]">
                  {currency}
                  {data[key].amount}
                </p>
                <div className="flex items-center mt-2">
                  <p className="text-sm text-zinc-400">
                    {isDriver ? "Earned" : "Spent"} this {key}
                  </p>
                  <span
                    className={`ml-2 flex items-center ${
                      Number(data[key].percentage) >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {Number(data[key].percentage) >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Number(data[key].percentage) >= 0 ? "+" : ""}
                    {data[key].percentage}%
                  </span>
                </div>
              </div>
              {isDriver && renderAnalytics(key)}
            </TabsContent>
          ))}
        </Tabs>
        {isDriver && renderFinancialLiteracy()}
      </CardContent>
    </Card>
  )
}

