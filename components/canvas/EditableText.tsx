"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  maxLines?: number;
  fieldName?: string;
  style?: React.CSSProperties;
}

export function EditableText({
  value,
  onChange,
  className = "",
  tag = "p",
  placeholder = "Click to edit text...",
  multiline = false,
  maxLength,
  maxLines,
  fieldName,
  style,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setCurrentText(value);
  }

  const effectiveMaxLines = maxLines || (multiline ? 4 : 1);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const cleanTextValue = (raw: string): string => {
    let text = raw;
    if (!multiline) {
      // Strip all newlines in single-line mode
      text = text.replace(/[\r\n]+/g, " ");
    } else {
      // Collapse excessive consecutive blank lines (never allow more than 1 blank line)
      text = text.replace(/(\r\n|\r|\n){2,}/g, "\n");
      // Limit to effectiveMaxLines
      const lines = text.split(/\r\n|\r|\n/);
      if (lines.length > effectiveMaxLines) {
        text = lines.slice(0, effectiveMaxLines).join("\n");
      }
    }
    if (maxLength && text.length > maxLength) {
      text = text.slice(0, maxLength);
    }
    return text;
  };

  const handleBlur = () => {
    setIsEditing(false);
    const cleaned = cleanTextValue(currentText).trim();
    if (cleaned !== value) {
      onChange(cleaned);
    }
  };

  const handleTextChange = (raw: string) => {
    let newVal = raw;

    if (!multiline) {
      newVal = newVal.replace(/[\r\n]+/g, " ");
    } else {
      // Normalize consecutive newlines
      newVal = newVal.replace(/(\r\n|\r|\n){3,}/g, "\n\n");
      const lines = newVal.split(/\r\n|\r|\n/);
      if (lines.length > effectiveMaxLines) {
        newVal = lines.slice(0, effectiveMaxLines).join("\n");
        toast.warning(`Maximum length reached for ${fieldName || "this section"} (${effectiveMaxLines} lines max). Shorten text to preserve the design layout.`, {
          id: "max-lines-toast",
          duration: 3200,
        });
      }
    }

    if (maxLength && newVal.length > maxLength) {
      newVal = newVal.slice(0, maxLength);
      toast.warning(`Character limit reached (${maxLength} chars max) for ${fieldName || "this field"}. Shorten text to preserve the design layout.`, {
        id: "char-limit-toast",
        duration: 3200,
      });
    }

    setCurrentText(newVal);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let pasted = e.clipboardData.getData("text") || "";
    if (!pasted) return;

    if (!multiline) {
      pasted = pasted.replace(/[\r\n]+/g, " ");
    } else {
      pasted = pasted.replace(/(\r\n|\r|\n){2,}/g, "\n");
    }

    const currentLen = currentText.length;
    let allowedPaste = pasted;

    if (maxLength && currentLen + pasted.length > maxLength) {
      const remaining = Math.max(0, maxLength - currentLen);
      allowedPaste = pasted.slice(0, remaining);
      toast.warning(`Pasted text was trimmed to fit character limits.`, {
        id: "char-paste-toast",
        duration: 3000,
      });
    }

    const combined = currentText + allowedPaste;
    const cleaned = cleanTextValue(combined);
    setCurrentText(cleaned);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      handleBlur();
      return;
    }

    if (multiline && e.key === "Enter") {
      const lines = (currentText || "").split(/\r\n|\r|\n/);
      if (lines.length >= effectiveMaxLines) {
        e.preventDefault();
        toast.warning(`Maximum ${effectiveMaxLines} lines allowed to maintain layout balance.`, {
          id: "max-lines-reached",
          duration: 2400,
        });
        return;
      }
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && maxLength) {
      if (currentText.length >= maxLength) {
        e.preventDefault();
        toast.warning(`Character limit reached (${maxLength} chars max). Shorten text to preserve the design layout.`, {
          id: "char-limit-toast",
          duration: 2400,
        });
        return;
      }
    }

    if (e.key === "Escape") {
      setCurrentText(value);
      setIsEditing(false);
    }
  };

  const Tag = tag;
  const currentLen = (currentText || "").length;
  const showCounter = isEditing && maxLength !== undefined;
  const ratio = maxLength ? currentLen / maxLength : 0;

  const counterBadge = showCounter && (
    <div
      className={`absolute -bottom-5 right-0 z-50 rounded px-1.5 py-0.5 text-[10px] font-mono shadow-xs border transition-all pointer-events-none select-none ${
        ratio >= 1
          ? "bg-red-50 text-red-600 border-red-300 font-bold dark:bg-red-950/80 dark:text-red-400"
          : ratio >= 0.8
          ? "bg-amber-50 text-amber-600 border-amber-300 font-medium dark:bg-amber-950/80 dark:text-amber-400"
          : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]"
      }`}
    >
      {currentLen} / {maxLength}
    </div>
  );

  const lineCount = (currentText || "").split(/\r\n|\r|\n/).length;
  const calculatedRows = Math.min(effectiveMaxLines, Math.max(1, lineCount));

  if (isEditing) {
    if (multiline) {
      return (
        <div className="relative w-full">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentText}
            maxLength={maxLength}
            onChange={(e) => handleTextChange(e.target.value)}
            onPaste={handlePaste}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onScroll={(e) => {
              e.currentTarget.scrollTop = 0;
              e.currentTarget.scrollLeft = 0;
            }}
            rows={calculatedRows}
            style={style}
            className={`w-full min-w-0 max-w-full overflow-hidden resize-none rounded-lg border-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] p-2 outline-none shadow-sm break-words leading-relaxed ${className}`}
          />
          {counterBadge}
        </div>
      );
    }

    return (
      <div className="relative inline-block w-full">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={currentText}
          maxLength={maxLength}
          onChange={(e) => handleTextChange(e.target.value)}
          onPaste={handlePaste}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={style}
          className={`w-full min-w-0 max-w-full rounded-lg border-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] px-2 py-0.5 outline-none shadow-sm break-words ${className}`}
        />
        {counterBadge}
      </div>
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      title={`Click to edit (${maxLength ? `Max ${maxLength} chars, ${effectiveMaxLines} lines` : "inline"})`}
      style={style}
      className={`group relative inline-block min-w-0 max-w-full cursor-text rounded-md transition duration-150 break-words ${
        multiline ? "whitespace-pre-line leading-relaxed overflow-hidden" : "truncate"
      } hover:bg-[hsl(var(--primary)/.08)] hover:ring-2 hover:ring-[hsl(var(--primary)/.35)] ${className} ${
        !currentText ? "text-[hsl(var(--muted-foreground))] italic opacity-70" : ""
      }`}
    >
      {currentText || placeholder}
    </Tag>
  );
}
