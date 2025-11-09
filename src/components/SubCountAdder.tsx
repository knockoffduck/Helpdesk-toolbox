"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

const STORAGE_KEY = "subscriptionChangeTool";
const SUBS_KEY = "subscriptionList";

// Default subscription list
const DEFAULT_SUBSCRIPTIONS: {
  name: string;
  category: "User Subscriptions" | "Device Subscriptions";
}[] = [
  // Device Subscriptions
  { name: "Threatlocker", category: "Device Subscriptions" },
  { name: "DNS Filter", category: "Device Subscriptions" },
  { name: "ConnectSecure", category: "Device Subscriptions" },
  { name: "Huntress EDR", category: "Device Subscriptions" },
  {
    name: "NinjaMDM Mobile",
    category: "Device Subscriptions",
  },
  { name: "NinjaRMM", category: "Device Subscriptions" },

  // User Subscriptions
  { name: "uSecure", category: "User Subscriptions" },
  { name: "ActivTrak", category: "User Subscriptions" },
  { name: "Backupify", category: "User Subscriptions" },
  { name: "Dropsuite", category: "User Subscriptions" },
  { name: "Bitwarden", category: "User Subscriptions" },
];

export default function SubCountAdder() {
  const [allSubs, setAllSubs] = useState<
    { name: string; category: "User Subscriptions" | "Device Subscriptions" }[]
  >([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [entries, setEntries] = useState<
    Record<string, { before: string; after: string; note: string }>
  >({});
  const [output, setOutput] = useState("");

  // Modal + editor state
  const [editMode, setEditMode] = useState(false);
  const [rawJson, setRawJson] = useState("");
  const [jsonValid, setJsonValid] = useState(true);

  // Reset confirmation animation
  const [resetState, setResetState] = useState<"idle" | "confirm" | "done">(
    "idle",
  );

  // Load subscriptions and saved session
  useEffect(() => {
    const subsStored = localStorage.getItem(SUBS_KEY);
    if (subsStored) {
      try {
        const parsed = JSON.parse(subsStored);
        // Validate shape: must be an array of objects with `name` & `category`
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (s) =>
              typeof s.name === "string" &&
              typeof s.category === "string" &&
              (s.category === "User Subscriptions" ||
                s.category === "Device Subscriptions"),
          )
        ) {
          setAllSubs(parsed);
        } else {
          setAllSubs(DEFAULT_SUBSCRIPTIONS);
          localStorage.setItem(SUBS_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
        }
      } catch {
        setAllSubs(DEFAULT_SUBSCRIPTIONS);
        localStorage.setItem(SUBS_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
      }
    } else {
      setAllSubs(DEFAULT_SUBSCRIPTIONS);
      localStorage.setItem(SUBS_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelected(parsed.selected || []);
        setEntries(parsed.entries || {});
        setOutput(parsed.output || "");
      } catch {
        console.warn("Failed to parse saved session.");
      }
    }
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selected, entries, output }),
    );
  }, [selected, entries, output]);

  function toggleSubscription(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );
  }

  function updateEntry(
    name: string,
    field: "before" | "after" | "note",
    val: string,
  ) {
    setEntries((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: val },
    }));
  }

  function generateTable() {
    const rows = selected.map((name) => {
      const { before = "", after = "", note = "" } = entries[name] || {};
      if (note) {
        return `${name} was ${before} now ${after} (${note})`;
      }
      return `${name} was ${before} now ${after}`;
    });

    const md = rows.join("\n");
    setOutput(md);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

  function clearAll() {
    setSelected([]);
    setEntries({});
    setOutput("");
    localStorage.removeItem(STORAGE_KEY);
  }

  // Reset subscriptions button behaviour
  function handleResetSubs() {
    if (resetState === "idle") {
      setResetState("confirm");
      setTimeout(() => {
        setResetState((prev) => (prev === "confirm" ? "idle" : prev));
      }, 2500);
    } else if (resetState === "confirm") {
      setAllSubs(DEFAULT_SUBSCRIPTIONS);
      localStorage.setItem(SUBS_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
      setSelected([]);
      setEntries({});
      setOutput("");
      setResetState("done");
      setTimeout(() => setResetState("idle"), 1500);
    }
  }

  // Editor modal
  function openEditor() {
    setRawJson(JSON.stringify(allSubs, null, 2));
    setJsonValid(true);
    setEditMode(true);
  }

  function handleJsonChange(value: string) {
    setRawJson(value);
    try {
      const parsed = JSON.parse(value);
      setJsonValid(Array.isArray(parsed));
    } catch {
      setJsonValid(false);
    }
  }

  function saveEditor() {
    if (!jsonValid) return;
    try {
      const parsed = JSON.parse(rawJson);

      // Validate structure is array of { name, category }
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (s) =>
            typeof s.name === "string" &&
            typeof s.category === "string" &&
            (s.category === "User Subscriptions" ||
              s.category === "Device Subscriptions"),
        )
      ) {
        setAllSubs(parsed); // ✅ immediately updates the checkbox list
        localStorage.setItem(SUBS_KEY, JSON.stringify(parsed));
        setEditMode(false);
      } else {
        alert("Invalid format. Each entry must have 'name' and 'category'.");
      }
    } catch {
      setJsonValid(false);
    }
  }

  return (
    <div className="relative">
      {/* Main tool UI */}
      <Card
        className={`max-w-3xl mx-auto mt-8 transition-filter ${
          editMode ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Subscription Change Tool</CardTitle>

          <div className="flex gap-2">
            {/* Edit Subscriptions */}
            <Button variant="secondary" size="sm" onClick={openEditor}>
              Edit Subscriptions
            </Button>

            {/* Animated Reset Subscriptions */}
            <Button
              variant={
                resetState === "confirm"
                  ? "destructive"
                  : resetState === "done"
                    ? "secondary"
                    : "secondary"
              }
              size="sm"
              onClick={handleResetSubs}
              className={`
                relative overflow-hidden transition-all duration-300
                min-w-[11rem]
                ${
                  resetState === "confirm"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : resetState === "done"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : ""
                }
              `}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  resetState === "idle" ? "opacity-100" : "opacity-0"
                }`}
              >
                Reset Subscriptions
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  resetState === "confirm" ? "opacity-100" : "opacity-0"
                }`}
              >
                Are you sure?
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  resetState === "done" ? "opacity-100" : "opacity-0"
                }`}
              >
                Subscriptions reset
              </span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select Subscriptions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["User Subscriptions", "Device Subscriptions"].map(
                (category) => (
                  <div key={category} className="space-y-1">
                    <h4 className="font-medium text-sm mt-2">{category}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allSubs
                        .filter((s) => s.category === category)
                        .map(({ name }) => (
                          <label
                            key={name}
                            className="flex items-center space-x-2 text-sm select-none"
                          >
                            <Checkbox
                              id={name}
                              checked={selected.includes(name)}
                              onCheckedChange={() => toggleSubscription(name)}
                            />
                            <span>{name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="space-y-4">
              {selected.map((name) => (
                <div
                  key={name}
                  className="p-4 rounded-md border border-border space-y-3 bg-card"
                >
                  <h3 className="font-medium text-base">{name}</h3>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex-1 min-w-[120px]">
                      <Label className="mb-1.5" htmlFor={`${name}-before`}>
                        Before
                      </Label>
                      <Input
                        id={`${name}-before`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={entries[name]?.before || ""}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          updateEntry(name, "before", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <Label className="mb-1.5" htmlFor={`${name}-after`}>
                        After
                      </Label>
                      <Input
                        id={`${name}-after`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={entries[name]?.after || ""}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          updateEntry(name, "after", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <Label className="mb-1.5" htmlFor={`${name}-note`}>
                        Additional Note
                      </Label>
                      <Input
                        id={`${name}-note`}
                        placeholder="Optional comment..."
                        value={entries[name]?.note || ""}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          updateEntry(name, "note", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={generateTable} disabled={selected.length === 0}>
              Generate Table
            </Button>
            <Button variant="secondary" onClick={clearAll}>
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card className="max-w-3xl mx-auto mt-6">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Generated Subscription Summary</CardTitle>
            <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md border border-border text-foreground">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Edit subscriptions modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Edit Subscriptions (Raw JSON)</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditMode(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
              <Textarea
                className="flex-1 font-mono text-sm resize-none"
                value={rawJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                spellCheck={false}
              />
              <div
                className={`text-sm font-medium ${
                  jsonValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {jsonValid
                  ? "✔ JSON is valid"
                  : "✖ Invalid JSON. Please fix before saving."}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={saveEditor}
                  disabled={!jsonValid}
                  className={!jsonValid ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Save Subscriptions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
