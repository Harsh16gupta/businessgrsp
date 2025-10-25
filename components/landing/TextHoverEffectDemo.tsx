import React from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export function TextHoverEffectDemo() {
  return (
    <div className="h-[40rem] flex items-center justify-center">
      <TextHoverEffect 
        text="GRSP" // Background animation text
        duration={0.1}
        
        
      />
    </div>
  );
}