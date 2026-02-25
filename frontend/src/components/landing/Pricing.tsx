'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  const plans = [
    {
      name: 'Free',
      monthlyPrice: '$0',
      annualPrice: '$0',
      description: 'Get started with AI research.',
      features: [
        '20 chat messages/day',
        '100 pages indexed/month',
        '1 notebook',
        'Community support',
      ],
      cta: 'Get Started Free',
      ctaHref: '/sign-up',
      highlighted: false,
    },
    {
      name: 'Pro',
      monthlyPrice: '$29',
      annualPrice: '$24',
      badge: 'Most Popular',
      description: 'For creators and researchers.',
      features: [
        '500 chat messages/month',
        '60 min TTS/month',
        '10 podcast episodes/month',
        '1,000 pages indexed/month',
        'BYOK support',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      ctaHref: '/sign-up',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: '$99',
      annualPrice: '$89',
      description: 'For teams that run on output.',
      features: [
        '2,000 chat messages/month',
        '300 min TTS/month',
        '50 podcast episodes/month',
        '10,000 pages indexed/month',
        'API access',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      ctaHref: '/sign-up',
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-32 bg-background transition-colors">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12">
         <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-6 sm:text-5xl">
             Simple pricing for everyone.
          </h2>
          <p className="text-[17px] text-muted-foreground">
            Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
          </p>
        </div>

        {/* Toggle switch */}
        <div className="flex justify-center mb-12">
           <div className="relative inline-flex items-center rounded-full border border-white/10 bg-black/50 p-1 cursor-pointer" onClick={() => setIsAnnual(!isAnnual)}>
             <div className={`relative z-10 w-24 text-center rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-white/50'}`}>Monthly</div>
             <div className={`relative z-10 w-24 text-center rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${isAnnual ? 'text-white' : 'text-white/50'}`}>Annually</div>
             <div 
               className="absolute top-1 bottom-1 w-24 rounded-full bg-white/10 transition-transform duration-300 ease-in-out" 
               style={{ transform: isAnnual ? 'translateX(96px)' : 'translateX(0)' }}
             />
           </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 transition-transform ${
                plan.highlighted 
                  ? 'bg-card border border-border shadow-2xl scale-100 lg:scale-[1.02] z-10' 
                  : 'bg-muted/30 border border-border/50'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-8 rounded-full bg-gradient-to-r from-[#bd34fe] to-[#41d1ff] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                  {plan.badge}
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-[14px] font-medium text-foreground/70 mb-2 uppercase tracking-wide">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[40px] font-bold text-foreground tracking-tight">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-[15px] font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className={`h-[14px] w-[14px] shrink-0 ${plan.highlighted ? 'text-green-500' : 'text-green-500/70'}`} />
                    <span className="text-[13px] text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                asChild
                className={`w-full h-10 rounded-lg text-[13px] font-medium transition-colors ${
                  plan.highlighted 
                    ? 'bg-foreground text-background hover:bg-foreground/90' 
                    : 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80'
                }`}
              >
                <Link href={plan.ctaHref}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
