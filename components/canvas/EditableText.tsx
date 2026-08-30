"use client";

import { useEffect, useRef, useState } from "react";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}

export function EditableText({
  value,
  onChange,
  className = "",
  tag = "p",
  placeholder = "Click to edit text...",
  multiline = false,
  style,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentText(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentText !== value) {
      onChange(currentText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setCurrentText(value);
      setIsEditing(false);
    }
  };

  const Tag = tag;

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={3}
          style={style}
          className={`w-full resize-none rounded-lg border-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] p-2 outline-none shadow-sm ${className}`}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={style}
        className={`w-full rounded-lg border-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] px-2 py-0.5 outline-none shadow-sm ${className}`}
      />
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      title="Click to edit text inline"
      style={style}
      className={`group relative inline-block cursor-text rounded-md transition duration-150 hover:bg-[hsl(var(--primary)/.08)] hover:ring-2 hover:ring-[hsl(var(--primary)/.35)] ${className} ${
        !currentText ? "text-[hsl(var(--muted-foreground))] italic" : ""
      }`}
    >
      {currentText || placeholder}
    </Tag>
  );
}
