"use client";

import { useState } from "react";

interface SimpleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  priceEUR: number;
}

export default function SimpleBookingModal({
  isOpen,
  onClose,
  roomName,
  priceEUR,
}: SimpleBookingModalProps) {
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const nights = checkIn && checkOut 
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  
  const total = priceEUR * nights;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }} 
      />
      
      {/* Modal */}
      <div style={{
        position: "relative",
        backgroundColor: "#f8f5f0",
        padding: "32px",
        maxWidth: "400px",
        width: "100%",
        margin: "16px",
      }}>
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2 style={{ marginBottom: "24px", fontFamily: "serif" }}>{roomName}</h2>

        {step === 1 && (
          <div>
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>STEP 1: SELECT DATES</p>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>Check-in</label>
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
              />
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>Check-out</label>
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
              />
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>Guests</label>
              <select 
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
              >
                <option value={1}>1 guest</option>
                <option value={2}>2 guests</option>
              </select>
            </div>

            {nights > 0 && (
              <div style={{ marginBottom: "16px", padding: "16px", backgroundColor: "#e8e4de" }}>
                <p>€{priceEUR} × {nights} nights = <strong>€{total}</strong></p>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!checkIn || !checkOut}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: checkIn && checkOut ? "#1a1a1a" : "#ccc",
                color: "#fff",
                border: "none",
                cursor: checkIn && checkOut ? "pointer" : "not-allowed",
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>STEP 2: YOUR DETAILS</p>
            
            <div style={{ marginBottom: "16px" }}>
              <input 
                type="text" 
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", marginBottom: "8px" }}
              />
              <input 
                type="text" 
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", marginBottom: "8px" }}
              />
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#fff",
                  color: "#1a1a1a",
                  border: "1px solid #1a1a1a",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={() => {
                  alert(`Booking submitted!\n\nRoom: ${roomName}\nDates: ${checkIn} to ${checkOut}\nGuest: ${firstName} ${lastName}\nEmail: ${email}\nTotal: €${total}`);
                  onClose();
                }}
                disabled={!firstName || !lastName || !email}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: firstName && lastName && email ? "#1a1a1a" : "#ccc",
                  color: "#fff",
                  border: "none",
                  cursor: firstName && lastName && email ? "pointer" : "not-allowed",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
