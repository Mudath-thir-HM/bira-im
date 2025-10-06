// src/app/landingPage/page.tsx
"use client";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";
import { FadeInSection } from "@/components/ui/FadeInSection";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/auth/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message,
        });
        // Clear form
        setContactName("");
        setContactEmail("");
        setContactMessage("");

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 5000);
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Bira'eem
        </h1>
        <Link href="/auth">
          <button className="border-2 border-gradient-to-br from-medium-brownium to-light-brownium text-dark-brownium px-4 py-2 rounded-xl hover:bg-gradient-to-br hover:from-medium-brownium hover:to-light-brownium hover:text-white transition-all cursor-pointer">
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
            Welcome To Bira'eem
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

      <section className="py-20 px-6 space-y-20 flex flex-col md:flex-row justify-between items-center">
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
          Have questions, suggestions, or feedback? We'd love to hear from you.
        </p>

        {submitStatus.type && (
          <div
            className={`max-w-xl mx-auto mt-4 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form
          onSubmit={handleContactSubmit}
          className="mt-6 max-w-xl mx-auto flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Your name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            disabled={isSubmitting}
            className="px-4 py-2 rounded border border-light-brownium disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="email"
            placeholder="Your email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="px-4 py-2 rounded border border-light-brownium disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <textarea
            placeholder="Your message"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            required
            disabled={isSubmitting}
            minLength={10}
            className="px-4 py-2 rounded border border-light-brownium h-32 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="self-center px-6 py-2 border-2 border-gradient-to-br from-medium-brownium to-light-brownium text-light-brownium rounded-xl hover:bg-gradient-to-br hover:from-medium-brownium hover:to-light-brownium hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        <p className="text-sm text-dark-brownium mt-4">
          Or email us directly at{" "}
          <a
            href="mailto:eighthmudathir@gmail.com"
            className="font-semibold underline hover:text-medium-brownium"
          >
            eighthmudathir@gmail.com
          </a>
        </p>
      </section>
    </>
  );
};

export default LandingPage;
