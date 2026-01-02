"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";

interface ElfsightWidgetProps {
  widgetId: string;
}

/**
 * Client-only wrapper for Elfsight widgets.
 * 
 * Elfsight aggressively modifies the DOM which causes React hydration errors.
 * This wrapper:
 * 1. Only renders on client (no SSR)
 * 2. Uses a ref to mount the widget outside React's reconciliation
 * 3. Cleans up properly on unmount
 */
export default function ElfsightWidget({ widgetId }: ElfsightWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Create the elfsight div after mount
  useEffect(() => {
    if (mounted && containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = "";
      
      // Create the elfsight element
      const elfsightDiv = document.createElement("div");
      elfsightDiv.className = `elfsight-app-${widgetId}`;
      elfsightDiv.setAttribute("data-elfsight-app-lazy", "");
      
      containerRef.current.appendChild(elfsightDiv);
    }
    
    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [mounted, widgetId]);

  // Don't render anything on server
  if (!mounted) {
    return <div className="min-h-[200px]" />;
  }

  return (
    <div ref={containerRef} suppressHydrationWarning />
  );
}

/**
 * Script loader for Elfsight platform - should be placed once in the page
 */
export function ElfsightScript() {
  return (
    <Script
      src="https://static.elfsight.com/platform/platform.js"
      strategy="lazyOnload"
    />
  );
}
