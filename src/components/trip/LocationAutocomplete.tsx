import { useCallback, useEffect, useMemo, useState } from "react";

import { X } from "lucide-react";

import type { Location } from "@/types/common";
import { useGeocode } from "@/hooks/useGeocode";
import {
  DROPDOWN_ITEM,
  DROPDOWN_ITEM_ACTIVE,
  DROPDOWN_MENU,
  INPUT_BASE,
  LABEL,
} from "@/lib/styles";
import { Spinner } from "@/components/ui/Spinner";

interface LocationAutocompleteProps {
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  initialValue?: Location | null;
  onSelect: (location: Location) => void;
  onClear?: () => void;
}

export function LocationAutocomplete({
  label,
  name,
  placeholder,
  required = false,
  initialValue = null,
  onSelect,
  onClear,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState<string>(
    initialValue?.label ?? "",
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { suggestions, isSearching } = useGeocode(inputValue);

  useEffect(() => {
    if (initialValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(initialValue.label);
    }
  }, [initialValue]);

  useEffect(() => {
    if (suggestions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  }, [suggestions]);

  const hasSuggestions = suggestions.length > 0;

  const listId = useMemo(
    () => (name ? `${name}-suggestions` : undefined),
    [name],
  );

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setIsOpen(value.trim().length >= 3);
    },
    [],
  );

  const handleSelectIndex = useCallback(
    (index: number) => {
      const suggestion = suggestions[index];
      if (!suggestion) {
        return;
      }

      const location: Location = {
        label: suggestion.label,
        coordinates: suggestion.coordinates,
      };

      setInputValue(location.label);
      setIsOpen(false);
      onSelect(location);
    },
    [onSelect, suggestions],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!hasSuggestions && event.key !== "Escape") {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (suggestions.length === 0) {
            return null;
          }
          const next = current === null ? 0 : current + 1;
          return next >= suggestions.length ? 0 : next;
        });
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => {
          if (suggestions.length === 0) {
            return null;
          }
          const prev = current === null ? suggestions.length - 1 : current - 1;
          return prev < 0 ? suggestions.length - 1 : prev;
        });
        return;
      }

      if (event.key === "Enter" && activeIndex !== null) {
        event.preventDefault();
        handleSelectIndex(activeIndex);
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    },
    [activeIndex, handleSelectIndex, hasSuggestions, suggestions.length],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setIsOpen(false);
    setActiveIndex(null);
    onClear?.();
  }, [onClear]);

  const handleBlur = useCallback(() => {
    // Close dropdown shortly after blur to allow click selection.
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  }, []);

  return (
    <div className="relative">
      <label className={LABEL}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          className={`${INPUT_BASE} pr-8`}
          placeholder={placeholder}
          autoComplete="off"
          value={inputValue}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listId}
        />
        {inputValue.length > 0 && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={handleClear}
            aria-label="Clear location"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={DROPDOWN_MENU} id={listId}>
          {isSearching && (
            <div className="flex items-center justify-center px-3 py-2 text-sm text-slate-500">
              <Spinner size="sm" className="mr-2" />
              <span>Searching locations...</span>
            </div>
          )}

          {!isSearching && !hasSuggestions && (
            <div className="px-3 py-2 text-sm text-slate-400">
              No results found
            </div>
          )}

          {!isSearching &&
            suggestions.map((suggestion, index) => {
              const isActive = index === activeIndex;
              const itemClassName = isActive
                ? DROPDOWN_ITEM_ACTIVE
                : DROPDOWN_ITEM;

              return (
                <div
                  key={`${suggestion.label}-${index.toString()}`}
                  className={itemClassName}
                  onMouseDown={(event) => {
                    // Prevent input blur before selection.
                    event.preventDefault();
                    handleSelectIndex(index);
                  }}
                  role="option"
                  aria-selected={isActive}
                >
                  {suggestion.label}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

