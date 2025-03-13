"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface ProgressDashboardProps {
  userProfile: {
    name: string
    avatar: string
  }
}

interface Achievement {
  id: string
  text: string
  completed: boolean
}

export function ProgressDashboard({ userProfile }: ProgressDashboardProps) {
  const [moneySaved, setMoneySaved] = useState(0)
  const [savingsPercentage, setSavingsPercentage] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "1", text: "New people met this week: 5", completed: false },
    { id: "2", text: "Events attended: 2", completed: false },
    { id: "3", text: "Rides shared: 3", completed: false },
  ])
  const [newAchievement, setNewAchievement] = useState("")
  const [score, setScore] = useState(0)

  // Add useEffect to initialize money saved and simulate savings
  useEffect(() => {
    // Simulate initial savings
    const initialSavings = Math.floor(Math.random() * 50) + 20 // Random amount between $20 and $70
    setMoneySaved(initialSavings)
    setSavingsPercentage(Math.floor(Math.random() * 30) + 10) // Random percentage between 10% and 40%

    // Simulate periodic savings updates
    const interval = setInterval(() => {
      const additionalSavings = Math.floor(Math.random() * 5) + 1 // Random amount between $1 and $5
      setMoneySaved(prev => prev + additionalSavings)
      setSavingsPercentage(prev => Math.min(prev + Math.floor(Math.random() * 2) + 1, 75)) // Increase percentage, max 75%
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const toggleAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id) {
          const newCompleted = !ach.completed
          setScore((prevScore) => prevScore + (newCompleted ? 1 : -1))
          
          // Add savings when completing an achievement
          if (newCompleted) {
            const achievementBonus = Math.floor(Math.random() * 10) + 5 // Random bonus between $5 and $15
            setMoneySaved(prev => prev + achievementBonus)
            setSavingsPercentage(prev => Math.min(prev + Math.floor(Math.random() * 3) + 1, 75))
          }
          
          return { ...ach, completed: newCompleted }
        }
        return ach
      }),
    )
  }

  const addNewAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements((prev) => [...prev, { id: Date.now().toString(), text: newAchievement, completed: false }])
      setNewAchievement("")
    }
  }

  const learningResources = [
    { title: "5 Tips for Effective Budgeting", link: "#" },
    { title: "How to Start Conversations with New People", link: "#" },
    { title: "Building a Network in a New City", link: "#" },
    { title: "Managing Your Finances as a Student", link: "#" },
  ]

  return (
    <section>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Achievements & Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-zinc-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Money Saved</h3>
            <p className="text-3xl font-bold text-[#CCFF00]">${moneySaved}</p>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
              <span className="text-green-500 font-semibold">{savingsPercentage}% saved</span>
              <span className="text-zinc-400 ml-2">compared to Uber</span>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Achievement Score</h3>
            <p className="text-2xl font-bold text-[#CCFF00]">{score}</p>
          </div>
          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Achievements</h3>
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center">
                <Checkbox
                  id={achievement.id}
                  checked={achievement.completed}
                  onCheckedChange={() => toggleAchievement(achievement.id)}
                  className="mr-2"
                />
                <label
                  htmlFor={achievement.id}
                  className={`text-sm ${achievement.completed ? "line-through text-zinc-500" : "text-white"}`}
                >
                  {achievement.text}
                </label>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <div className="flex">
              <Input
                type="text"
                placeholder="Add new achievement"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                className="flex-grow mr-2 bg-zinc-800 border-zinc-700 text-white"
              />
              <Button onClick={addNewAchievement} className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Learning Resources</h3>
            <ul className="space-y-2">
              {learningResources.map((resource, index) => (
                <li key={index}>
                  <Button variant="link" className="text-[#CCFF00] p-0 h-auto text-left">
                    {resource.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  )
} 