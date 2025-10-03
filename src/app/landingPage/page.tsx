"use client";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";
import { FadeInSection } from "@/components/ui/FadeInSection";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // trigger animation after component mounts
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  type Feature = {
    title: string;
    text: string;
    image: string;
  };

  const features: Feature[] = [
    {
      title: "Learn at Your Own Pace",
      text: "Sprout adapts to your style and speed of learning.",
      image: "/personalised-learning.avif",
    },
    {
      title: "Meet Bud, Your AI Buddy",
      text: "Ask Bud anything - it's like having a smart friend by your side.",
      image: "/Ai-Buddy.avif",
    },
    {
      title: "Earn XP, Unlock Achievements",
      text: "Level up as you complete lessons and quizzes.",
      image: "/achievements.jpg",
    },
  ];

  return (
    <>
      <nav
        className={`fixed w-full top-0 left-0 z-50 transition-colors duration-300 px-6 py-4 flex justify-between items-center ${
          scrolled ? "bg-brand-primary backdrop-blur" : "bg-transparent"
        }`}
      >
        <h1 className="text-2xl tracking-wide font-black text-dark-brownium drop-shadow">
          Sprout
        </h1>
        <Link href="/auth">
          <button className="border-2 border-gradient-to-br from-medium-brownium to-light-brownium text-dark-brownium  px-4 py-2 rounded-xl hover:bg-gradient-to-br hover:from-medium-brownium hover:to-light-brownium hover:text-white transition-all cursor-pointer">
            Sign In
          </button>
        </Link>
      </nav>
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <BackgroundAnimation />
        <div className="z-10">
          {/* Heading */}
          <h2
            className={`text-5xl md:text-6xl font-extrabold text-dark-brownium drop-shadow-[2px_2px_0_#00000055] 
          transition-all duration-700 ease-out transform
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Welcome To Sprout
          </h2>

          {/* Subtext */}
          <p
            className={`mt-4 text-lg text-[#7a5d3a] 
          transition-opacity duration-700 delay-300
          ${show ? "opacity-100" : "opacity-0"}`}
          >
            Where learning takes root and grows with Bud
          </p>
        </div>
      </section>
      <section className="py-20 px-6 space-y-20 flex-col md:flex-row justify-between items-center">
        {features.map((feature, index) => (
          <FadeInSection key={index} delay={index * 200}>
            <Image
              src={feature.image}
              alt={feature.title}
              width={300}
              height={300}
              className="rounded-2xl shadow-xl"
            />
            <div>
              <h3 className="text-center text-3xl font-bold text-dark-brownium drop-shadow-sm">
                {feature.title}
              </h3>
              <p className="text-center mt-2 text-dark-brownium">
                {feature.text}
              </p>
            </div>
          </FadeInSection>
        ))}
      </section>
      <section className="bg-brand-primary py-16 px-6 text-center">
        <h3 className="text-3xl font-bold text-[#5e3c15] drop-shadow-sm">
          Get in Touch
        </h3>
        <p className="text-dark-brownium mt-4">
          Have questions, suggestions, or feedback? We will love to hear from
          you.
        </p>
        <form className="mt-6 max-w-xl mx-auto flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your name"
            className="px-4 py-2 rounded border border-light-brownium"
          />
          <input
            type="email"
            placeholder="Your email"
            className="px-4 py-2 rounded border border-light-brownium"
          />
          <textarea
            placeholder="Your message"
            className="px-4 py-2 rounded border border-light-brownium h-32"
          />
          <button className="self-center px-6 py-2 border-2 border-gradient-to-br from-medium-brownium to-light-brownium text-light-brownium rounded-xl hover:bg-gradient-to-br hover:from-medium-brownium hover:to-light-brownium hover:text-white transition-all cursor-pointer">
            Send Message
          </button>
        </form>
      </section>
    </>
  );
};

export default LandingPage;
