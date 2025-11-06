import React, { useState, useMemo, useEffect } from "react";
import defaultTemplates from "../data/templates.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";

interface Template {
  id: string;
  name: string;
  body: string;
}

const STORAGE_KEY = "emailTemplates";

export default function EmailTemplateApp() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [rawJson, setRawJson] = useState("");
  const [jsonValid, setJsonValid] = useState(true);
  const [resetState, setResetState] = useState<"idle" | "confirm" | "done">(
    "idle",
  );

  // --- Load templates on mount ---
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch {
        setTemplates(defaultTemplates);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(defaultTemplates, null, 2),
        );
      }
    } else {
      setTemplates(defaultTemplates);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultTemplates, null, 2),
      );
    }
  }, []);

  // --- Helpers ---
  const normalizeName = (value: string) =>
    !value
      ? value
      : value
          .split("/")
          .map((segment) =>
            segment
              .trim()
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" "),
          )
          .join("/");

  const extractFields = (template: Template) => {
    const matches = template.body.match(/\[(.*?)\]/g);
    return matches
      ? [...new Set(matches.map((m) => m.replace(/\[|\]/g, "")))]
      : [];
  };

  const generatedText = useMemo(() => {
    if (!selectedTemplate) return "";
    let text = selectedTemplate.body;
    for (const [key, value] of Object.entries(fieldValues)) {
      const finalValue =
        key.toLowerCase().includes("name") && value
          ? normalizeName(value)
          : value;
      text = text.replace(
        new RegExp(`\\[${key}\\]`, "g"),
        finalValue || `[${key}]`,
      );
    }
    return text;
  }, [selectedTemplate, fieldValues]);

  // --- Actions ---
  async function handleCopy() {
    if (generatedText) await navigator.clipboard.writeText(generatedText);
  }

  const handleResetClick = () => {
    if (resetState === "idle") {
      setResetState("confirm");
      // revert to idle if user doesn’t confirm quickly
      setTimeout(() => {
        setResetState((prev) => (prev === "confirm" ? "idle" : prev));
      }, 2500);
    } else if (resetState === "confirm") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultTemplates, null, 2),
      );
      setTemplates(defaultTemplates);
      setSelectedTemplate(null);
      setFieldValues({});
      setResetState("done");
      setTimeout(() => setResetState("idle"), 1500);
    }
  };

  const handleOpenEditor = () => {
    setRawJson(JSON.stringify(templates, null, 2));
    setJsonValid(true);
    setEditMode(true);
  };

  const handleJsonChange = (value: string) => {
    setRawJson(value);
    try {
      const parsed = JSON.parse(value);
      const valid = Array.isArray(parsed);
      setJsonValid(valid);
    } catch {
      setJsonValid(false);
    }
  };

  const handleSaveEditor = () => {
    if (!jsonValid) return;
    try {
      const parsed = JSON.parse(rawJson);
      setTemplates(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed, null, 2));
      setEditMode(false);
    } catch {
      alert("Unexpected error while saving.");
      setJsonValid(false);
    }
  };

  return (
    <div className="relative">
      {/* Main UI */}
      <Card
        className={`max-w-3xl mx-auto mt-8 transition-filter ${
          editMode ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Email Template Generator</CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleOpenEditor}>
              Edit Templates
            </Button>

            {/* Animated Reset Button */}
            <Button
              variant={
                resetState === "confirm"
                  ? "destructive"
                  : resetState === "done"
                    ? "secondary"
                    : "secondary"
              }
              size="sm"
              onClick={handleResetClick}
              className={`
                relative overflow-hidden transition-all duration-300
                min-w-32             // <-- keeps width stable
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
                className={`
                  absolute inset-0 flex items-center justify-center
                  transition-opacity duration-300
                  ${resetState === "idle" ? "opacity-100" : "opacity-0"}
                `}
              >
                Reset Templates
              </span>
              <span
                className={`
                  absolute inset-0 flex items-center justify-center
                  transition-opacity duration-300
                  ${resetState === "confirm" ? "opacity-100" : "opacity-0"}
                `}
              >
                Are you sure?
              </span>
              <span
                className={`
                  absolute inset-0 flex items-center justify-center
                  transition-opacity duration-300
                  ${resetState === "done" ? "opacity-100" : "opacity-0"}
                `}
              >
                Templates reset
              </span>
            </Button>
          </div>
        </CardHeader>

        {/* Cards and Content */}
        <CardContent className="space-y-6">
          {/* Searchable Dropdown Combobox */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select a Template
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedTemplate
                    ? selectedTemplate.name
                    : "Search or select template..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput
                    placeholder="Type to search templates..."
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <CommandList>
                    <CommandEmpty>No matching templates.</CommandEmpty>
                    <CommandGroup>
                      {templates.map((t) => (
                        <CommandItem
                          key={t.id}
                          onSelect={() => {
                            setSelectedTemplate(t);
                            setFieldValues({});
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedTemplate?.id === t.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {t.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Dynamic fields */}
          {selectedTemplate && (
            <>
              <form autoComplete="off" className="space-y-2 mt-4">
                {extractFields(selectedTemplate).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1">
                      {field.replace(/_/g, " ")}
                    </label>
                    <Input
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      autoCapitalize="off"
                      inputMode="text"
                      name={`field-${field}`}
                      id={`field-${field}`}
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                      value={fieldValues[field] || ""}
                      onChange={(e) =>
                        setFieldValues((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </form>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Generated Email Body
                  </label>
                  <Button onClick={handleCopy} className="">
                    Copy to Clipboard
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={generatedText}
                  className="min-h-[200px]"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Templates Overlay */}
      {editMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Edit Templates (Raw JSON)</CardTitle>
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
                  onClick={handleSaveEditor}
                  disabled={!jsonValid}
                  className={!jsonValid ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Save Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
