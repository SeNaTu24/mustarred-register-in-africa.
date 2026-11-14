import React, { createContext, useContext, useState } from 'react';
import { Country, CountryCode, ServiceItem, ServiceCountryConfig } from '../types';
import { SUPPORTED_COUNTRIES, DEFAULT_COUNTRY_CODE, getCountryByCode } from '../config/countries';

interface CountryContextValue {
  selectedCountry: Country;
  setSelectedCountryCode: (code: CountryCode) => void;
  allCountries: Country[];
  getServiceConfig: (service: ServiceItem) => ServiceCountryConfig;
}

const CountryContext = createContext<CountryContextValue | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countryCode, setCountryCode] = useState<CountryCode>(() => {
    try {
      const stored = localStorage.getItem('ria_selected_country') as CountryCode | null;
      if (stored && SUPPORTED_COUNTRIES.some((c) => c.code === stored)) {
        return stored;
      }
      if (stored) {
        // Clear hidden or legacy selections (e.g. 'RW') so users don't remain stuck
        localStorage.setItem('ria_selected_country', DEFAULT_COUNTRY_CODE);
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_COUNTRY_CODE;
  });

  const selectedCountry = getCountryByCode(countryCode);

  const setSelectedCountryCode = (code: CountryCode) => {
    const nextCode = SUPPORTED_COUNTRIES.some((c) => c.code === code)
      ? code
      : DEFAULT_COUNTRY_CODE;
    setCountryCode(nextCode);
    try {
      localStorage.setItem('ria_selected_country', nextCode);
    } catch {
      // Ignore localStorage errors
    }
  };

  const getServiceConfig = (service: ServiceItem): ServiceCountryConfig => {
    return (
      service.countryConfigs[selectedCountry.code] || {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: 'Consult our advisory team for country-specific registration guidance.',
      }
    );
  };

  return (
    <CountryContext.Provider
      value={{
        selectedCountry,
        setSelectedCountryCode,
        allCountries: SUPPORTED_COUNTRIES,
        getServiceConfig,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export function useCountry(): CountryContextValue {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
