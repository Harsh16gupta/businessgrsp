"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function GlowingEffectDemoSecond() {
  return (
    <section className="py-20">
      {/* Section Heading */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Choose <span className="text-blue-600">GRSP</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trusted by thousands of professionals and customers — discover what makes GRSP 
          the most reliable service platform for finding and hiring skilled experts.
        </p>
      </div>

      {/* Glowing Grid Section */}
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 mx-6 md:mx-20">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Search className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Smart Matching System"
          description="Instantly connects you with the most suitable, verified professionals based on your needs and location."
        />

        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Lock className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Verified & Background-Checked Experts"
          description="Every professional on GRSP is identity-verified and skill-tested before joining our platform."
        />

        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Sparkles className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Instant Booking & Quick Response"
          description="Book your desired service in seconds and get instant confirmation — no delays, no uncertainty."
        />

        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Settings className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Transparent Pricing & Reviews"
          description="View ratings, read verified reviews, and check upfront prices before booking — full transparency guaranteed."
        />

        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Box className="h-5 w-5 text-black dark:text-neutral-400" />}
          title="Flexible Opportunities for Workers"
          description="Thousands of skilled workers use GRSP to find flexible, well-paying jobs that match their expertise."
        />
      </ul>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-gray-200 dark:border-gray-800 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 bg-white dark:bg-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_25px_#2D2D2D]">
          <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-neutral-800">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 font-sans text-xl font-semibold text-black md:text-2xl dark:text-white">
                {title}
              </h3>
              <p className="font-sans text-sm text-gray-700 md:text-base dark:text-neutral-400">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
