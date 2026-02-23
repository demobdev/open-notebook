import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do I need API keys to start?",
    answer:
      "No. You can start with Audioprism-managed AI immediately. If you want lower costs or full control, bring your own keys anytime.",
  },
  {
    question: "What can I upload?",
    answer:
      "PDFs, web pages, and common audio/video formats. Audioprism extracts content, builds notes, and indexes everything for search.",
  },
  {
    question: "What's included in the Free plan?",
    answer:
      "A small daily chat limit, a monthly indexing limit, and a single notebook — enough to test the workflow end-to-end.",
  },
  {
    question: "What happens when I hit my limits?",
    answer:
      "You'll get a friendly stop screen. You can upgrade, buy a top-up, or enable BYOK to keep going.",
  },
  {
    question: "Can I export audio?",
    answer:
      "Yes — generate episodes and export audio for listening anywhere.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your notebooks are scoped to your account. If you store provider keys, they're encrypted at rest.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Questions, answered.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
