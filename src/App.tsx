import React from 'react';
import { CountryProvider } from './context/CountryContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { CacPage } from './pages/CacPage';
import { DcmiPage } from './pages/DcmiPage';
import { TrademarksPage } from './pages/TrademarksPage';
import { LicencesPage } from './pages/LicencesPage';
import { TalkToUsPage } from './pages/TalkToUsPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const { currentRoute } = useNavigation();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/cac-registration':
        return <CacPage />;
      case '/dcmi':
        return <DcmiPage />;
      case '/trademarks':
        return <TrademarksPage />;
      case '/licences':
        return <LicencesPage />;
      case '/talk-to-us':
        return <TalkToUsPage />;
      case '/':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-brand-purple-light selection:text-brand-purple">
      <Navbar />
      <div className="flex-1">
        <ErrorBoundary>
          {renderCurrentPage()}
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <CountryProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </CountryProvider>
    </ErrorBoundary>
  );
}
