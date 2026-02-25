"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: 'Do I need API keys to start?',
      answer: 'No. You can start with Audioprism-managed AI immediately. If you want lower costs or full control, bring your own keys anytime.',
    },
    {
      question: 'What can I upload?',
      answer: 'PDFs, web pages, and common audio/video formats. Audioprism extracts content, builds notes, and indexes everything for search.',
    },
    {
      question: "What's included in the Free plan?",
      answer: 'A small daily chat limit, a monthly indexing limit, and a single notebook — enough to test the workflow end-to-end.',
    },
    {
      question: 'What happens when I hit my limits?',
      answer: "You'll get a friendly stop screen. You can upgrade, buy a top-up, or enable BYOK to keep going.",
    },
    {
      question: 'Can I export audio?',
      answer: 'Yes — generate episodes and export audio for listening anywhere.',
    },
    {
      question: 'Is my data private?',
      answer: "Your notebooks are scoped to your account. If you store provider keys, they're encrypted at rest.",
    },
  ]

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Subtle top separator */}
        <div className="flex justify-center mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-[15px] text-white/50">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem 
              key={idx} 
              value={`item-${idx}`} 
              className="border-b border-white/10 px-2"
            >
              <AccordionTrigger className="text-left text-[15px] font-medium text-white hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-white/50 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
