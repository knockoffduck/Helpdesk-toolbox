"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const STORAGE_KEY = "callTemplateForm";

export function CallTemplateForm() {
  const [caller, setCaller] = useState("");
  const [issue, setIssue] = useState("");
  const [troubleshooting, setTroubleshooting] = useState("");
  const [resolution, setResolution] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [summary, setSummary] = useState("");

  // Load from localStorage on mount
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
      } catch (err) {
        console.warn("Failed to parse saved data:", err);
      }
    }
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    const data = {
      caller,
      issue,
      troubleshooting,
      resolution,
      followUp,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [caller, issue, troubleshooting, resolution, followUp]);

  function generateSummary() {
    const md = [
      caller && `Caller: ${caller}`,
      issue && `\n\nIssue: ${issue}`,
      troubleshooting &&
        `\n\nTroubleshooting:\n${troubleshooting
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n")}`,
      resolution && `\n\nResolution: ${resolution}`,
      followUp && `\n\nFollow-up: ${followUp}`,
    ]
      .filter(Boolean)
      .join("\n");
    console.log("summary", md);
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
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="caller" className="mb-2">
              Caller Name
            </Label>
            <Input
              id="caller"
              value={caller}
              onChange={(e) => setCaller(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <Label htmlFor="issue" className="mb-2">
              Issue Description
            </Label>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="troubleshooting" className="mb-2">
              Troubleshooting Steps
            </Label>
            <Textarea
              id="troubleshooting"
              value={troubleshooting}
              onChange={(e) => setTroubleshooting(e.target.value)}
              placeholder="List what you tried..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="resolution" className="mb-2">
              Resolution
            </Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="How was the issue resolved?"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="followUp" className="mb-2">
              Follow-up Actions
            </Label>
            <Textarea
              id="followUp"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Any next steps or reminders..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={generateSummary}>Generate Summary</Button>
            <Button variant="secondary" onClick={clearForm}>
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Markdown Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80">
              <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-3 rounded-md">
                {summary}
              </pre>
            </ScrollArea>

            <div className="pt-3">
              <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
