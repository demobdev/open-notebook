"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const periods = ["Yearly", "Bulk (10%)", "Monthly"] as const

const plans = [
  {
    name: "Basic",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "Perfect for individuals and small projects.",
    features: [
      "500 AI generations per month",
      "Basic text-to-image conversion",
      "Email support",
      "Access to community forum",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    monthlyPrice: 290,
    yearlyPrice: 232,
    description: "Ideal for professionals and growing teams.",
    features: [
      "1,000 AI generations per month",
      "Advanced text-to-image conversion",
      "Priority email support",
      "API access",
      "Custom AI model fine-tuning",
      "Collaboration tools",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Tailored solutions for large organizations.",
    features: [
      "Unlimited AI generations",
      "Dedicated account manager",
      "24/7 phone and email support",
      "Custom AI model development",
      "On-premise deployment option",
      "Advanced analytics and reporting",
    ],
    highlighted: true,
    cta: "Get Started",
  },
]

export function PricingSection() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("Yearly")

  return (
    <section id="pricing" className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-x-0">
          <div className="mx-auto h-[400px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Simple pricing for everyone.
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Choose an{" "}
            <span className="font-semibold text-foreground">affordable plan</span>{" "}
            {"that's"} packed with the best features for engaging your audience.
          </p>
        </div>

        {/* Period toggle */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-secondary p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-8",
                plan.highlighted
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  {plan.monthlyPrice ? (
                    <>
                      <span className="text-4xl font-bold text-foreground">
                        ${period === "Yearly" ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-sm text-muted-foreground">/year</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-foreground">Custom</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
