"use client";

import React, { useState } from "react";
import EmailTemplateApp from "@/components/EmailTemplateApp";
import { CallTemplateForm } from "@/components/CallTemplateForm";
import SubCountAdder from "@/components/SubCountAdder";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  type View = "email" | "call" | "subscription";
  const [view, setView] = useState<View>("email");

  return (
    <main className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-4xl text-center font-bold">Helpdesk Toolkit</h1>

      {/* Navigation Bar */}
      <nav className="flex justify-center gap-4 border-b border-muted-foreground/20 pb-2">
        <Button
          variant="ghost"
          className={`
            px-3 py-1 transition-colors rounded-none border-b-2
            ${
              view === "email"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-primary"
            }
          `}
          onClick={() => setView("email")}
        >
          Email Templates
        </Button>

        <Button
          variant="ghost"
          className={`
            px-3 py-1 transition-colors rounded-none border-b-2
            ${
              view === "call"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-primary"
            }
          `}
          onClick={() => setView("call")}
        >
          Call Templates
        </Button>

        <Button
          variant="ghost"
          className={`
            px-3 py-1 transition-colors rounded-none border-b-2
            ${
              view === "subscription"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-primary"
            }
          `}
          onClick={() => setView("subscription")}
        >
          Subscription Changes
        </Button>
      </nav>

      {/* Dynamic Views */}
      <div className="mt-4">
        {view === "email" && <EmailTemplateApp />}
        {view === "call" && <CallTemplateForm />}
        {view === "subscription" && <SubCountAdder />}
      </div>
    </main>
  );
}
