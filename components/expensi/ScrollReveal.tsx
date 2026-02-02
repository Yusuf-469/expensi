"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.5,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
            }
          : {
              opacity: 0,
              ...directions[direction],
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children reveal
interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.1,
  direction = "up",
}: StaggerRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            ...directions[direction],
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                }
              : {
                  opacity: 0,
                  ...directions[direction],
                }
          }
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Parallax scroll effect
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function Parallax({ children, className = "", speed = 0.5 }: ParallaxProps) {
  const ref = useRef(null);
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

// Hover scale effect
interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ children, className = "", scale = 1.02 }: HoverScaleProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Fade in on mount
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, className = "", delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

// Slide in animation
interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "top" | "bottom";
  delay?: number;
}

export function SlideIn({
  children,
  className = "",
  direction = "left",
  delay = 0,
}: SlideInProps) {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    top: { x: 0, y: -100 },
    bottom: { x: 0, y: 100 },
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
