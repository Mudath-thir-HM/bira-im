"use client";
import React, { useState } from "react";
import { Icon } from "@/lib/constants";
import AIAssistantModal from "../AIAssistantModal";

const BuddyButton = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-20 right-5 bg-brand-secondary text-white p-4 rounded-full shadow-lg hover:bg-brand-primary transition-colors z-50 cursor-pointer"
        aria-label="Open AI Assistant"
      >
        <Icon name="robot" className="w-8 h-8" />
      </button>

      {isAIAssistantOpen && (
        <AIAssistantModal onClose={() => setIsAIAssistantOpen(false)} />
      )}
    </>
  );
};

export default BuddyButton;
