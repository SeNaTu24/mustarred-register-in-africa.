import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { MustarredLogo } from '../common/MustarredLogo';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <MustarredLogo widthClass="w-[140px] sm:w-[150px]" />
            <p className="text-xs text-slate-500 leading-relaxed max-w-md pt-1">
              A structured guidance platform helping founders, businesses, and legal counsels explore corporate,
              brand, and regulatory registration services across African jurisdictions.
            </p>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/cac-registration')}
                  className="hover:text-brand-purple transition-colors"
                >
                  Company Registration
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/dcmi')}
                  className="hover:text-brand-purple transition-colors"
                >
                  DCMI (Data Protection)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/trademarks')}
                  className="hover:text-brand-purple transition-colors"
                >
                  Trademarks & IP
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/licences')}
                  className="hover:text-brand-purple transition-colors"
                >
                  Commercial Licences
                </button>
              </li>
            </ul>
          </div>

          {/* Inquiries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Consultation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/talk-to-us')}
                  className="text-brand-purple font-semibold hover:underline"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Links & Copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <a
              href="https://www.mustarred.com/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-purple transition-colors"
            >
              Terms of Use
            </a>
            <a
              href="https://www.mustarred.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-purple transition-colors"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} Mustarred. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
