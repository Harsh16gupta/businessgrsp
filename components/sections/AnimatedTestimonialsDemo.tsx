import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "GRSP has completely transformed how we manage our restaurant staffing. Finding reliable kitchen staff used to take weeks, now it takes hours!",
      name: "Priya Sharma",
      designation: "Restaurant Owner at Spice Garden",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "As an IT company, we frequently need temporary technical staff. GRSP's verified professionals have never let us down. The platform is incredibly efficient.",
      name: "Rajesh Kumar",
      designation: "CTO at TechSolutions India",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The flexibility GRSP offers is perfect for students like me. I can choose shifts around my college schedule and earn while I learn.",
      name: "Ananya Patel",
      designation: "Student & Part-time Worker",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "We've reduced our hiring costs by 45% since using GRSP. The quality of workers and their professionalism is outstanding.",
      name: "Arjun Singh",
      designation: "Operations Manager at RetailMax",
      src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "GRSP's verification process gives us complete confidence in every hire. It's become an essential part of our staffing strategy.",
      name: "Deepika Reddy",
      designation: "HR Director at Innovate India",
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Finding skilled event staff for our wedding planning business was always challenging. GRSP has made it effortless and reliable.",
      name: "Vikram Mehta",
      designation: "Owner at Grand Weddings",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "As a freelance designer, GRSP helps me find clients who value my skills. The platform connects me with genuine opportunities.",
      name: "Neha Gupta",
      designation: "Freelance Graphic Designer",
      src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Our manufacturing unit relies on GRSP for temporary workers during peak seasons. The platform has never failed to deliver quality staff.",
      name: "Sanjay Malhotra",
      designation: "Factory Manager at Precision Tools",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Compact Heading Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            What Our <span className="bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">Users</span> Say
          </h2>
          
          {/* Compact Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">10,000+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">4.8★</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">95%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Animated Testimonials Component */}
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </section>
  );
}