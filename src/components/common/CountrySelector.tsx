import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '../../context/CountryContext';
import { CountryCode } from '../../types';
import { CountryFlag } from './CountryFlag';

interface CountrySelectorProps {
  variant?: 'navbar' | 'prominent';
}

const formatCountryLabel = (name: string, registry?: string) =>
  registry ? `${name} — ${registry}` : name;

export const CountrySelector: React.FC<CountrySelectorProps> = ({ variant = 'navbar' }) => {
  const { selectedCountry, setSelectedCountryCode, allCountries } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CountryCode) => {
    setSelectedCountryCode(code);
    setIsOpen(false);
  };

  if (variant === 'prominent') {
    return (
      <div className="relative inline-block w-full max-w-md text-left" ref={dropdownRef}>
        <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
          Select Your Country / Jurisdiction
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-brand-purple/20 hover:border-brand-purple rounded-xl shadow-sm hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        >
          <div className="flex items-center space-x-3">
            <CountryFlag code={selectedCountry.code} size="lg" />
            <div className="text-left">
              <span className="block font-semibold text-brand-dark text-base">
                {formatCountryLabel(selectedCountry.name, selectedCountry.registry)}
              </span>
              <span className="block text-xs text-brand-muted">
                {selectedCountry.region} • Requirements adapt to this selection
              </span>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-brand-purple transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            <div className="p-2 bg-slate-50 text-xs font-medium text-brand-muted">
              Configured African Jurisdictions
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {allCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country.code)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-brand-purple-light text-brand-purple font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CountryFlag code={country.code} size="md" />
                      <div>
                        <span>{formatCountryLabel(country.name, country.registry)}</span>
                        <span className="block text-xs text-slate-400">{country.region}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <svg className="w-4 h-4 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Navbar variant
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-purple bg-white text-xs font-medium text-brand-dark hover:text-brand-purple transition-colors shadow-sm focus:outline-none"
      >
        <CountryFlag code={selectedCountry.code} size="sm" />
        <span className="hidden sm:inline font-semibold">{selectedCountry.name}</span>
        <span className="sm:hidden font-semibold">{selectedCountry.code}</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Switch Country
          </div>
          {allCountries.map((country) => {
            const isSelected = country.code === selectedCountry.code;
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-brand-purple-light text-brand-purple font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CountryFlag code={country.code} size="sm" />
                  <span>{formatCountryLabel(country.name, country.registry)}</span>
                </div>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
