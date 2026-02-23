"use client"

import { useEffect, useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

const logEntries = [
  { time: "10:23:45", label: "UPLOAD", message: '3 sources added to "Q1 Research"', color: "bg-blue-500/20 text-blue-400" },
  { time: "10:23:47", label: "PROCESS", message: "Extracting content from earnings-report.pdf...", color: "bg-amber-500/20 text-amber-400" },
  { time: "10:23:50", label: "NOTES", message: "12 key insights generated across 3 sources", color: "bg-[#bd34fe]/20 text-[#bd34fe]" },
  { time: "10:23:52", label: "PODCAST", message: "Generating 8-minute episode with 2 AI voices...", color: "bg-[#41d1ff]/20 text-[#41d1ff]" },
  { time: "10:23:55", label: "COMPLETE", message: '"Q1 Deep Dive" episode ready to play', color: "bg-emerald-500/20 text-emerald-400" },
]

export function ActivityLogSection() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let count = 0
          const interval = setInterval(() => {
            count++
            setVisibleCount(count)
            if (count >= logEntries.length) clearInterval(interval)
          }, 600)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    const el = document.getElementById("activity-log")
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From raw content to finished podcast
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Watch research transform into polished audio in real time.
          </p>
        </div>

        <div id="activity-log" className="mx-auto max-w-3xl">
          {/* Terminal block */}
          <div className="overflow-hidden rounded-xl border border-border/40 bg-card">
            <div className="flex items-center gap-2 border-b border-border/40 bg-secondary/30 px-5 py-3">
              <div className="size-3 rounded-full bg-destructive/60" />
              <div className="size-3 rounded-full bg-amber-500/60" />
              <div className="size-3 rounded-full bg-emerald-500/60" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">audioprism-pipeline.log</span>
            </div>
            <div className="space-y-0 p-5 font-mono text-sm">
              {logEntries.map((entry, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 py-1.5 transition-all duration-500",
                    i < visibleCount ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  )}
                >
                  <span className="shrink-0 text-muted-foreground/50">[{entry.time}]</span>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${entry.color}`}>
                    {entry.label}
                  </span>
                  <span className="text-muted-foreground">{entry.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audio player placeholder */}
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-border/40 bg-card px-5 py-4">
            <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
              <Play className="size-4 ml-0.5" />
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Listen to a sample episode</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#bd34fe] to-[#41d1ff]" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">2:34 / 8:12</span>
          </div>
        </div>
      </div>
    </section>
  )
}
