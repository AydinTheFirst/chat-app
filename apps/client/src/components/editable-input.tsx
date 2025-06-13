import React, { useEffect, useRef, useState } from "react";

interface EditableTextProps {
  className?: string;
  disabled?: boolean;
  inputClassName?: string;
  onSave: (newValue: string) => Promise<void> | void;
  placeholder?: string;
  rows?: number;
  textarea?: boolean;
  value: string;
}

export default function EditableText({
  className,
  disabled = false,
  inputClassName,
  onSave,
  placeholder,
  rows = 3,
  textarea = false,
  value
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  // Edit moda girince inputa odaklan
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // İstersen cursoru sona taşı
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [editing]);

  const saveAndExit = async () => {
    if (text.trim() === value.trim()) {
      setEditing(false);
      return;
    }
    try {
      await onSave(text.trim());
      setEditing(false);
    } catch {
      // İstersen hata yönetimi ekle
    }
  };

  const cancelAndExit = () => {
    setText(value);
    setEditing(false);
  };

  if (disabled) {
    return <span className={className}>{value || placeholder}</span>;
  }

  return (
    <div
      className={className}
      onClick={() => !editing && setEditing(true)}
    >
      {!editing ? (
        <span>{value || placeholder || "—"}</span>
      ) : textarea ? (
        <textarea
          className={inputClassName}
          onBlur={saveAndExit}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancelAndExit();
            }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              saveAndExit();
            }
          }}
          placeholder={placeholder}
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          rows={rows}
          value={text}
        />
      ) : (
        <input
          className={inputClassName}
          onBlur={saveAndExit}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancelAndExit();
            }
            if (e.key === "Enter") {
              e.preventDefault();
              saveAndExit();
            }
          }}
          placeholder={placeholder}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type='text'
          value={text}
        />
      )}
    </div>
  );
}
