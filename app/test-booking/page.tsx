"use client";

import { useState } from "react";
import SimpleBookingModal from "@/components/SimpleBookingModal";

export default function TestBookingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: "100px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "serif", fontSize: "32px", marginBottom: "16px" }}>
        Test Booking Page
      </h1>
      
      <p style={{ marginBottom: "24px", color: "#666" }}>
        This is a simple test page to verify the booking modal works without any interference from other components.
      </p>

      <div style={{ 
        padding: "24px", 
        border: "1px solid #ddd", 
        marginBottom: "24px",
        backgroundColor: "#faf8f5"
      }}>
        <h2 style={{ fontFamily: "serif", marginBottom: "8px" }}>Hidden Gem</h2>
        <p style={{ color: "#666", marginBottom: "16px" }}>A cozy room with courtyard view</p>
        <p style={{ marginBottom: "16px" }}><strong>€95</strong> / night</p>
        
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          BOOK NOW
        </button>
      </div>

      <SimpleBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomName="Hidden Gem"
        priceEUR={95}
      />
    </div>
  );
}
