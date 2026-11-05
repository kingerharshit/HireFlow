import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Sparkles } from "lucide-react"

function App() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-900">
      <Card className="w-full max-w-lg rounded-xl shadow-md border bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Badge variant="default" className="px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Milestone 6.2 — Styling Foundation
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-blue-600">
            HireFlow
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            AI-Powered Recruitment &amp; Applicant Tracking SaaS Platform
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Styled Input Field
            </label>
            <Input
              type="text"
              defaultValue="Tailwind CSS + Shadcn UI Foundation Active"
              readOnly
              className="bg-slate-50 border-slate-300 text-slate-800 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Shadcn Button Component
            </label>
            <div className="flex gap-2">
              <Button variant="default" className="flex-1 font-medium shadow flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Verified Active
              </Button>
              <Button variant="outline" className="font-medium shadow-sm">
                Secondary
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center text-xs text-slate-500 border-t pt-4">
          <span>React 19 • Vite 6</span>
          <span className="font-medium text-slate-700">
            bg-slate-100 • text-blue-600 • rounded-xl • shadow-md
          </span>
        </CardFooter>
      </Card>
    </main>
  )
}

export default App
