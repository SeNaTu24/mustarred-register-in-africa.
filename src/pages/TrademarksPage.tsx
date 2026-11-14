import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '../context/CountryContext';
import { useNavigation } from '../context/NavigationContext';
import { CountryFlag } from '../components/common/CountryFlag';
import {
  TRADEMARK_CLASSES_CATALOGUE,
  TRADEMARK_PROCESS_STAGES,
  countWords,
  DRAFT_TRADEMARK_PRIVACY_STATEMENT,
  TRADEMARK_CLASSIFICATION_NOTICE,
} from '../config/trademarks/trademarkData';

type TrademarkViewMode = 'overview' | 'assessing';

interface UploadedLogo {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

export interface MarkClassSelection {
  classes: number[];
  isUnsure: boolean;
  requestReview?: boolean;
}

interface ClassSearchDropdownProps {
  markId: string;
  selectedClasses: number[];
  onToggleClass: (classNum: number) => void;
  onClearClasses: () => void;
}

const ClassSearchDropdown: React.FC<ClassSearchDropdownProps> = ({
  selectedClasses,
  onToggleClass,
  onClearClasses,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'goods' | 'services'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter catalogue based on category filter and search query (class number & heading keywords)
  const filteredClasses = TRADEMARK_CLASSES_CATALOGUE.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const numStr = item.classNumber.toString();
      const matchesNum = numStr === q || numStr.includes(q) || `class ${numStr}`.includes(q);
      const matchesCategory = item.category.toLowerCase().includes(q);
      const matchesHeading = item.heading.toLowerCase().includes(q);
      const keywords = q.split(/\s+/).filter(Boolean);
      const matchesKeywords =
        keywords.length > 0 &&
        keywords.every(
          (kw) =>
            item.heading.toLowerCase().includes(kw) ||
            numStr.includes(kw) ||
            item.category.toLowerCase().includes(kw)
        );
      return matchesNum || matchesCategory || matchesHeading || matchesKeywords;
    }
    return true;
  });

  const goodsFiltered = filteredClasses.filter((c) => c.category === 'goods');
  const servicesFiltered = filteredClasses.filter((c) => c.category === 'services');

  return (
    <div ref={dropdownRef} className="space-y-2 relative">
      {/* Label and selected counter */}
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-800">
          International Classes (Classes 1–45)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">
            {selectedClasses.length}{' '}
            {selectedClasses.length === 1 ? 'class selected' : 'classes selected'}
          </span>
          {selectedClasses.length > 0 && (
            <button
              type="button"
              onClick={onClearClasses}
              className="text-[11px] text-slate-400 hover:text-red-500 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Selected Classes Chips */}
      {selectedClasses.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 min-h-[38px] items-center">
          {selectedClasses
            .slice()
            .sort((a, b) => a - b)
            .map((classNum) => {
              const isGoods = classNum <= 34;
              return (
                <span
                  key={classNum}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-purple-light text-brand-purple border border-brand-purple-border/70 shadow-2xs"
                >
                  <span>
                    Class {classNum} ({isGoods ? 'Goods' : 'Services'})
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleClass(classNum)}
                    className="text-brand-purple hover:text-red-500 p-0.5 rounded transition-colors"
                    title={`Remove Class ${classNum}`}
                    aria-label={`Remove Class ${classNum}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              );
            })}
        </div>
      ) : (
        <div className="text-[11px] text-slate-400 italic">
          No classes selected for this mark. Search or browse from the dropdown below.
        </div>
      )}

      {/* Search & Trigger Input */}
      <div className="relative">
        <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-purple focus-within:ring-1 focus-within:ring-brand-purple transition-colors">
          <div className="pl-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by class number or keyword"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 mr-1"
              title="Clear search"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-slate-700 pr-3"
            aria-label={isOpen ? 'Close class catalogue' : 'Open class catalogue'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu Panel */}
        {isOpen && (
          <div className="absolute z-20 mt-1.5 w-full rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Reference Guidance Notice Banner */}
            <div className="px-3 py-2 bg-amber-50/70 border-b border-amber-200/60 flex items-start gap-2 text-[11px] text-amber-900">
              <svg
                className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="leading-snug">
                {TRADEMARK_CLASSIFICATION_NOTICE}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-brand-dark text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                All (45)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('goods')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  categoryFilter === 'goods'
                    ? 'bg-brand-purple text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Goods (1–34)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('services')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  categoryFilter === 'services'
                    ? 'bg-brand-purple text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Services (35–45)
              </button>
            </div>

            {/* List of classes */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1 text-xs">
              {filteredClasses.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No classes match your search query "{searchQuery}".
                </div>
              ) : (
                <>
                  {/* Goods Section */}
                  {goodsFiltered.length > 0 && (
                    <div>
                      <div className="sticky top-0 z-10 px-3 py-1.5 bg-slate-100/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Goods (Classes 1–34)</span>
                        <span className="text-[9px] text-slate-400 font-medium">Reference Guidance</span>
                      </div>
                      {goodsFiltered.map((c) => {
                        const isSelected = selectedClasses.includes(c.classNumber);
                        return (
                          <div
                            key={c.classNumber}
                            onClick={() => onToggleClass(c.classNumber)}
                            className={`flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-brand-purple-light/50 text-brand-dark'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 w-3.5 h-3.5 accent-brand-purple rounded pointer-events-none shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900">
                                    Class {c.classNumber}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200/60">
                                    Goods
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                                  {c.heading}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="text-[11px] font-bold text-brand-purple shrink-0 mt-0.5">
                                Selected
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Services Section */}
                  {servicesFiltered.length > 0 && (
                    <div>
                      <div className="sticky top-0 z-10 px-3 py-1.5 bg-slate-100/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Services (Classes 35–45)</span>
                        <span className="text-[9px] text-slate-400 font-medium">Reference Guidance</span>
                      </div>
                      {servicesFiltered.map((c) => {
                        const isSelected = selectedClasses.includes(c.classNumber);
                        return (
                          <div
                            key={c.classNumber}
                            onClick={() => onToggleClass(c.classNumber)}
                            className={`flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-brand-purple-light/50 text-brand-dark'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 w-3.5 h-3.5 accent-brand-purple rounded pointer-events-none shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900">
                                    Class {c.classNumber}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
                                    Services
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                                  {c.heading}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="text-[11px] font-bold text-brand-purple shrink-0 mt-0.5">
                                Selected
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom helper */}
            <div className="p-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Click any class to select or deselect.</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-semibold text-brand-purple hover:underline"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TrademarksPage: React.FC = () => {
  const { selectedCountry, setSelectedCountryCode } = useCountry();
  const { navigate } = useNavigation();

  const [viewMode, setViewMode] = useState<TrademarkViewMode>('overview');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Applicant Details
  const [applicantType, setApplicantType] = useState<'individual' | 'company' | ''>('');
  const [applicationRelationship, setApplicationRelationship] = useState<
    'self' | 'representative' | ''
  >('');

  // Step 2: Trademark Details
  const [markType, setMarkType] = useState<'word' | 'logo' | 'both' | ''>('');
  const [words, setWords] = useState<string[]>(['']);
  const [logos, setLogos] = useState<UploadedLogo[]>([]);
  const [goodsServicesDescription, setGoodsServicesDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Class Selections (Keyed by mark ID, e.g. "word-0", "logo-0")
  const [markClassSelections, setMarkClassSelections] = useState<
    Record<string, MarkClassSelection>
  >({});
  const [globalUnsureClasses, setGlobalUnsureClasses] = useState(false);

  // Step 5: Contact Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // General Validation
  const [validationError, setValidationError] = useState('');

  // ── Word Counter ────────────────────────────────────────────────────────────
  const currentWordCount = countWords(goodsServicesDescription);
  const isWordCountSufficient = currentWordCount >= 50;

  // ── Mark Identifiers for Class Mapping ──────────────────────────────────────
  const activeMarks: { id: string; label: string; type: 'word' | 'logo' }[] = [];
  if (markType === 'word' || markType === 'both') {
    words.forEach((w, idx) => {
      if (w.trim()) {
        activeMarks.push({ id: `word-${idx}`, label: `Wordmark: "${w.trim()}"`, type: 'word' });
      }
    });
  }
  if (markType === 'logo' || markType === 'both') {
    logos.forEach((l, idx) => {
      activeMarks.push({ id: `logo-${idx}`, label: `Logo / Design: ${l.name}`, type: 'logo' });
    });
  }

  // Calculate total distinct classes selected and total mark-class combinations
  const allSelectedClassesSet = new Set<number>();
  let totalMarkClassCombinations = 0;
  Object.values(markClassSelections).forEach((item) => {
    item.classes.forEach((c) => {
      allSelectedClassesSet.add(c);
      totalMarkClassCombinations += 1;
    });
  });
  const uniqueClassesCount = allSelectedClassesSet.size;

  // ── Dynamic Mark Handlers ───────────────────────────────────────────────────
  const handleAddWord = () => {
    setWords((prev) => [...prev, '']);
  };

  const handleRemoveWord = (index: number) => {
    if (words.length <= 1) {
      setWords(['']);
    } else {
      setWords((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleWordChange = (index: number, val: string) => {
    setWords((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
    setValidationError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const newUploads: UploadedLogo[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (allowedExtensions.includes(ext)) {
        newUploads.push({
          id: `logo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type || ext,
          file,
        });
      }
    });

    if (newUploads.length === 0) {
      setValidationError('Please select valid JPG, JPEG, PNG, or PDF files.');
      return;
    }

    setLogos((prev) => [...prev, ...newUploads]);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = (id: string) => {
    setLogos((prev) => prev.filter((l) => l.id !== id));
  };

  // ── Class Selection Handlers ────────────────────────────────────────────────
  const handleToggleClassForMark = (markId: string, classNum: number) => {
    setMarkClassSelections((prev) => {
      const current = prev[markId] || { classes: [], isUnsure: false };
      const exists = current.classes.includes(classNum);
      const nextClasses = exists
        ? current.classes.filter((c) => c !== classNum)
        : [...current.classes, classNum];
      return {
        ...prev,
        [markId]: {
          classes: nextClasses,
          isUnsure: false,
          requestReview: current.requestReview,
        },
      };
    });
    setGlobalUnsureClasses(false);
    setValidationError('');
  };

  const handleClearClassesForMark = (markId: string) => {
    setMarkClassSelections((prev) => {
      const current = prev[markId] || { classes: [], isUnsure: false };
      return {
        ...prev,
        [markId]: {
          ...current,
          classes: [],
        },
      };
    });
    setValidationError('');
  };

  const handleToggleReviewForMark = (markId: string) => {
    setMarkClassSelections((prev) => {
      const current = prev[markId] || { classes: [], isUnsure: false };
      return {
        ...prev,
        [markId]: {
          ...current,
          requestReview: !current.requestReview,
        },
      };
    });
    setValidationError('');
  };

  const handleSetApproachForMark = (markId: string, approach: 'choose' | 'recommend') => {
    setMarkClassSelections((prev) => {
      const current = prev[markId] || { classes: [], isUnsure: false };
      return {
        ...prev,
        [markId]: {
          ...current,
          isUnsure: approach === 'recommend',
        },
      };
    });
    setValidationError('');
  };

  // ── Step Navigation ─────────────────────────────────────────────────────────
  const handleStartAssessment = () => {
    setValidationError('');
    setCurrentStep(1);
    setViewMode('assessing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    setValidationError('');

    // Step 1 Validation
    if (currentStep === 1) {
      if (!applicantType) {
        setValidationError('Please select who you are registering the trademark for.');
        return;
      }
      if (!applicationRelationship) {
        setValidationError('Please specify who is making the application.');
        return;
      }
    }

    // Step 2 Validation
    if (currentStep === 2) {
      if (!markType) {
        setValidationError('Please select the type of mark you wish to register.');
        return;
      }

      if (markType === 'word' || markType === 'both') {
        const hasValidWord = words.some((w) => w.trim().length > 0);
        if (!hasValidWord) {
          setValidationError('Please enter at least one word for your wordmark.');
          return;
        }
      }

      if (markType === 'logo' || markType === 'both') {
        if (logos.length === 0) {
          setValidationError('Please upload at least one logo or design file (JPG, PNG, or PDF).');
          return;
        }
      }

      if (!isWordCountSufficient) {
        setValidationError(
          `Please provide a practical description of your goods or services (at least 50 words). Current: ${currentWordCount} words.`
        );
        return;
      }
    }

    // Step 3 Validation
    if (currentStep === 3) {
      if (!globalUnsureClasses) {
        const anyMarkUnconfigured = activeMarks.some((m) => {
          const config = markClassSelections[m.id];
          return !config || (!config.isUnsure && config.classes.length === 0);
        });

        if (anyMarkUnconfigured) {
          setValidationError(
            'Please select at least one class or request Mustarred\'s recommendation for each mark before continuing.'
          );
          return;
        }
      }
    }

    // Move to next step
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewMode('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!contactName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!contactPhone.trim()) {
      setValidationError('Please enter your phone number.');
      return;
    }

    // Honest handling: No false server success message
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setApplicantType('');
    setApplicationRelationship('');
    setMarkType('');
    setWords(['']);
    setLogos([]);
    setGoodsServicesDescription('');
    setMarkClassSelections({});
    setGlobalUnsureClasses(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setIsSubmitted(false);
    setValidationError('');
    setCurrentStep(1);
    setViewMode('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format bytes for file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isNigeria = selectedCountry.code === 'NG';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-purple mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Go back</span>
      </button>

      {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 1: PAGE INTRODUCTION / OVERVIEW
         ───────────────────────────────────────────────────────────────────────────── */}
      {viewMode === 'overview' && (
        <div className="bg-white p-7 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs space-y-8 text-left">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full border border-brand-purple-border/60">
              Intellectual Property
            </span>

            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
              <CountryFlag code={selectedCountry.code} size="sm" />
              <span>{selectedCountry.name}</span>
            </div>
          </div>

          {/* Heading & Description */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              Trademark Registration Request Portal
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Understand what you want to register, identify potentially relevant trademark classes, and request Mustarred's assistance.
            </p>
          </div>

          {/* Country Rules: Nigeria vs Other Jurisdictions */}
          {isNigeria ? (
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-brand-dark">
                  Nigeria Trademark Registration Assessment
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Calibrated for the Trademarks, Patents and Designs Registry, Federal Ministry of Industry, Trade and Investment (FMITI).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-purple">1. Applicant &amp; Mark</span>
                  <p className="text-slate-600">Specify whether filing for an individual or company, and upload word or logo assets.</p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-purple">2. Class Mapping</span>
                  <p className="text-slate-600">Describe goods/services in detail and associate relevant classes or request guidance.</p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-purple">3. Filing Assistance</span>
                  <p className="text-slate-600">Review our 6-stage statutory process and submit your intake details to legal counsel.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartAssessment}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Assess my business</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Consultation-Only Experience for Ghana, Kenya, Côte d'Ivoire */
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-brand-dark">
                  Trademark Advisory in {selectedCountry.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Detailed statutory trademark procedures in this portal are currently calibrated for Nigeria. For{' '}
                  <strong className="text-slate-900">{selectedCountry.name}</strong>, trademark searches, classification under regional property laws, and filing coordination are managed directly through our regional IP legal counsel.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/talk-to-us')}
                  className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  Request Trademark Advisory in {selectedCountry.name} →
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCountryCode('NG')}
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
                >
                  Switch to Nigeria Portal
                </button>
              </div>
            </div>
          )}

          {/* Statutory Reference Footer */}
          <div className="border-t border-slate-100 pt-5 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Official Filing Notice: </span>
            Statutory trademark registration confers exclusive territorial rights. Preliminary search clearance and class specification must be confirmed by accredited IP legal representatives before registry lodgement.
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 2: GUIDED QUESTIONNAIRE (STEPS 1 TO 5)
         ───────────────────────────────────────────────────────────────────────────── */}
      {viewMode === 'assessing' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-left">
          {/* Top Progress Bar */}
          <div className="px-6 py-4 sm:px-8 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                <CountryFlag code={selectedCountry.code} size="sm" />
                <span>Nigeria (FMITI)</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">Trademark Registration Portal</span>
              </div>
              <span className="font-semibold text-slate-500">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            <div className="w-full bg-slate-200/80 rounded-full h-1 mt-3 overflow-hidden">
              <div
                className="bg-brand-purple h-1 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* ── STEP 1: Applicant Details ───────────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Applicant Details
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Tell us about the entity that will own the trademark and who is initiating the application.
                  </p>
                </div>

                {/* Question 1: Who are you registering the trademark for? */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    1. Who are you registering the trademark for? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setApplicantType('individual');
                        setValidationError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                        applicantType === 'individual'
                          ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-brand-dark block">An individual</span>
                        <p className="text-xs text-slate-500">
                          Natural person(s) registering in their personal capacity as the trademark owner.
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          applicantType === 'individual'
                            ? 'border-brand-purple bg-brand-purple text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {applicantType === 'individual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setApplicantType('company');
                        setValidationError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                        applicantType === 'company'
                          ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-brand-dark block">A company</span>
                        <p className="text-xs text-slate-500">
                          Registered corporate body, LLC, enterprise, or incorporated organization.
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          applicantType === 'company'
                            ? 'border-brand-purple bg-brand-purple text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {applicantType === 'company' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Question 2: Who is making the application? */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    2. Who is making the application? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setApplicationRelationship('self');
                        setValidationError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                        applicationRelationship === 'self'
                          ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-brand-dark block">
                          Myself / my company
                        </span>
                        <p className="text-xs text-slate-500">
                          Direct owner, officer, or authorized director applying for own brand assets.
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          applicationRelationship === 'self'
                            ? 'border-brand-purple bg-brand-purple text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {applicationRelationship === 'self' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setApplicationRelationship('representative');
                        setValidationError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                        applicationRelationship === 'representative'
                          ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-brand-dark block">
                          On behalf of someone else
                        </span>
                        <p className="text-xs text-slate-500">
                          External representative, attorney, agent, or advisor applying for a client.
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          applicationRelationship === 'representative'
                            ? 'border-brand-purple bg-brand-purple text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {applicationRelationship === 'representative' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Explanatory Guidance Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-800 block">
                    Why this matters for your trademark ownership
                  </span>
                  <p>
                    Your answer to question 1 determines the intended legal proprietor of the mark on the official register. If registering on behalf of a company, corporate incorporation documents (such as CAC Certificate and Status Report in Nigeria) will be requested during engagement to confirm legal personality.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 2: Trademark Details ────────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Trademark Details
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select your mark format, specify words or designs, and explain the goods or services covered.
                  </p>
                </div>

                {/* Mark Type Selector */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    What type of mark do you want to register? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMarkType('word');
                        setValidationError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        markType === 'word'
                          ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-semibold text-sm text-brand-dark block">Word</span>
                      <p className="text-xs text-slate-500 mt-0.5">Plain brand name, phrase, or slogan text.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMarkType('logo');
                        setValidationError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        markType === 'logo'
                          ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-semibold text-sm text-brand-dark block">Logo or design</span>
                      <p className="text-xs text-slate-500 mt-0.5">Visual graphic, emblem, or stylized mark.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMarkType('both');
                        setValidationError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        markType === 'both'
                          ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-semibold text-sm text-brand-dark block">Both</span>
                      <p className="text-xs text-slate-500 mt-0.5">Separate word names and visual logo files.</p>
                    </button>
                  </div>
                </div>

                {/* Dynamic Word Inputs */}
                {(markType === 'word' || markType === 'both') && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800">
                        Wordmark Name(s) <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddWord}
                        className="text-xs font-semibold text-brand-purple hover:text-brand-purple-hover inline-flex items-center gap-1"
                      >
                        <span>+ Add another word</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {words.map((w, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter trademark name"
                            value={w}
                            onChange={(e) => handleWordChange(index, e.target.value)}
                            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none bg-white"
                          />
                          {words.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveWord(index)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Remove word"
                              aria-label={`Remove word ${index + 1}`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Logo Uploads */}
                {(markType === 'logo' || markType === 'both') && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800">
                        Logo / Design Attachments <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-brand-purple hover:text-brand-purple-hover inline-flex items-center gap-1"
                      >
                        <span>+ Upload another logo/design</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {logos.length === 0 ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-brand-purple p-6 rounded-xl text-center cursor-pointer transition-colors bg-white"
                      >
                        <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-brand-purple block">
                          Click to select JPG, JPEG, PNG, or PDF files
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Files remain stored locally in your browser session only.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {logos.map((logo) => (
                          <div
                            key={logo.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className="w-6 h-6 rounded bg-brand-purple-light text-brand-purple font-bold flex items-center justify-center uppercase text-[10px] shrink-0">
                                {logo.name.split('.').pop()}
                              </span>
                              <div className="truncate">
                                <span className="font-semibold text-slate-800 block truncate">
                                  {logo.name}
                                </span>
                                <span className="text-slate-400 text-[10px]">
                                  {formatFileSize(logo.size)}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveLogo(logo.id)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors shrink-0"
                              title="Remove file"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Goods or Services Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-800">
                      What goods or services will your trademark cover? <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={`text-xs font-semibold ${
                        isWordCountSufficient ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {currentWordCount} / 50 words minimum
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Please describe the products or services you want to protect in at least 50 words. This is a Mustarred intake requirement to help our team understand your business and assess the appropriate trademark classes. It is not a statutory minimum imposed by the Nigerian Trademarks Registry.
                  </p>

                  <textarea
                    rows={4}
                    placeholder="Describe your goods or services"
                    value={goodsServicesDescription}
                    onChange={(e) => {
                      setGoodsServicesDescription(e.target.value);
                      setValidationError('');
                    }}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 3: Trademark Classes ────────────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Trademark Classes
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Associate each of your marks with international Nice Classification classes (Classes 1–45), or request Mustarred's professional recommendation.
                  </p>
                </div>

                {/* Regulatory Classification Status Notice */}
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs space-y-2 leading-relaxed">
                  <div className="flex items-center gap-2 font-semibold text-amber-900">
                    <svg
                      className="w-4 h-4 shrink-0 text-amber-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Classification Reference Guidance (Nice Classification 13th Edition, 2026)</span>
                  </div>
                  <p>
                    The international Nice Classification system organizes marks into 45 distinct classes:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-amber-900">
                    <li>
                      <strong className="font-semibold">Goods (Classes 1–34):</strong> Tangible items, manufactured products, technology hardware, materials, and commodities.
                    </li>
                    <li>
                      <strong className="font-semibold">Services (Classes 35–45):</strong> Commercial services, technology platforms, advertising, financial, consulting, and operational activities.
                    </li>
                  </ul>
                  <p className="text-[11px] text-amber-800/90 pt-0.5">
                    {TRADEMARK_CLASSIFICATION_NOTICE}
                  </p>
                </div>

                {/* Two Complementary Approaches Preference */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="font-semibold text-xs text-slate-900 block">
                        How would you like to determine your classes?
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Choose classes yourself, request our legal recommendation, or combine both approaches.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setGlobalUnsureClasses(false);
                          setValidationError('');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          !globalUnsureClasses
                            ? 'bg-brand-purple text-white border-brand-purple shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Configure per mark
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGlobalUnsureClasses(true);
                          setValidationError('');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          globalUnsureClasses
                            ? 'bg-brand-purple text-white border-brand-purple shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Recommend for all marks
                      </button>
                    </div>
                  </div>

                  {globalUnsureClasses ? (
                    <div className="p-3 rounded-lg bg-brand-purple-light/40 border border-brand-purple-border/70 text-xs text-brand-dark space-y-1">
                      <span className="font-semibold text-brand-purple block">
                        Full Legal Recommendation Requested
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Mustarred's intellectual property counsel will review your 50+ word goods/services description and evaluate your business activities to determine all appropriate statutory Nice classes across all your marks. No manual class selection is required.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200/80 pt-2">
                      You can select classes for each mark below using the searchable dropdown, and optionally request attorney review of your chosen classes. You may also request recommendations for individual marks.
                    </p>
                  )}
                </div>

                {/* Per-Mark Class Selectors (when not globalUnsureClasses) */}
                {!globalUnsureClasses && activeMarks.length > 0 && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Configure Classes for Each Mark ({activeMarks.length}):
                    </h4>

                    {activeMarks.map((mark) => {
                      const markConfig = markClassSelections[mark.id] || { classes: [], isUnsure: false };
                      return (
                        <div
                          key={mark.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs"
                        >
                          {/* Mark Title & Type */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-2 h-2 rounded-full bg-brand-purple shrink-0"></span>
                              <span className="font-bold text-sm text-brand-dark truncate">
                                {mark.label}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                              {mark.type === 'word' ? 'Wordmark' : 'Logo / Design'}
                            </span>
                          </div>

                          {/* Dual Approach Options for this mark */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Option 1: I'll choose my classes */}
                            <button
                              type="button"
                              onClick={() => handleSetApproachForMark(mark.id, 'choose')}
                              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                                !markConfig.isUnsure
                                  ? 'border-brand-purple bg-brand-purple-light/30 ring-1 ring-brand-purple shadow-2xs'
                                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                              }`}
                            >
                              <div
                                className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  !markConfig.isUnsure
                                    ? 'border-brand-purple bg-brand-purple text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {!markConfig.isUnsure && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-slate-900 block">
                                  I'll choose my classes
                                </span>
                                <span className="text-[11px] text-slate-500 mt-0.5 block leading-normal">
                                  Search and select from Nice Classes 1–45.
                                </span>
                              </div>
                            </button>

                            {/* Option 2: Help me find the right classes */}
                            <button
                              type="button"
                              onClick={() => handleSetApproachForMark(mark.id, 'recommend')}
                              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                                markConfig.isUnsure
                                  ? 'border-brand-purple bg-brand-purple-light/30 ring-1 ring-brand-purple shadow-2xs'
                                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                              }`}
                            >
                              <div
                                className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  markConfig.isUnsure
                                    ? 'border-brand-purple bg-brand-purple text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {markConfig.isUnsure && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-slate-900 block">
                                  Help me find the right classes
                                </span>
                                <span className="text-[11px] text-slate-500 mt-0.5 block leading-normal">
                                  Mustarred recommends classes from your description.
                                </span>
                              </div>
                            </button>
                          </div>

                          {/* Selected Approach View */}
                          {!markConfig.isUnsure ? (
                            <div className="space-y-3.5 pt-1">
                              {/* Searchable Dropdown */}
                              <ClassSearchDropdown
                                markId={mark.id}
                                selectedClasses={markConfig.classes}
                                onToggleClass={(classNum) => handleToggleClassForMark(mark.id, classNum)}
                                onClearClasses={() => handleClearClassesForMark(mark.id)}
                              />

                              {/* Request Professional Review Checkbox (Combining self-selection + review) */}
                              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={Boolean(markConfig.requestReview)}
                                  onChange={() => handleToggleReviewForMark(mark.id)}
                                  className="mt-0.5 w-4 h-4 accent-brand-purple rounded shrink-0 cursor-pointer"
                                />
                                <div className="text-xs space-y-0.5">
                                  <span className="font-semibold text-slate-900 block">
                                    Request attorney review of these selections
                                  </span>
                                  <span className="text-slate-500 text-[11px] leading-normal block">
                                    Have Mustarred's trademark counsel review your selected classes against your 50+ word goods/services description to verify applicability and recommend any complementary classes.
                                  </span>
                                </div>
                              </label>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80 text-xs text-brand-dark space-y-1.5">
                              <div className="flex items-center gap-1.5 font-semibold text-brand-purple">
                                <svg
                                  className="w-4 h-4 shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>Mustarred Class Recommendation Requested</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed text-[11px]">
                                Our trademark legal team will review your goods and services description from Step 2 and recommend the statutory Nice classes suited to this mark. No prior classification knowledge is required.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Metrics Summary Bar: Displays both unique classes and total mark-class combinations */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Classification Metrics &amp; Filing Summary
                    </span>
                    {globalUnsureClasses && (
                      <span className="text-[11px] font-semibold text-brand-purple bg-brand-purple-light px-2 py-0.5 rounded-full">
                        Legal Recommendation Active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Total Unique Classes Selected
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xl font-bold text-slate-900">
                          {uniqueClassesCount}
                        </span>
                        <span className="text-xs text-slate-500">
                          {uniqueClassesCount === 1 ? 'distinct class' : 'distinct classes'} across all marks
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Total Mark–Class Selections
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xl font-bold text-brand-purple">
                          {totalMarkClassCombinations}
                        </span>
                        <span className="text-xs text-slate-500">
                          {totalMarkClassCombinations === 1
                            ? 'mark–class combination'
                            : 'mark–class combinations'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Assistance Note */}
                  <div className="text-[11px] text-slate-500 pt-1 leading-normal">
                    {globalUnsureClasses ? (
                      <span>
                        Full legal classification assistance requested. Mustarred will determine and confirm all statutory classes prior to filing.
                      </span>
                    ) : (
                      <span>
                        {totalMarkClassCombinations > 0 ? (
                          <>
                            {totalMarkClassCombinations} mark–class selection(s) configured across {uniqueClassesCount} distinct international {uniqueClassesCount === 1 ? 'class' : 'classes'}.
                          </>
                        ) : (
                          'No specific classes selected yet. You can choose classes above or request Mustarred recommendations.'
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Our Process ──────────────────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Our Trademark Registration Process
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    A clear overview of the statutory process from initial preliminary intake to final certificate issuance.
                  </p>
                </div>

                {/* Six-Stage Timeline Grid */}
                <div className="space-y-3">
                  {TRADEMARK_PROCESS_STAGES.map((stage) => (
                    <div
                      key={stage.stepNumber}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-4 shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-purple-light text-brand-purple font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border border-brand-purple-border/70">
                        {stage.stepNumber}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-brand-dark">
                          Stage {stage.stepNumber}: {stage.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {stage.shortDescription}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transparent Process Note */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    Statutory Timelines &amp; Examination Note:
                  </span>
                  Registry examination, journal publication windows, and certificate processing are governed strictly by the Trademarks Registry (FMITI in Nigeria). Turnaround times and outcomes cannot be guaranteed prior to formal registry examination.
                </div>
              </div>
            )}

            {/* ── STEP 5: Request Assistance ───────────────────────────── */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Request Assistance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Provide your contact details. Your complete trademark specification will be packaged directly for our legal team.
                  </p>
                </div>

                {/* Carried-Forward Answers Summary */}
                <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="font-semibold text-brand-purple uppercase text-[11px]">
                      Your Trademark Specification Summary
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedCountry.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700">
                    <p>
                      <span className="text-slate-400">Applicant Type:</span>{' '}
                      <span className="font-semibold text-slate-900 capitalize">
                        {applicantType || 'Not specified'}
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-400">Application By:</span>{' '}
                      <span className="font-semibold text-slate-900">
                        {applicationRelationship === 'self' ? 'Myself / My Company' : 'Representative'}
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-400">Mark Type:</span>{' '}
                      <span className="font-semibold text-slate-900 capitalize">
                        {markType || 'Not specified'}
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-400">Classes Specification:</span>{' '}
                      <span className="font-semibold text-slate-900">
                        {globalUnsureClasses
                          ? 'Assistance requested (All marks)'
                          : `${uniqueClassesCount} unique (${totalMarkClassCombinations} mark–class ${
                              totalMarkClassCombinations === 1 ? 'filing' : 'filings'
                            })`}
                      </span>
                    </p>
                  </div>

                  {/* Marks detail */}
                  <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                    <span className="text-slate-400 block font-medium">Marks to be filed:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                      {activeMarks.map((m) => {
                        const sel = markClassSelections[m.id];
                        let note = '';
                        if (globalUnsureClasses || sel?.isUnsure) {
                          note = ' — Recommendation requested';
                        } else if (sel && sel.classes.length > 0) {
                          note = ` — Classes ${sel.classes
                            .slice()
                            .sort((a, b) => a - b)
                            .join(', ')}${sel.requestReview ? ' (Review requested)' : ''}`;
                        }
                        return (
                          <li key={m.id} className="truncate">
                            <span>{m.label}</span>
                            {note && <span className="text-slate-500 font-normal">{note}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Description preview */}
                  <div className="pt-1.5 border-t border-slate-200/60 space-y-0.5">
                    <span className="text-slate-400 block font-medium">
                      Goods &amp; Services ({currentWordCount} words):
                    </span>
                    <p className="text-slate-600 line-clamp-2 italic">
                      "{goodsServicesDescription}"
                    </p>
                  </div>
                </div>

                {isSubmitted ? (
                  /* Honest Offline Confirmation State */
                  <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">
                      Trademark Intake Saved (Offline Demonstration)
                    </span>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Direct online dispatch and file uploads are pending backend integration. No external message or files were transmitted over the network. Your answers have been recorded in local application state.
                    </p>
                    <div className="text-xs bg-amber-100/50 p-3 rounded-lg space-y-1 text-amber-950 border border-amber-200/70">
                      <p><span className="font-semibold">Contact:</span> {contactName}</p>
                      <p><span className="font-semibold">Email:</span> {contactEmail}</p>
                      <p><span className="font-semibold">Phone:</span> {contactPhone}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                      >
                        ← Edit Contact Details
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                      >
                        Start New Assessment
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Contact Form */
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={contactName}
                        onChange={(e) => {
                          setContactName(e.target.value);
                          setValidationError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="Email address"
                          value={contactEmail}
                          onChange={(e) => {
                            setContactEmail(e.target.value);
                            setValidationError('');
                          }}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Phone number"
                          value={contactPhone}
                          onChange={(e) => {
                            setContactPhone(e.target.value);
                            setValidationError('');
                          }}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                        />
                      </div>
                    </div>

                    {/* Draft Privacy Statement */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
                      {DRAFT_TRADEMARK_PRIVACY_STATEMENT}
                    </div>

                    {/* Validation Notice */}
                    {validationError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                        {validationError}
                      </div>
                    )}

                    {/* Submit Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        ← Back to Process
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-xs transition-all"
                      >
                        Submit Trademark Request →
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Validation Message during steps 1 to 4 */}
            {currentStep < 5 && validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {validationError}
              </div>
            )}

            {/* Navigation buttons for steps 1 to 4 */}
            {currentStep < 5 && (
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-xs transition-all"
                >
                  {currentStep === 4 ? 'Continue to Request Assistance →' : 'Continue →'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
