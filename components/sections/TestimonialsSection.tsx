"use client";
import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Excellent service! The plumber was professional and fixed the issue quickly.",
    service: "Plumbing"
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment: "Best home cleaning service I've ever used. Very thorough and affordable.",
    service: "Home Cleaning"
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment: "Electrician arrived on time and did a fantastic job. Highly recommended!",
    service: "Electrical"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thousands of workers and customers trust GRSP to connect them with reliable services 
            and flexible work opportunities every day.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="normal"
          />
        </div>
      </div>
    </section>
  );
}