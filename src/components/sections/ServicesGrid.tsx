import React from 'react';
import { REGISTRATION_SERVICES } from '../../config/services';
import { ServiceCard } from '../common/ServiceCard';
import { useCountry } from '../../context/CountryContext';
import { CountryFlag } from '../common/CountryFlag';

export const ServicesGrid: React.FC = () => {
  const { selectedCountry } = useCountry();

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-slate-100 gap-4 text-left">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Service Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark mt-1">
              Registration Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Showing availability, regulatory authorities, and requirements for{' '}
              <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5 align-middle">
                <CountryFlag code={selectedCountry.code} size="sm" />
                <span>{selectedCountry.name}</span>
              </span>
              . Select any service to explore compliance criteria.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/80 shrink-0 self-start md:self-auto">
            Note: Single-country frameworks (such as DCMI) are marked accordingly.
          </div>
        </div>

        {/* 4 Registration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-left">
          {REGISTRATION_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
