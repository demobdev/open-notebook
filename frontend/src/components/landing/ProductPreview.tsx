"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const SCREENSHOTS = [
  { src: "/config.png", alt: "AI Model & API Key Configuration" },
  { src: "/sources.png", alt: "All Sources Dashboard" },
  { src: "/workspace.png", alt: "Notebook Workspace Overview" },
  { src: "/podcast.png", alt: "Podcast Generation Workspace" },
  { src: "/podcast-modal.png", alt: "Podcast Generation Modal" },
];

export function ProductPreview() {
  const { resolvedTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) % SCREENSHOTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Determine the next two images to show
  // If we are at the last image (odd number length), we loop around to the first image for the second slot
  const firstImage = SCREENSHOTS[currentIndex];
  const secondImage = SCREENSHOTS[(currentIndex + 1) % SCREENSHOTS.length];

  return (
    <section className="relative overflow-hidden bg-background py-16 -mt-16 sm:-mt-24 z-20">
      <div className="container relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
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

          {/* Screenshot container: Carousel holding two images side-by-side */}
          <div className="relative bg-muted/20 w-full overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/40 min-h-[300px] md:min-h-[500px]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={firstImage.src}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="relative w-full md:w-1/2 flex items-center justify-center p-4 bg-background/20"
              >
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-border/40 shadow-sm">
                    <Image
                    src={firstImage.src}
                    alt={firstImage.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    />
                  </div>
              </motion.div>
              
              <motion.div
                key={secondImage.src}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative w-full md:w-1/2 flex items-center justify-center p-4 bg-background/20"
              >
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-border/40 shadow-sm">
                    <Image
                    src={secondImage.src}
                    alt={secondImage.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    />
                  </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
