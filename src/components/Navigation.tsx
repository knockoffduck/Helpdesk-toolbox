import React, { useState } from "react";
import EmailTemplateApp from "@/components/EmailTemplateApp";
import { CallTemplateForm } from "@/components/CallTemplateForm";

export default function Navigation() {
  const [view, setView] = useState<"email" | "call">("email");

  return (
    <main className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-4xl text-center font-bold">Helpdesk Toolkit</h1>

      {/* Nav Bar */}
      <nav className="flex justify-center gap-4 border-b border-muted-foreground/20 pb-2">
        <button
          className={`px-3 py-1 transition-colors cursor-pointer ${
            view === "email"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setView("email")}
        >
          Email Templates
        </button>

        <button
          className={`px-3 py-1 transition-colors cursor-pointer ${
            view === "call"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setView("call")}
        >
          Call Templates
        </button>
      </nav>

      {/* Conditional content */}
      <div className="mt-4">
        {view === "email" ? <EmailTemplateApp /> : <CallTemplateForm />}
      </div>
    </main>
  );
}
