import React from "react";
import { useNavigation } from "../../context/NavigationContext";

export const CtaSection: React.FC = () => {
    const { navigate } = useNavigation();

    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight mb-4">
                        Can&apos;t Find What You Need? Talk to Our Team.
                    </h2>

                    <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
                        Need cross-border registrations, specialized fintech
                        authorisations, or assistance in a country not yet
                        listed? Our legal advisory team is available to help.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/talk-to-us")}
                        className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold shadow-md shadow-brand-purple/20 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    >
                        <span>Talk to Our Team</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};
