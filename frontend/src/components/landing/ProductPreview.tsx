"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ProductPreview() {
  const { resolvedTheme } = useTheme();

  return (
    <section className="relative overflow-hidden bg-background py-16 -mt-16 sm:-mt-24 z-20">
      <div className="container relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-2xl md:rounded-[32px] overflow-hidden border border-border/40 shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5 bg-background/50 backdrop-blur-xl"
        >
          {/* MacOS style window header */}
          <div className="flex items-center gap-2 px-6 py-4 bg-muted/40 border-b border-border/40">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto text-xs font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-4 h-4 rounded-[4px] bg-foreground/10 flex items-center justify-center">
                <span className="w-2.5 h-2.5 border border-foreground/30 rounded-sm" />
              </span>
              audioprism.app
            </div>
          </div>

          {/* Screenshot container */}
          <div className="relative aspect-[16/10] bg-muted/20">
            {/* The user can drop their unified screenshot here, we use a placeholder that falls back to a clean background if not found */}
            <Image
              src="/dashboard-preview.png"
              alt="Audioprism Studio Interface"
              fill
              className="object-cover object-top opacity-0 transition-opacity duration-500"
              onLoadingComplete={(img) => img.classList.remove("opacity-0")}
              priority
            />
            {/* Fallback pattern while waiting for the user's screenshot */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] flex items-center justify-center flex-col gap-4 text-muted-foreground">
                <div className="flex gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-xl bg-border animate-pulse" />
                    <div className="w-12 h-12 rounded-xl bg-border animate-pulse delay-100" />
                    <div className="w-12 h-12 rounded-xl bg-border animate-pulse delay-200" />
                </div>
                <p className="text-sm">Place your screenshot at <code className="bg-muted px-2 py-0.5 rounded">public/dashboard-preview.png</code></p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
