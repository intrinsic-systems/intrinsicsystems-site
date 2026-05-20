import React from "react";

export type ResponseScaleOption = {
  value: string;
  label: string;
  hint: string;
  short: string;
};

type Props = {
  options: ResponseScaleOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export const ResponseScale: React.FC<Props> = ({
  options,
  selectedValue,
  onSelect,
  disabled = false,
}) => {
  return (
    <div
      className="o-response-scale"
      role="radiogroup"
      aria-label="Assessment response scale"
    >
      {options.map((option, index) => {
        const selected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(option.value)}
            className={
              "o-response-scale__option" +
              ` o-response-scale__option--level-${index + 1}` +
              (selected ? " o-response-scale__option--selected" : "")
            }
          >
            <span className="o-response-scale__top">
              <span className="o-response-scale__index">{index + 1}</span>
              <span className="o-response-scale__short">{option.short}</span>
            </span>

            <span className="o-response-scale__label">{option.label}</span>
            <span className="o-response-scale__hint">{option.hint}</span>
          </button>
        );
      })}
    </div>
  );
};