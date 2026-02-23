import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with AI research.",
    features: [
      "20 chat messages/day",
      "100 pages indexed/month",
      "1 notebook",
      "Community support",
    ],
    highlighted: false,
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For creators and researchers.",
    badge: "Most Popular",
    features: [
      "500 chat messages/month",
      "60 min TTS/month",
      "10 podcast episodes/month",
      "1,000 pages indexed/month",
      "BYOK support",
      "Priority support",
    ],
    highlighted: true,
    cta: "Upgrade to Pro",
    ctaHref: "/sign-up",
    ctaVariant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams that run on output.",
    features: [
      "2,000 chat messages/month",
      "300 min TTS/month",
      "50 podcast episodes/month",
      "10,000 pages indexed/month",
      "API access",
      "Dedicated support",
    ],
    highlighted: false,
    cta: "Contact Sales",
    ctaHref: "/sign-up",
    ctaVariant: "outline" as const,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple pricing that scales with your usage.
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Start free. Upgrade when you want more output — or bring your own keys for maximum control.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-8",
                plan.highlighted
                  ? "border-primary/60 bg-gradient-to-b from-primary/5 to-card"
                  : "border-border/40 bg-card"
              )}
            >
              {plan.badge && (
                <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <Button
                  variant={plan.ctaVariant}
                  className={cn(
                    "w-full",
                    plan.highlighted &&
                      "bg-gradient-to-r from-[#bd34fe] to-[#41d1ff] text-foreground hover:opacity-90"
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need more? Top up usage instantly — or use your own keys.
        </p>
      </div>
    </section>
  )
}
