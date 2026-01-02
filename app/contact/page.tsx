"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center px-6">
            <p className="text-xs tracking-[0.4em] uppercase text-[#2a2520]/40 mb-8">
              Message Sent
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#2a2520]/90 mb-6">
              Thank you.
            </h1>
            <p className="text-[#2a2520]/50 text-lg">
              We'll be in touch soon.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl">
          <p className="text-xs tracking-[0.4em] uppercase text-[#2a2520]/40 mb-8">
            Riad di Siena
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8">
            C O N T A C T
          </h1>
          <p className="text-xl text-[#2a2520]/50 max-w-xl mx-auto">
            Questions about your stay, special requests, or simply want to say hello.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xs tracking-[0.2em] text-[#2a2520]/40 block mb-4">
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border-b border-[#2a2520]/20 pb-3 bg-transparent focus:border-[#2a2520] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] text-[#2a2520]/40 block mb-4">
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border-b border-[#2a2520]/20 pb-3 bg-transparent focus:border-[#2a2520] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] text-[#2a2520]/40 block mb-4">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-b border-[#2a2520]/20 pb-3 bg-transparent focus:border-[#2a2520] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] text-[#2a2520]/40 block mb-4">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border-b border-[#2a2520]/20 pb-3 bg-transparent focus:border-[#2a2520] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] text-[#2a2520]/40 block mb-4">
                  MESSAGE
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border-b border-[#2a2520]/20 pb-3 bg-transparent focus:border-[#2a2520] outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full border border-[#2a2520]/20 px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#2a2520] hover:text-[#f5f0e8] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="mt-20 pt-12 border-t border-[#2a2520]/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-xs tracking-[0.2em] text-[#2a2520]/40 mb-3">EMAIL</p>
                  <a href="mailto:hello@riad-di-siena.com" className="text-[#2a2520]/70 hover:text-[#2a2520] transition-colors">
                    hello@riad-di-siena.com
                  </a>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] text-[#2a2520]/40 mb-3">LOCATION</p>
                  <p className="text-[#2a2520]/70">
                    Marrakech Medina, Morocco
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
