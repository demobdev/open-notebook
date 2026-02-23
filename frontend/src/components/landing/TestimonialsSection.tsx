"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Alice Johnson",
    role: "OpenAI Lead",
    content:
      "The AI Agent SDK has revolutionized how we build intelligent systems. It is incredibly intuitive and powerful.",
    initials: "AJ",
  },
  {
    name: "Diana Evans",
    role: "Automator",
    content:
      "The tool integration feature has streamlined our workflow automation processes remarkably.",
    initials: "DE",
  },
  {
    name: "George Harris",
    role: "Rapydork",
    content:
      "The SDK's intuitive APIs have made it easy for our team to quickly prototype and deploy AI agent systems.",
    initials: "GH",
  },
  {
    name: "Bob Brown",
    role: "QuantumFlow",
    content:
      "We have significantly reduced development time for our AI projects using this SDK. The multi-agent feature is a game-changer.",
    initials: "BB",
  },
  {
    name: "Ethan Ford",
    role: "DevOps Lead",
    content:
      "The customizable agent behaviors have allowed us to create highly specialized AI solutions for our clients.",
    initials: "EF",
  },
  {
    name: "Hannah Irving",
    role: "Tech Lead",
    content:
      "The multi-agent system has enabled us to build complex, collaborative AI solutions with ease.",
    initials: "HI",
  },
  {
    name: "Charlie Davis",
    role: "CraboNotes",
    content:
      "The cross-language support allowed us to seamlessly integrate AI agents into our existing tech stack.",
    initials: "CD",
  },
  {
    name: "Fiona Grant",
    role: "SysBuild",
    content:
      "The efficiency features have significantly improved our system's performance and scalability.",
    initials: "FG",
  },
  {
    name: "Ian Johnson",
    role: "Parcel",
    content:
      "The SDK's flexibility in integrating external tools has expanded our AI agents' capabilities tremendously.",
    initials: "IJ",
  },
]

export function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? testimonials : testimonials.slice(0, 6)

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Testimonials
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t.content}
              </p>
            </div>
          ))}
        </div>

        {testimonials.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              )}
            >
              {showAll ? "Show less" : "See more"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
