"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const panels = [
    {
      id: 1,
      title: "Master In-Demand Skills",
      description:
        "Learn from industry experts and gain practical knowledge that employers are actively seeking.",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      icon: "🎯",
    },
    {
      id: 2,
      title: "Flexible Learning Paths",
      description:
        "Study at your own pace with lifetime access to course materials and regular updates.",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      icon: "📚",
    },
    {
      id: 3,
      title: "Build Your Portfolio",
      description:
        "Complete real-world projects and create a portfolio that showcases your skills to employers.",
      color: "bg-gradient-to-br from-pink-500 to-pink-700",
      icon: "💼",
    },
    {
      id: 4,
      title: "Join Our Community",
      description:
        "Connect with thousands of learners worldwide and collaborate on exciting projects.",
      color: "bg-gradient-to-br from-green-500 to-green-700",
      icon: "🌍",
    },
    {
      id: 5,
      title: "Get Certified",
      description:
        "Earn recognized certificates upon course completion to boost your career prospects.",
      color: "bg-gradient-to-br from-orange-500 to-orange-700",
      icon: "🏆",
    },
  ];

  useEffect(() => {
    const pin = triggerRef.current;
    const container = sectionRef.current;

    if (!pin || !container) return;

    // Calculate total scroll distance
    const totalWidth = container.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(container, {
      x: -scrollDistance,
      ease: "none",
    });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);
  return (
    <div ref={triggerRef} className="overflow-hidden bg-gray-900">
      <div
        ref={sectionRef}
        className="flex h-screen"
        style={{ width: `${panels.length * 100}vw` }}
      >
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className="w-screen h-screen flex items-center justify-center flex-shrink-0"
          >
            <div
              className={`w-full h-full flex items-center justify-center ${panel.color} relative`}
            >
              {/* Panel Number */}
              <div className="absolute top-8 right-8 text-white/30 text-6xl font-bold">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="max-w-2xl px-8 text-center text-white">
                <div className="text-8xl mb-6">{panel.icon}</div>
                <h2 className="text-5xl font-bold mb-6">{panel.title}</h2>
                <p className="text-xl leading-relaxed opacity-90">
                  {panel.description}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {panels.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? "w-12 bg-white" : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
