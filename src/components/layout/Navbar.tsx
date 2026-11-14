import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { CountrySelector } from '../common/CountrySelector';
import { MustarredLogo } from '../common/MustarredLogo';
import { AppRoute } from '../../types';

interface NavItem {
  label: string;
  path: AppRoute;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Company Registration', path: '/cac-registration' },
  { label: 'DCMI', path: '/dcmi' },
  { label: 'Trademarks', path: '/trademarks' },
  { label: 'Licences', path: '/licences' },
  { label: 'Contact Us', path: '/talk-to-us' },
];

export const Navbar: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: AppRoute) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleNavClick('/')}
              className="flex items-center text-left focus:outline-none"
              aria-label="Mustarred Home"
            >
              <MustarredLogo widthClass="w-[120px] sm:w-[150px]" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-brand-purple-light text-brand-purple'
                      : 'text-slate-700 hover:text-brand-purple hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Country Selector & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <CountrySelector variant="navbar" />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-brand-purple hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-purple-light text-brand-purple font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-brand-purple'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
