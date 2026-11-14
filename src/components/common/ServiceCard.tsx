import React from 'react';
import { ServiceItem } from '../../types';
import { useCountry } from '../../context/CountryContext';
import { useNavigation } from '../../context/NavigationContext';
import { CountryFlag } from './CountryFlag';

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { selectedCountry, getServiceConfig } = useCountry();
  const { navigate } = useNavigation();
  const config = getServiceConfig(service);

  const isAvailable = config.status === 'available';
  const isNotApplicable = config.status === 'not_applicable';

  const handleCardClick = () => {
    navigate(service.path as any);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border transition-all duration-200 cursor-pointer ${
        isAvailable
          ? 'border-slate-200/90 hover:border-brand-purple hover:shadow-md'
          : isNotApplicable
          ? 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300'
          : 'border-slate-200/90 hover:border-brand-purple/70 hover:shadow-sm'
      }`}
    >
      <div className="space-y-4">
        {/* Category & Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            {service.category}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                : isNotApplicable
                ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                : 'bg-brand-purple-light text-brand-purple border border-brand-purple-border/70'
            }`}
          >
            {config.statusBadge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-purple transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {service.summary}
        </p>

        {/* Country-Specific Context Box */}
        <div className="pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5">
              <CountryFlag code={selectedCountry.code} size="sm" />
              <span className="font-semibold text-slate-800">
                {selectedCountry.name} Status:
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              {config.notes}
            </p>
            {config.regulatorName && (
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-baseline gap-1">
                <span className="font-medium text-slate-700">Authority:</span>
                <span>{config.regulatorName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
        <span
          className={`inline-flex items-center gap-1.5 transition-colors ${
            isAvailable
              ? 'text-brand-purple group-hover:underline'
              : 'text-slate-600 group-hover:text-brand-dark'
          }`}
        >
          <span>
            {isAvailable ? 'View Requirements & Guidance' : 'Explore Service Details'}
          </span>
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
};
