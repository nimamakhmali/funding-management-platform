import React from "react";

interface Props {
  id: string;
  name: string;
  value: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export default function SelectionCard({
  id,
  name,
  value,
  icon,
  title,
  description,
  isChecked,
  onChange,
  disabled = false,
  className = "",
}: Props) {
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  return (
    <div className={`relative ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
      />
      <label
        htmlFor={id}
        id={labelId}
        className={`
          label-selection-card border-transparent cursor-pointer group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 
          bg-gray-50 hover:bg-gray-100 transition-all duration-200
          peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary
          peer-checked:border-primary peer-checked:bg-primary/5
          peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:hover:bg-gray-50
          ${disabled ? "pointer-events-none" : ""}
        `}
      >
        <div
          className="mb-3 p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform text-gray-400 group-hover:text-primary peer-checked:group-[]:text-primary"
          aria-hidden="true"
        >
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <span className="font-bold text-lg">{title}</span>
        <span id={descriptionId} className="text-xs text-text-secondary mt-1">
          {description}
        </span>
        <div
          className="absolute top-3 right-3 opacity-0 text-primary peer-checked:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          <span className="material-symbols-outlined">check_circle</span>
        </div>
      </label>
    </div>
  );
}
