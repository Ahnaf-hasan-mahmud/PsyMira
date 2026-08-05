"use client";

import { motion } from "framer-motion";
import { Check } from "@/components/ui/Icons";

export default function PasswordStrength({ password }: { password: string }) {
  const requirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = requirements.filter(r => r.met).length;
  
  let strengthColor = "var(--border)";
  if (password.length > 0) {
    if (metCount <= 1) strengthColor = "#ef4444"; // red
    else if (metCount === 2 || metCount === 3) strengthColor = "#f59e0b"; // yellow
    else if (metCount === 4) strengthColor = "#10b981"; // green
  }

  return (
    <div style={{ marginTop: "12px", marginBottom: "24px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
        {[1, 2, 3, 4].map(idx => (
          <div 
            key={idx}
            style={{ 
              height: "4px", 
              flex: 1, 
              borderRadius: "2px", 
              background: password.length > 0 && idx <= metCount ? strengthColor : "var(--border)",
              transition: "background 0.3s ease"
            }} 
          />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {requirements.map(req => (
          <div key={req.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: req.met ? "var(--text)" : "var(--text-tertiary)", transition: "color 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "50%", background: req.met ? strengthColor : "transparent", border: req.met ? "none" : "1px solid var(--border)", color: "#fff" }}>
              {req.met && <Check size={10} />}
            </div>
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
}
