"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "callTemplateForm";

export function CallTemplateForm() {
  const [caller, setCaller] = useState("");
  const [issue, setIssue] = useState("");
  const [troubleshooting, setTroubleshooting] = useState("");
  const [resolution, setResolution] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [summary, setSummary] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCaller(data.caller || "");
        setIssue(data.issue || "");
        setTroubleshooting(data.troubleshooting || "");
        setResolution(data.resolution || "");
        setFollowUp(data.followUp || "");
      } catch {
        console.warn("Failed to load saved call template data");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const data = { caller, issue, troubleshooting, resolution, followUp };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [caller, issue, troubleshooting, resolution, followUp]);

  function generateSummary() {
    const md = [
      caller && `Caller: ${caller}`,
      issue && `\nIssue: ${issue}`,
      troubleshooting &&
        `\nActions Taken:\n${troubleshooting
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n")}`,
      resolution && `\nResolution: ${resolution}`,
      followUp && `\nFollow-up: ${followUp}`,
    ]
      .filter(Boolean)
      .join("\n");
    setSummary(md.trim());
  }

  function clearForm() {
    setCaller("");
    setIssue("");
    setTroubleshooting("");
    setResolution("");
    setFollowUp("");
    setSummary("");
    localStorage.removeItem(STORAGE_KEY);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(summary);
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Call Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Caller */}
          <div className="space-y-1.5">
            <Label htmlFor="caller">Caller Name</Label>
            <Input
              id="caller"
              placeholder="e.g. John Doe"
              value={caller}
              onChange={(e) => setCaller(e.target.value)}
            />
          </div>

          {/* Issue */}
          <div className="space-y-1.5">
            <Label htmlFor="issue">Issue Description</Label>
            <Textarea
              id="issue"
              rows={3}
              placeholder="Describe the issue..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />
          </div>

          {/* Steps */}
          <div className="space-y-1.5">
            <Label htmlFor="troubleshooting">Action Steps</Label>
            <Textarea
              id="troubleshooting"
              rows={4}
              placeholder="List what you tried..."
              value={troubleshooting}
              onChange={(e) => setTroubleshooting(e.target.value)}
            />
          </div>

          {/* Resolution */}
          <div className="space-y-1.5">
            <Label htmlFor="resolution">Resolution</Label>
            <Textarea
              id="resolution"
              rows={3}
              placeholder="How was the issue resolved?"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            />
          </div>

          {/* Follow-up */}
          <div className="space-y-1.5">
            <Label htmlFor="followUp">Follow‑up Actions</Label>
            <Textarea
              id="followUp"
              rows={2}
              placeholder="Any next steps or reminders..."
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={generateSummary}>Generate Summary</Button>
            <Button variant="secondary" onClick={clearForm}>
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      {summary && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Summary</CardTitle>
            <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md text-foreground border border-border">
              {summary}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
