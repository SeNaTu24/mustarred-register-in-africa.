import React, { useState, useRef, useEffect } from "react";
import { useCountry } from "../context/CountryContext";
import { useNavigation } from "../context/NavigationContext";
import { CountryFlag } from "../components/common/CountryFlag";
import {
    TRADEMARK_CLASSES_CATALOGUE,
    TRADEMARK_PROCESS_STAGES,
    DRAFT_TRADEMARK_PRIVACY_STATEMENT,
    TRADEMARK_CLASSIFICATION_NOTICE,
} from "../config/trademarks/trademarkData";

type TrademarkViewMode = "overview" | "assessing";

interface UploadedLogo {
    id: string;
    name: string;
    size: number;
    type: string;
    file?: File;
}

export type MarkDeterminationApproach = "choose" | "recommend" | "both";

export interface MarkClassSelection {
    approach: MarkDeterminationApproach;
    classes: number[];
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
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<
        "all" | "goods" | "services"
    >("all");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const filteredClasses = TRADEMARK_CLASSES_CATALOGUE.filter((item) => {
        if (categoryFilter !== "all" && item.category !== categoryFilter) {
            return false;
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const numStr = item.classNumber.toString();
            const matchesNum =
                numStr === q ||
                numStr.includes(q) ||
                `class ${numStr}`.includes(q);
            const matchesCategory = item.category.toLowerCase().includes(q);
            const matchesHeading = item.heading.toLowerCase().includes(q);
            const keywords = q.split(/\s+/).filter(Boolean);
            const matchesKeywords =
                keywords.length > 0 &&
                keywords.every(
                    (kw) =>
                        item.heading.toLowerCase().includes(kw) ||
                        numStr.includes(kw) ||
                        item.category.toLowerCase().includes(kw),
                );
            return (
                matchesNum ||
                matchesCategory ||
                matchesHeading ||
                matchesKeywords
            );
        }
        return true;
    });

    const goodsFiltered = filteredClasses.filter((c) => c.category === "goods");
    const servicesFiltered = filteredClasses.filter(
        (c) => c.category === "services",
    );

    return (
        <div ref={dropdownRef} className="space-y-2 relative">
            <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">
                    International Classes (Classes 1–45)
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">
                        {selectedClasses.length}{" "}
                        {selectedClasses.length === 1
                            ? "class selected"
                            : "classes selected"}
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
                                        Class {classNum} (
                                        {isGoods ? "Goods" : "Services"})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onToggleClass(classNum)}
                                        className="text-brand-purple hover:text-red-500 p-0.5 rounded transition-colors"
                                        title={`Remove Class ${classNum}`}
                                        aria-label={`Remove Class ${classNum}`}
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
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
                    No classes selected for this mark yet. Search or browse from
                    the dropdown below.
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-left text-xs sm:text-sm flex items-center justify-between gap-2 hover:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all"
            >
                <span className="text-slate-500 truncate">
                    {selectedClasses.length > 0
                        ? `Change class selection (${selectedClasses.length} selected)...`
                        : "Search and select international classes..."}
                </span>
                <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-96 overflow-hidden flex flex-col">
                    <div className="p-2.5 border-b border-slate-200 bg-slate-50/70">
                        <input
                            type="text"
                            placeholder="Search by class number or keyword"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-brand-purple bg-white"
                            autoFocus
                        />
                    </div>

                    <div className="p-2.5 bg-amber-50/70 border-b border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
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

                    <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-xs">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">
                            Filter:
                        </span>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter("all")}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                                categoryFilter === "all"
                                    ? "bg-brand-purple text-white"
                                    : "text-slate-600 hover:bg-slate-200/70"
                            }`}
                        >
                            All (1–45)
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter("goods")}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                                categoryFilter === "goods"
                                    ? "bg-brand-purple text-white"
                                    : "text-slate-600 hover:bg-slate-200/70"
                            }`}
                        >
                            Goods (1–34)
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter("services")}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                                categoryFilter === "services"
                                    ? "bg-brand-purple text-white"
                                    : "text-slate-600 hover:bg-slate-200/70"
                            }`}
                        >
                            Services (35–45)
                        </button>
                    </div>

                    <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
                        {filteredClasses.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400">
                                No classes match your search query. Try another
                                keyword or class number.
                            </div>
                        ) : (
                            <>
                                {(categoryFilter === "all" ||
                                    categoryFilter === "goods") &&
                                    goodsFiltered.length > 0 && (
                                        <div className="mb-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 bg-slate-50 rounded">
                                                Goods (Classes 1–34)
                                            </div>
                                            {goodsFiltered.map((cls) => {
                                                const isSelected =
                                                    selectedClasses.includes(
                                                        cls.classNumber,
                                                    );
                                                return (
                                                    <label
                                                        key={cls.classNumber}
                                                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                                                            isSelected
                                                                ? "bg-brand-purple-light/40"
                                                                : "hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                onToggleClass(
                                                                    cls.classNumber,
                                                                )
                                                            }
                                                            className="mt-0.5 w-3.5 h-3.5 accent-brand-purple rounded shrink-0 cursor-pointer"
                                                        />
                                                        <div className="space-y-0.5">
                                                            <span className="font-bold text-slate-900 block">
                                                                Class{" "}
                                                                {
                                                                    cls.classNumber
                                                                }
                                                            </span>
                                                            <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
                                                                {cls.heading}
                                                            </p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                {(categoryFilter === "all" ||
                                    categoryFilter === "services") &&
                                    servicesFiltered.length > 0 && (
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 bg-slate-50 rounded">
                                                Services (Classes 35–45)
                                            </div>
                                            {servicesFiltered.map((cls) => {
                                                const isSelected =
                                                    selectedClasses.includes(
                                                        cls.classNumber,
                                                    );
                                                return (
                                                    <label
                                                        key={cls.classNumber}
                                                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                                                            isSelected
                                                                ? "bg-brand-purple-light/40"
                                                                : "hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                onToggleClass(
                                                                    cls.classNumber,
                                                                )
                                                            }
                                                            className="mt-0.5 w-3.5 h-3.5 accent-brand-purple rounded shrink-0 cursor-pointer"
                                                        />
                                                        <div className="space-y-0.5">
                                                            <span className="font-bold text-slate-900 block">
                                                                Class{" "}
                                                                {
                                                                    cls.classNumber
                                                                }
                                                            </span>
                                                            <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
                                                                {cls.heading}
                                                            </p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                            </>
                        )}
                    </div>

                    <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">
                            {selectedClasses.length} selected
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 bg-brand-purple text-white rounded-lg text-xs font-semibold hover:bg-brand-purple-hover"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface DropdownOption<T extends string> {
    value: T;
    label: string;
    description: string;
}

const APPLICANT_TYPE_OPTIONS: DropdownOption<"individual" | "company">[] = [
    {
        value: "individual",
        label: "An individual",
        description:
            "Natural person(s) registering in their personal capacity as the trademark owner.",
    },
    {
        value: "company",
        label: "A company",
        description:
            "Registered corporate body, LLC, enterprise, or incorporated organization.",
    },
];

const APPLICATION_RELATIONSHIP_OPTIONS: DropdownOption<
    "self" | "representative"
>[] = [
    {
        value: "self",
        label: "Myself / my company",
        description:
            "Direct owner, officer, or authorized director applying for own brand assets.",
    },
    {
        value: "representative",
        label: "On behalf of someone else",
        description:
            "External representative, attorney, agent, or advisor applying for a client.",
    },
];

interface TrademarkQuestionDropdownProps<T extends string> {
    id: string;
    label: string;
    subtitle?: string;
    required?: boolean;
    placeholder?: string;
    value: T | "";
    options: DropdownOption<T>[];
    onChange: (value: T) => void;
    error?: boolean;
}

function TrademarkQuestionDropdown<T extends string>({
    id,
    label,
    subtitle,
    required,
    placeholder = "Select an option...",
    value,
    options,
    onChange,
    error,
}: TrademarkQuestionDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find((o) => o.value === value);

    return (
        <div className="space-y-1.5 text-left" ref={containerRef}>
            <div>
                <label
                    htmlFor={id}
                    className="block text-xs font-semibold text-slate-800"
                >
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                </label>
                {subtitle && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="relative">
                <button
                    id={id}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 flex items-center justify-between gap-3 bg-white outline-none focus:ring-2 focus:ring-brand-purple/20 ${
                        error
                            ? "border-red-300 bg-red-50/40"
                            : isOpen
                              ? "border-brand-purple shadow-xs ring-1 ring-brand-purple"
                              : "border-slate-200 hover:border-brand-purple/50"
                    }`}
                >
                    <div className="min-w-0 flex-1">
                        {selectedOption ? (
                            <span className="text-sm font-semibold text-brand-dark block truncate">
                                {selectedOption.label}
                            </span>
                        ) : (
                            <span className="text-sm text-slate-400 block truncate">
                                {placeholder}
                            </span>
                        )}
                    </div>
                    <svg
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-brand-purple" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <ul
                        role="listbox"
                        className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1 max-h-72 overflow-y-auto"
                    >
                        {options.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <li
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-3 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                                        isSelected
                                            ? "bg-brand-purple-light/50 text-brand-purple"
                                            : "hover:bg-slate-50 text-slate-700"
                                    }`}
                                >
                                    <div className="space-y-0.5 min-w-0">
                                        <span className="text-sm font-semibold text-brand-dark block">
                                            {opt.label}
                                        </span>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {opt.description}
                                        </p>
                                    </div>
                                    <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                            isSelected
                                                ? "border-brand-purple bg-brand-purple"
                                                : "border-slate-300"
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export const TrademarksPage: React.FC = () => {
    const { selectedCountry, setSelectedCountryCode } = useCountry();
    const { navigate } = useNavigation();

    const [viewMode, setViewMode] = useState<TrademarkViewMode>("overview");
    const [currentStep, setCurrentStep] = useState<number>(1);
    const totalSteps = 5;

    // Step 1: Applicant Details
    const [applicantType, setApplicantType] = useState<
        "individual" | "company" | ""
    >("");
    const [applicationRelationship, setApplicationRelationship] = useState<
        "self" | "representative" | ""
    >("");

    // Step 2: Trademark Details
    const [markType, setMarkType] = useState<"word" | "logo" | "both" | "">("");
    const [words, setWords] = useState<string[]>([""]);
    const [logos, setLogos] = useState<UploadedLogo[]>([]);
    const [goodsServicesDescription, setGoodsServicesDescription] =
        useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 3: Per-Mark Class Selections (Document Flow)
    const [markClassSelections, setMarkClassSelections] = useState<
        Record<string, MarkClassSelection>
    >({});

    // Step 5: Contact Details
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // General Validation
    const [validationError, setValidationError] = useState("");

    // Character Counter
    const currentCharCount = goodsServicesDescription.trim().length;
    const isCharCountSufficient = currentCharCount >= 50;

    // Active Marks
    interface ActiveMarkItem {
        id: string;
        displayLabel: string;
        value: string;
        type: "word" | "logo";
    }

    const activeMarks: ActiveMarkItem[] = [];
    if (markType === "word" || markType === "both") {
        const validWords = words.filter((w) => w.trim());
        validWords.forEach((w, idx) => {
            const displayLabel =
                validWords.length > 1 ? `Wordmark ${idx + 1}` : "Wordmark";
            activeMarks.push({
                id: `word-${idx}`,
                displayLabel,
                value: `"${w.trim()}"`,
                type: "word",
            });
        });
    }
    if (markType === "logo" || markType === "both") {
        logos.forEach((l, idx) => {
            const displayLabel =
                logos.length > 1 ? `Logo / Design ${idx + 1}` : "Logo / Design";
            activeMarks.push({
                id: `logo-${idx}`,
                displayLabel,
                value: l.name,
                type: "logo",
            });
        });
    }

    // Manage Words
    const handleAddWord = () => setWords([...words, ""]);
    const handleRemoveWord = (index: number) => {
        if (words.length > 1) {
            setWords(words.filter((_, i) => i !== index));
        }
    };
    const handleWordChange = (index: number, val: string) => {
        const updated = [...words];
        updated[index] = val;
        setWords(updated);
        setValidationError("");
    };

    // Manage Logos
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles: UploadedLogo[] = Array.from(e.target.files).map(
                (file, i) => ({
                    id: `${Date.now()}-${i}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    file,
                }),
            );
            setLogos((prev) => [...prev, ...newFiles]);
            setValidationError("");
        }
    };

    const handleRemoveLogo = (id: string) => {
        setLogos((prev) => prev.filter((l) => l.id !== id));
    };

    // Per-Mark Class Actions
    const handleSetApproachForMark = (
        markId: string,
        approach: MarkDeterminationApproach,
    ) => {
        setMarkClassSelections((prev) => {
            const current = prev[markId] || { approach: "choose", classes: [] };
            return {
                ...prev,
                [markId]: {
                    ...current,
                    approach,
                },
            };
        });
        setValidationError("");
    };

    const handleToggleClassForMark = (markId: string, classNum: number) => {
        setMarkClassSelections((prev) => {
            const current = prev[markId] || { approach: "choose", classes: [] };
            const exists = current.classes.includes(classNum);
            const updatedClasses = exists
                ? current.classes.filter((c) => c !== classNum)
                : [...current.classes, classNum];
            return {
                ...prev,
                [markId]: {
                    ...current,
                    classes: updatedClasses,
                },
            };
        });
        setValidationError("");
    };

    const handleClearClassesForMark = (markId: string) => {
        setMarkClassSelections((prev) => {
            const current = prev[markId] || { approach: "choose", classes: [] };
            return {
                ...prev,
                [markId]: {
                    ...current,
                    classes: [],
                },
            };
        });
        setValidationError("");
    };

    // Step Navigation
    const handleStartAssessment = () => {
        setValidationError("");
        setCurrentStep(1);
        setViewMode("assessing");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!applicantType) {
                setValidationError(
                    "Please select who you are registering the trademark for.",
                );
                return;
            }
            if (!applicationRelationship) {
                setValidationError(
                    "Please specify who is making this application.",
                );
                return;
            }
        }

        if (currentStep === 2) {
            if (!markType) {
                setValidationError(
                    "Please select the mark format (Word, Logo or design, or Both).",
                );
                return;
            }
            if (markType === "word" || markType === "both") {
                const hasValidWord = words.some((w) => w.trim().length > 0);
                if (!hasValidWord) {
                    setValidationError(
                        "Please enter at least one trademark wordmark name.",
                    );
                    return;
                }
            }
            if (markType === "logo" || markType === "both") {
                if (logos.length === 0) {
                    setValidationError(
                        "Please upload at least one logo or design file (JPG, PNG, or PDF).",
                    );
                    return;
                }
            }
            if (!isCharCountSufficient) {
                setValidationError(
                    `Please provide a practical description of your goods or services (at least 50 characters). Current: ${currentCharCount} characters.`,
                );
                return;
            }
        }

        // Step 3 Validation: Each mark must have its approach satisfied
        if (currentStep === 3) {
            for (const mark of activeMarks) {
                const config = markClassSelections[mark.id];
                if (!config || !config.approach) {
                    setValidationError(
                        `Please specify how you would like to determine classes for ${mark.displayLabel} (${mark.value}).`,
                    );
                    return;
                }
                if (
                    config.approach === "choose" &&
                    config.classes.length === 0
                ) {
                    setValidationError(
                        `Please select at least one class for ${mark.displayLabel} (${mark.value}), or choose "Help me find the right classes".`,
                    );
                    return;
                }
            }
        }

        setValidationError("");
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrevStep = () => {
        setValidationError("");
        if (currentStep === 1) {
            setViewMode("overview");
        } else {
            setCurrentStep((prev) => Math.max(prev - 1, 1));
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactName.trim()) {
            setValidationError("Please enter your full name.");
            return;
        }
        if (!contactEmail.trim() || !contactEmail.includes("@")) {
            setValidationError("Please enter a valid email address.");
            return;
        }
        if (!contactPhone.trim()) {
            setValidationError("Please enter your phone number.");
            return;
        }

        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReset = () => {
        setApplicantType("");
        setApplicationRelationship("");
        setMarkType("");
        setWords([""]);
        setLogos([]);
        setGoodsServicesDescription("");
        setMarkClassSelections({});
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setIsSubmitted(false);
        setValidationError("");
        setCurrentStep(1);
        setViewMode("overview");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const isNigeria = selectedCountry.code === "NG";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Top back button */}
            <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-purple mb-6 transition-colors"
            >
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                <span>Go back</span>
            </button>

            {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 1: OVERVIEW
         ───────────────────────────────────────────────────────────────────────────── */}
            {viewMode === "overview" && (
                <div className="bg-white p-7 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs space-y-8 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full border border-brand-purple-border/60">
                            Intellectual Property
                        </span>
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
                            <CountryFlag
                                code={selectedCountry.code}
                                size="sm"
                            />
                            <span>{selectedCountry.name}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                            Trademark Registration Request Portal
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Understand what you want to register, identify
                            potentially relevant trademark classes, and request
                            Mustarred's assistance.
                        </p>
                    </div>

                    {isNigeria ? (
                        <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-5">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-brand-dark">
                                    Nigeria Trademark Registration Assessment
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    Calibrated for the Trademarks, Patents and
                                    Designs Registry, Federal Ministry of
                                    Industry, Trade and Investment (FMITI).
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-brand-purple">
                                        1. Applicant &amp; Mark
                                    </span>
                                    <p className="text-slate-600">
                                        Specify whether filing for an individual
                                        or company, and upload word or logo
                                        assets.
                                    </p>
                                </div>
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-brand-purple">
                                        2. Class Mapping
                                    </span>
                                    <p className="text-slate-600">
                                        Describe goods/services in detail and
                                        associate relevant classes or request
                                        guidance.
                                    </p>
                                </div>
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-brand-purple">
                                        3. Filing Assistance
                                    </span>
                                    <p className="text-slate-600">
                                        Review our 6-stage statutory process and
                                        submit your intake details to legal
                                        counsel.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleStartAssessment}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Assess my business</span>
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
                    ) : (
                        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                            <div className="space-y-1.5">
                                <h3 className="text-base sm:text-lg font-bold text-brand-dark">
                                    Trademark Advisory in {selectedCountry.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    Detailed statutory trademark procedures in
                                    this portal are currently calibrated for
                                    Nigeria.
                                </p>
                            </div>
                            <div className="pt-2 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/talk-to-us")}
                                    className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                                >
                                    Request Trademark Advisory in{" "}
                                    {selectedCountry.name} →
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCountryCode("NG")}
                                    className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
                                >
                                    Switch to Nigeria Portal
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 2: QUESTIONNAIRE (STEPS 1 TO 5)
         ───────────────────────────────────────────────────────────────────────────── */}
            {viewMode === "assessing" && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-left">
                    {/* Progress Bar */}
                    <div className="px-6 py-4 sm:px-8 bg-slate-50 border-b border-slate-200/80">
                        <div className="flex items-center justify-between text-xs">
                            <div className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                                <CountryFlag
                                    code={selectedCountry.code}
                                    size="sm"
                                />
                                <span>Nigeria (FMITI)</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">
                                    Trademark Registration Portal
                                </span>
                            </div>
                            <span className="font-semibold text-slate-500">
                                Step {currentStep} of {totalSteps}
                            </span>
                        </div>

                        <div className="w-full bg-slate-200/80 rounded-full h-1 mt-3 overflow-hidden">
                            <div
                                className="bg-brand-purple h-1 rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${(currentStep / totalSteps) * 100}%`,
                                }}
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
                                        Tell us about the entity that will own
                                        the trademark and who is initiating the
                                        application.
                                    </p>
                                </div>

                                <TrademarkQuestionDropdown
                                    id="applicant-type-select"
                                    label="1. Who are you registering the trademark for?"
                                    required
                                    placeholder="Select who you are registering for..."
                                    value={applicantType}
                                    options={APPLICANT_TYPE_OPTIONS}
                                    onChange={(val) => {
                                        setApplicantType(val);
                                        setValidationError("");
                                    }}
                                    error={Boolean(
                                        validationError && !applicantType,
                                    )}
                                />

                                <TrademarkQuestionDropdown
                                    id="application-relationship-select"
                                    label="2. Who is making the application?"
                                    required
                                    placeholder="Select who is making the application..."
                                    value={applicationRelationship}
                                    options={APPLICATION_RELATIONSHIP_OPTIONS}
                                    onChange={(val) => {
                                        setApplicationRelationship(val);
                                        setValidationError("");
                                    }}
                                    error={Boolean(
                                        validationError &&
                                        !applicationRelationship,
                                    )}
                                />
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
                                        Select your mark format, specify words
                                        or designs, and explain the goods or
                                        services covered.
                                    </p>
                                </div>

                                {/* Mark Type */}
                                <div className="space-y-2.5">
                                    <label className="block text-xs font-semibold text-slate-800">
                                        What type of mark do you want to
                                        register?{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMarkType("word");
                                                setValidationError("");
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                markType === "word"
                                                    ? "border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs"
                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <span className="font-semibold text-sm text-brand-dark block">
                                                Word
                                            </span>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Plain brand name, phrase, or
                                                slogan text.
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMarkType("logo");
                                                setValidationError("");
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                markType === "logo"
                                                    ? "border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs"
                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <span className="font-semibold text-sm text-brand-dark block">
                                                Logo or design
                                            </span>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Visual graphic, emblem, or
                                                stylized mark.
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMarkType("both");
                                                setValidationError("");
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                markType === "both"
                                                    ? "border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs"
                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <span className="font-semibold text-sm text-brand-dark block">
                                                Both
                                            </span>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                A combination of word and logo
                                                design
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Word Inputs */}
                                {(markType === "word" ||
                                    markType === "both") && (
                                    <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-slate-800">
                                                Wordmark Name(s){" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            {words.some(
                                                (w) => w.trim() !== "",
                                            ) && (
                                                <button
                                                    type="button"
                                                    onClick={handleAddWord}
                                                    className="text-xs font-semibold text-brand-purple hover:text-brand-purple-hover inline-flex items-center gap-1"
                                                >
                                                    <span>
                                                        + Add another word
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-2.5">
                                            {words.map((w, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Enter trademark name"
                                                        value={w}
                                                        onChange={(e) =>
                                                            handleWordChange(
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none bg-white"
                                                    />
                                                    {words.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveWord(
                                                                    index,
                                                                )
                                                            }
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                                                            title="Remove word"
                                                            aria-label={`Remove word ${index + 1}`}
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Dynamic Logo Uploads */}
                                {(markType === "logo" ||
                                    markType === "both") && (
                                    <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-slate-800">
                                                Logo / Design Attachments{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            {logos.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="text-xs font-semibold text-brand-purple hover:text-brand-purple-hover inline-flex items-center gap-1"
                                                >
                                                    <span>
                                                        + Upload another
                                                        logo/design
                                                    </span>
                                                </button>
                                            )}
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
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="border-2 border-dashed border-slate-300 hover:border-brand-purple p-6 rounded-xl text-center cursor-pointer transition-colors bg-white"
                                            >
                                                <svg
                                                    className="w-8 h-8 text-slate-400 mx-auto mb-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span className="text-xs font-semibold text-brand-purple block">
                                                    Click to select JPG, JPEG,
                                                    PNG, or PDF files
                                                </span>
                                                <span className="text-[11px] text-slate-400 mt-1 block">
                                                    Files remain stored locally
                                                    in your browser session
                                                    only.
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
                                                                {logo.name
                                                                    .split(".")
                                                                    .pop()}
                                                            </span>
                                                            <div className="truncate">
                                                                <span className="font-semibold text-slate-800 block truncate">
                                                                    {logo.name}
                                                                </span>
                                                                <span className="text-slate-400 text-[10px]">
                                                                    {formatFileSize(
                                                                        logo.size,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveLogo(
                                                                    logo.id,
                                                                )
                                                            }
                                                            className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors shrink-0"
                                                            title="Remove file"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
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
                                            What goods or services will your
                                            trademark cover?{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            <span className="text-slate-500 font-normal ml-1.5">
                                                (50 character minimum)
                                            </span>
                                        </label>
                                        {currentCharCount > 0 && (
                                            <span
                                                className={`text-xs font-semibold ${
                                                    isCharCountSufficient
                                                        ? "text-emerald-700"
                                                        : "text-amber-700"
                                                }`}
                                            >
                                                {currentCharCount} / 50
                                                characters
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Please describe the products or services you want to protect in at least 50 characters. Be clear and precise as this will help our team understand your business and access the appropriate trademark classes.
                                    </p>

                                    <textarea
                                        rows={4}
                                        placeholder="Describe your goods or services"
                                        value={goodsServicesDescription}
                                        onChange={(e) => {
                                            setGoodsServicesDescription(
                                                e.target.value,
                                            );
                                            setValidationError("");
                                        }}
                                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: Choose your class (DOCUMENT SPECIFICATION FLOW) ──────── */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                {/* Document Header */}
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                                        Choose your class
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        Nigeria has 45 trademark classes,
                                        covering goods and services.
                                        Applications are made and charged
                                        separately for each class.
                                    </p>
                                </div>

                                {/* Per-Mark Class Determination Flow */}
                                {activeMarks.length > 0 ? (
                                    <div className="space-y-6">
                                        {activeMarks.map((mark) => {
                                            const markConfig =
                                                markClassSelections[
                                                    mark.id
                                                ] || {
                                                    approach: "choose",
                                                    classes: [],
                                                };

                                            return (
                                                <div
                                                    key={mark.id}
                                                    className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs"
                                                >
                                                    {/* Mark Heading */}
                                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple shrink-0"></span>
                                                            <h4 className="font-bold text-sm text-brand-dark">
                                                                {
                                                                    mark.displayLabel
                                                                }
                                                            </h4>
                                                            <span className="text-xs font-medium text-slate-500">
                                                                {mark.value}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                                                            {mark.type ===
                                                            "word"
                                                                ? "Wordmark"
                                                                : "Logo / Design"}
                                                        </span>
                                                    </div>

                                                    {/* Question: How would you like to determine your classes? */}
                                                    <div className="space-y-2.5">
                                                        <label className="block text-xs font-semibold text-slate-900">
                                                            How would you like
                                                            to determine your
                                                            classes?
                                                        </label>

                                                        {/* 3 Document Options */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            {/* Option 1: I will choose my own classes */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSetApproachForMark(
                                                                        mark.id,
                                                                        "choose",
                                                                    )
                                                                }
                                                                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                                    markConfig.approach ===
                                                                    "choose"
                                                                        ? "border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs"
                                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                                }`}
                                                            >
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                        <span className="font-semibold text-xs sm:text-sm text-brand-dark">
                                                                            I
                                                                            will
                                                                            choose
                                                                            my
                                                                            own
                                                                            classes
                                                                        </span>
                                                                        <div
                                                                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                                                markConfig.approach ===
                                                                                "choose"
                                                                                    ? "border-brand-purple bg-brand-purple"
                                                                                    : "border-slate-300"
                                                                            }`}
                                                                        >
                                                                            {markConfig.approach ===
                                                                                "choose" && (
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 leading-relaxed">
                                                                        Select
                                                                        classes
                                                                        for the
                                                                        mark
                                                                        using
                                                                        the
                                                                        searchable
                                                                        dropdown
                                                                        below
                                                                        that
                                                                        fits the
                                                                        products
                                                                        or
                                                                        services
                                                                        you
                                                                        described
                                                                        earlier.
                                                                    </p>
                                                                </div>
                                                            </button>

                                                            {/* Option 2: Help me find the right classes */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSetApproachForMark(
                                                                        mark.id,
                                                                        "recommend",
                                                                    )
                                                                }
                                                                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                                    markConfig.approach ===
                                                                    "recommend"
                                                                        ? "border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs"
                                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                                }`}
                                                            >
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                        <span className="font-semibold text-xs sm:text-sm text-brand-dark">
                                                                            Help
                                                                            me
                                                                            find
                                                                            the
                                                                            right
                                                                            classes
                                                                        </span>
                                                                        <div
                                                                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                                                markConfig.approach ===
                                                                                "recommend"
                                                                                    ? "border-brand-purple bg-brand-purple"
                                                                                    : "border-slate-300"
                                                                            }`}
                                                                        >
                                                                            {markConfig.approach ===
                                                                                "recommend" && (
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 leading-relaxed">
                                                                        We will
                                                                        review
                                                                        your
                                                                        description
                                                                        and
                                                                        recommend
                                                                        the most
                                                                        suitable
                                                                        classes
                                                                        to
                                                                        register
                                                                        your
                                                                        mark.
                                                                    </p>
                                                                </div>
                                                            </button>

                                                            {/* Option 3: Both */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSetApproachForMark(
                                                                        mark.id,
                                                                        "both",
                                                                    )
                                                                }
                                                                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                                    markConfig.approach ===
                                                                    "both"
                                                                        ? "border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs"
                                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                                }`}
                                                            >
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                        <span className="font-semibold text-xs sm:text-sm text-brand-dark">
                                                                            Both
                                                                        </span>
                                                                        <div
                                                                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                                                markConfig.approach ===
                                                                                "both"
                                                                                    ? "border-brand-purple bg-brand-purple"
                                                                                    : "border-slate-300"
                                                                            }`}
                                                                        >
                                                                            {markConfig.approach ===
                                                                                "both" && (
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 leading-relaxed">
                                                                        If you
                                                                        are not
                                                                        sure,
                                                                        take
                                                                        your
                                                                        best
                                                                        guess(es)
                                                                        and our
                                                                        professional
                                                                        will
                                                                        review
                                                                        and
                                                                        confirm
                                                                        your
                                                                        selection
                                                                        before
                                                                        proceeding
                                                                        to
                                                                        registration.
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Conditional View for Choice 1: "I will choose my own classes" */}
                                                    {markConfig.approach ===
                                                        "choose" && (
                                                        <div className="space-y-3.5 pt-2 border-t border-slate-100">
                                                            <ClassSearchDropdown
                                                                markId={mark.id}
                                                                selectedClasses={
                                                                    markConfig.classes
                                                                }
                                                                onToggleClass={(
                                                                    classNum,
                                                                ) =>
                                                                    handleToggleClassForMark(
                                                                        mark.id,
                                                                        classNum,
                                                                    )
                                                                }
                                                                onClearClasses={() =>
                                                                    handleClearClassesForMark(
                                                                        mark.id,
                                                                    )
                                                                }
                                                            />
                                                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 leading-relaxed">
                                                                The number of
                                                                classes you
                                                                choose depends
                                                                on the nature
                                                                and scope of the
                                                                business you
                                                                described
                                                                earlier. It is
                                                                always advisable
                                                                to give your
                                                                business the
                                                                broadest
                                                                protection
                                                                possible.
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Conditional View for Choice 2: "Help me find the right classes" */}
                                                    {markConfig.approach ===
                                                        "recommend" && (
                                                        <div className="pt-2 border-t border-slate-100">
                                                            <div className="p-4 rounded-xl bg-brand-purple-light/40 border border-brand-purple-border/70 text-xs text-brand-dark space-y-1">
                                                                <span className="font-semibold text-brand-purple block">
                                                                    We will
                                                                    review the
                                                                    description
                                                                    you provided
                                                                    earlier and
                                                                    recommend
                                                                    the most
                                                                    suitable
                                                                    classes for
                                                                    your mark.
                                                                </span>
                                                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                                                    No manual
                                                                    class
                                                                    selection is
                                                                    required for
                                                                    this mark.
                                                                    Our IP legal
                                                                    counsel will
                                                                    evaluate
                                                                    your
                                                                    activities
                                                                    and assign
                                                                    the
                                                                    appropriate
                                                                    statutory
                                                                    classes.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Conditional View for Choice 3: "Both" */}
                                                    {markConfig.approach ===
                                                        "both" && (
                                                        <div className="space-y-3.5 pt-2 border-t border-slate-100">
                                                            <ClassSearchDropdown
                                                                markId={mark.id}
                                                                selectedClasses={
                                                                    markConfig.classes
                                                                }
                                                                onToggleClass={(
                                                                    classNum,
                                                                ) =>
                                                                    handleToggleClassForMark(
                                                                        mark.id,
                                                                        classNum,
                                                                    )
                                                                }
                                                                onClearClasses={() =>
                                                                    handleClearClassesForMark(
                                                                        mark.id,
                                                                    )
                                                                }
                                                            />
                                                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-2 leading-relaxed">
                                                                <p>
                                                                    The number
                                                                    of classes
                                                                    you choose
                                                                    depends on
                                                                    the nature
                                                                    and scope of
                                                                    the business
                                                                    you
                                                                    described
                                                                    earlier. It
                                                                    is always
                                                                    advisable to
                                                                    give your
                                                                    business the
                                                                    broadest
                                                                    protection
                                                                    possible.
                                                                </p>
                                                                <p className="text-brand-purple font-medium">
                                                                    We will
                                                                    review the
                                                                    description
                                                                    you provided
                                                                    earlier and
                                                                    recommend
                                                                    the most
                                                                    suitable
                                                                    classes for
                                                                    your mark.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                                        No active marks found. Please return to
                                        Step 2 to enter a wordmark name or
                                        upload a logo.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── STEP 4: Our Process ──────────────────────────────────── */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                                        Familiarise yourself with our process
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        Understand how we will handle your engagement so you stay informed throughout the process
                                    </p>
                                </div>

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
                                                    {stage.title}
                                                </h4>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    {stage.shortDescription}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── STEP 5: Get Started ───────────────────────────── */}
                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                                        Get started
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        If you are ready to proceed, please fill the form below so that a professional may contact you regarding your application.
                                    </p>
                                </div>

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
                                            <span className="text-slate-400">
                                                Applicant Type:
                                            </span>{" "}
                                            <span className="font-semibold text-slate-900 capitalize">
                                                {applicantType ||
                                                    "Not specified"}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-slate-400">
                                                Application By:
                                            </span>{" "}
                                            <span className="font-semibold text-slate-900">
                                                {applicationRelationship ===
                                                "self"
                                                    ? "Myself / My Company"
                                                    : "Representative"}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-slate-400">
                                                Mark Type:
                                            </span>{" "}
                                            <span className="font-semibold text-slate-900 capitalize">
                                                {markType || "Not specified"}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-slate-400">
                                                Total Marks:
                                            </span>{" "}
                                            <span className="font-semibold text-slate-900">
                                                {activeMarks.length}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Marks detail */}
                                    <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                                        <span className="text-slate-400 block font-medium">
                                            Marks and Class Approach:
                                        </span>
                                        <ul className="list-disc list-inside space-y-1 text-slate-800">
                                            {activeMarks.map((m) => {
                                                const sel =
                                                    markClassSelections[m.id];
                                                let note = "Not configured";
                                                if (
                                                    sel?.approach ===
                                                    "recommend"
                                                ) {
                                                    note =
                                                        "Help me find the right classes (Legal recommendation requested)";
                                                } else if (
                                                    sel?.approach === "both"
                                                ) {
                                                    note = `Both — Self-selected classes: ${sel.classes.length > 0 ? sel.classes.join(", ") : "None"} (with professional review & confirmation)`;
                                                } else if (
                                                    sel?.approach === "choose"
                                                ) {
                                                    note = `I will choose my own classes — Classes: ${sel.classes.length > 0 ? sel.classes.join(", ") : "None"}`;
                                                }
                                                return (
                                                    <li
                                                        key={m.id}
                                                        className="text-xs"
                                                    >
                                                        <span className="font-semibold">
                                                            {m.displayLabel} (
                                                            {m.value})
                                                        </span>
                                                        :{" "}
                                                        <span className="text-slate-600">
                                                            {note}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    <div className="pt-1.5 border-t border-slate-200/60 space-y-0.5">
                                        <span className="text-slate-400 block font-medium">
                                            Goods &amp; Services (
                                            {currentCharCount} characters):
                                        </span>
                                        <p className="text-slate-600 line-clamp-2 italic">
                                            "{goodsServicesDescription}"
                                        </p>
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3">
                                        <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">
                                            Trademark Intake Saved (Offline
                                            Demonstration)
                                        </span>
                                        <p className="text-xs text-amber-900 leading-relaxed">
                                            Direct online dispatch and file
                                            uploads are pending backend
                                            integration. No external message or
                                            files were transmitted over the
                                            network. Your answers have been
                                            recorded in local application state.
                                        </p>
                                        <div className="text-xs bg-amber-100/50 p-3 rounded-lg space-y-1 text-amber-950 border border-amber-200/70">
                                            <p>
                                                <span className="font-semibold">
                                                    Contact:
                                                </span>{" "}
                                                {contactName}
                                            </p>
                                            <p>
                                                <span className="font-semibold">
                                                    Email:
                                                </span>{" "}
                                                {contactEmail}
                                            </p>
                                            <p>
                                                <span className="font-semibold">
                                                    Phone:
                                                </span>{" "}
                                                {contactPhone}
                                            </p>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsSubmitted(false)
                                                }
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
                                    <form
                                        onSubmit={handleSubmitRequest}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-800 mb-1">
                                                Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Name"
                                                value={contactName}
                                                onChange={(e) => {
                                                    setContactName(
                                                        e.target.value,
                                                    );
                                                    setValidationError("");
                                                }}
                                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-800 mb-1">
                                                    Email{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="Email"
                                                    value={contactEmail}
                                                    onChange={(e) => {
                                                        setContactEmail(
                                                            e.target.value,
                                                        );
                                                        setValidationError("");
                                                    }}
                                                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-800 mb-1">
                                                    Phone number{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="Phone number"
                                                    value={contactPhone}
                                                    onChange={(e) => {
                                                        setContactPhone(
                                                            e.target.value,
                                                        );
                                                        setValidationError("");
                                                    }}
                                                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
                                            {DRAFT_TRADEMARK_PRIVACY_STATEMENT}
                                        </div>

                                        {validationError && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                                                {validationError}
                                            </div>
                                        )}

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
                                                Get Started →
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {currentStep < 5 && validationError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                                {validationError}
                            </div>
                        )}

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
                                    {currentStep === 4
                                        ? "Continue to Get Started →"
                                        : "Continue →"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
