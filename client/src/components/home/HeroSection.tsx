"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
const words = ["skills", "career", "self", "team", "potential"];
export default function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[currentWordIndex];

      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
          setTypingSpeed(150);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
          setTypingSpeed(100);
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(500); // Pause before typing next word
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);
  return (
    <section className="w-full">
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
        <Image
          src="/self-desktop.webp"
          alt="Hero Image"
          fill
          className="object-cover rounded-2xl"
          loading="eager"
        />

        <div className="absolute inset-0 flex items-start rounded-2xl bg-black/20">
          <div className="text-white px-6 py-4 sm:px-10 sm:py-6 md:px-14 md:py-8 lg:px-16 lg:py-10">
            <h1 className="font-semibold leading-tight block text-[clamp(1.8rem,5vw,4rem)] bg-black backdrop-blur-sm px-4 py-2 rounded-lg mb-3 inline-block">
              Develop your
            </h1>
            <div className="h-[1.2em] sm:h-[1.3em] md:h-[1.4em]">
              <h2 className="font-semibold leading-tight block text-[clamp(1.8rem,5vw,4rem)] bg-black text-main inline-block px-4 py-2">
                /{currentText}
                <span className="animate-pulse">|</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
