/**
 * Trademark Regulatory & Process Configuration
 *
 * Keeps trademark workflow data, Nice Classification reference headings,
 * and six-stage procedure descriptions separate from UI presentation.
 */

export interface TrademarkClassDefinition {
  classNumber: number;
  category: 'goods' | 'services';
  heading: string;
  isApproved: boolean;
  statusNote?: string;
}

export interface TrademarkProcessStage {
  stepNumber: number;
  title: string;
  shortDescription: string;
}

/**
 * Concise classification reference notice for Step 3 guidance.
 */
export const TRADEMARK_CLASSIFICATION_NOTICE =
  "Class headings are reference guidance based on WIPO Nice Classification (13th Edition, 2026). Final classification will be reviewed and confirmed by Mustarred's trademark team.";

/**
 * 45 Nice Classification Classes (1–34 Goods, 35–45 Services)
 * Sourced verbatim from WIPO Nice Classification NCL (13-2026).
 * All classes remain isApproved: false pending Mustarred legal review.
 */
export const TRADEMARK_CLASSES_CATALOGUE: TrademarkClassDefinition[] = [
  {
    classNumber: 1,
    category: 'goods',
    heading:
      "Chemicals for use in industry, science and photography, as well as in agriculture, horticulture and forestry; unprocessed artificial resins, unprocessed plastics; fire extinguishing and fire prevention compositions; tempering and soldering preparations; substances for tanning animal skins and hides; adhesives for use in industry; compost, manures, fertilizers; biological preparations for use in industry and science.",
    isApproved: false,
  },
  {
    classNumber: 2,
    category: 'goods',
    heading:
      "Paints, varnishes, lacquers; preservatives against rust and against deterioration of wood; colorants, dyes; inks for printing, marking and engraving; raw natural resins; metals in foil and powder form for use in painting, decorating, printing and art.",
    isApproved: false,
  },
  {
    classNumber: 3,
    category: 'goods',
    heading:
      "Non-medicated cosmetics and toiletry preparations; non-medicated dentifrices; perfumes; bleaching preparations and other substances for laundry use; cleaning, polishing and abrasive preparations.",
    isApproved: false,
  },
  {
    classNumber: 4,
    category: 'goods',
    heading:
      "Industrial oils and greases, wax; lubricants; dust absorbing, wetting and binding compositions; fuels and illuminants; candles and wicks for lighting.",
    isApproved: false,
  },
  {
    classNumber: 5,
    category: 'goods',
    heading:
      "Pharmaceuticals, medical and veterinary preparations; sanitary preparations for medical purposes; dietetic food and substances adapted for medical or veterinary purposes, food for babies; dietary supplements for human beings and animals; adhesive plasters, materials for dressings; material for filling teeth, dental wax; disinfectants; preparations for destroying vermin; fungicides, herbicides.",
    isApproved: false,
  },
  {
    classNumber: 6,
    category: 'goods',
    heading:
      "Common metals and their alloys, ores; metal materials for building and construction; transportable buildings of metal; non-electric cables and wires of common metal; small items of metal hardware; metal containers for storage or transport; safes.",
    isApproved: false,
  },
  {
    classNumber: 7,
    category: 'goods',
    heading:
      "Machines, machine tools, power-operated tools; motors and engines, except for land vehicles; machine coupling and transmission components, except for land vehicles; agricultural implements, other than hand-operated hand tools; incubators for eggs; automatic vending machines.",
    isApproved: false,
  },
  {
    classNumber: 8,
    category: 'goods',
    heading:
      "Hand-operated hand tools and implements; cutlery; side arms, except firearms; razors.",
    isApproved: false,
  },
  {
    classNumber: 9,
    category: 'goods',
    heading:
      "Scientific, research, navigation, surveying, photographic, cinematographic, audiovisual, optical, weighing, measuring, signalling, detecting, testing, inspecting, life-saving and teaching apparatus and instruments; apparatus and instruments for conducting, switching, transforming, accumulating, regulating or controlling the distribution or use of electricity; apparatus and instruments for recording, transmitting, reproducing or processing sound, images or data; recorded and downloadable multimedia files, computer software, blank digital or analogue recording and storage media; mechanisms for coin-operated apparatus; cash registers, calculating devices; computers and computer peripheral devices; diving suits, divers' masks, ear plugs for divers, nose clips for divers, gloves for divers, breathing apparatus for underwater swimming; fire-extinguishing apparatus.",
    isApproved: false,
  },
  {
    classNumber: 10,
    category: 'goods',
    heading:
      "Surgical, medical, dental and veterinary apparatus and instruments; artificial limbs, eyes and teeth; spectacles, contact lenses and sunglasses; orthopaedic articles; suture materials; therapeutic and assistive devices adapted for persons with disabilities; massage apparatus; apparatus, devices and articles for nursing infants; sexual activity apparatus, devices and articles.",
    isApproved: false,
  },
  {
    classNumber: 11,
    category: 'goods',
    heading:
      "Apparatus and installations for lighting, heating, cooling, steam generating, cooking, drying, ventilating, water supply and sanitary purposes.",
    isApproved: false,
  },
  {
    classNumber: 12,
    category: 'goods',
    heading:
      "Vehicles; apparatus for locomotion by land, air or water.",
    isApproved: false,
  },
  {
    classNumber: 13,
    category: 'goods',
    heading:
      "Firearms; ammunition and projectiles; explosives; fireworks.",
    isApproved: false,
  },
  {
    classNumber: 14,
    category: 'goods',
    heading:
      "Precious metals and their alloys; jewellery, precious and semi-precious stones; horological and chronometric instruments.",
    isApproved: false,
  },
  {
    classNumber: 15,
    category: 'goods',
    heading:
      "Musical instruments; music stands and stands for musical instruments; conductors' batons.",
    isApproved: false,
  },
  {
    classNumber: 16,
    category: 'goods',
    heading:
      "Paper and cardboard; printed matter; bookbinding material; photographs; stationery and office requisites, except furniture; adhesives for stationery or household purposes; drawing materials and materials for artists; paintbrushes; instructional and teaching materials; plastic sheets, films and bags for wrapping and packaging; printers' type, printing blocks.",
    isApproved: false,
  },
  {
    classNumber: 17,
    category: 'goods',
    heading:
      "Unprocessed and semi-processed rubber, gutta-percha, gum, asbestos, mica and substitutes for all these materials; plastics and resins in extruded form for use in manufacture; packing, stopping and insulating materials; flexible pipes, tubes and hoses, not of metal.",
    isApproved: false,
  },
  {
    classNumber: 18,
    category: 'goods',
    heading:
      "Leather and imitations of leather; animal skins and hides; luggage and carrying bags; umbrellas and parasols; walking sticks; whips, harness and saddlery; collars, leashes and clothing for animals.",
    isApproved: false,
  },
  {
    classNumber: 19,
    category: 'goods',
    heading:
      "Materials, not of metal, for building and construction; rigid pipes, not of metal, for building; asphalt, pitch, tar and bitumen; transportable buildings, not of metal; monuments, not of metal.",
    isApproved: false,
  },
  {
    classNumber: 20,
    category: 'goods',
    heading:
      "Furniture, mirrors, picture frames; containers, not of metal, for storage or transport; unworked or semi-worked bone, horn, whalebone or mother-of-pearl; shells; meerschaum; yellow amber.",
    isApproved: false,
  },
  {
    classNumber: 21,
    category: 'goods',
    heading:
      "Household or kitchen utensils and containers; cookware and tableware, except forks, knives and spoons; combs and sponges; brushes, except paintbrushes; brush-making materials; articles for cleaning purposes; unworked or semi-worked glass, except building glass; glassware, porcelain and earthenware.",
    isApproved: false,
  },
  {
    classNumber: 22,
    category: 'goods',
    heading:
      "Ropes and string; nets; tents and tarpaulins; awnings of textile or synthetic materials; sails; sacks for the transport and storage of materials in bulk; padding, cushioning and stuffing materials, except of paper, cardboard, rubber or plastics; raw fibrous textile materials and substitutes therefor.",
    isApproved: false,
  },
  {
    classNumber: 23,
    category: 'goods',
    heading:
      "Yarns and threads for textile use.",
    isApproved: false,
  },
  {
    classNumber: 24,
    category: 'goods',
    heading:
      "Textiles and substitutes for textiles; household linen; curtains of textile or plastic.",
    isApproved: false,
  },
  {
    classNumber: 25,
    category: 'goods',
    heading:
      "Clothing, footwear, headwear.",
    isApproved: false,
  },
  {
    classNumber: 26,
    category: 'goods',
    heading:
      "Lace and embroidery, and haberdashery ribbons and bows; buttons, hooks and eyes, pins and needles; artificial flowers; hair decorations; false hair.",
    isApproved: false,
  },
  {
    classNumber: 27,
    category: 'goods',
    heading:
      "Carpets, rugs, mats and matting, linoleum and other materials for covering existing floors; wall hangings, not of textile.",
    isApproved: false,
  },
  {
    classNumber: 28,
    category: 'goods',
    heading:
      "Games, toys and playthings; video game apparatus; gymnastic and sporting articles; decorations for Christmas trees.",
    isApproved: false,
  },
  {
    classNumber: 29,
    category: 'goods',
    heading:
      "Meat, fish, poultry and game; meat extracts for culinary purposes; preserved, frozen, dried and cooked fruits, vegetables and seaweeds; jellies, jams, compotes; eggs; milk, cheese, butter, yogurt and other milk products; oils and fats for food.",
    isApproved: false,
  },
  {
    classNumber: 30,
    category: 'goods',
    heading:
      "Coffee, tea, cocoa and substitutes therefor; rice, pasta and noodles; tapioca and sago; flour and preparations made from cereals; bread, pastries and confectionery; chocolate; ice cream, sorbets and other edible ices; sugar, honey, treacle; yeast, baking-powder; salt, seasonings, spices, preserved herbs; vinegar, sauces and other condiments; ice (frozen water).",
    isApproved: false,
  },
  {
    classNumber: 31,
    category: 'goods',
    heading:
      "Raw and unprocessed agricultural, aquacultural, horticultural and forestry products; raw and unprocessed grains and seeds; fresh fruits and vegetables, fresh herbs; natural plants and flowers; bulbs, seedlings and seeds for planting; live animals; foodstuffs and beverages for animals; malt.",
    isApproved: false,
  },
  {
    classNumber: 32,
    category: 'goods',
    heading:
      "Beers; non-alcoholic beverages; mineral and aerated waters; fruit beverages and fruit juices; syrups and other preparations for making non-alcoholic beverages.",
    isApproved: false,
  },
  {
    classNumber: 33,
    category: 'goods',
    heading:
      "Alcoholic beverages, except beers; alcoholic preparations for making beverages.",
    isApproved: false,
  },
  {
    classNumber: 34,
    category: 'goods',
    heading:
      "Tobacco and tobacco substitutes; cigarettes and cigars; electronic cigarettes and oral vaporizers for smokers; smokers' articles; matches.",
    isApproved: false,
  },
  {
    classNumber: 35,
    category: 'services',
    heading:
      "Advertising; business management, organization and administration; office functions.",
    isApproved: false,
  },
  {
    classNumber: 36,
    category: 'services',
    heading:
      "Financial, monetary and banking services; insurance services; real estate services.",
    isApproved: false,
  },
  {
    classNumber: 37,
    category: 'services',
    heading:
      "Construction services; installation and repair services; mining extraction, oil and gas drilling.",
    isApproved: false,
  },
  {
    classNumber: 38,
    category: 'services',
    heading:
      "Telecommunications services.",
    isApproved: false,
  },
  {
    classNumber: 39,
    category: 'services',
    heading:
      "Transport; packaging and storage of goods; travel arrangement.",
    isApproved: false,
  },
  {
    classNumber: 40,
    category: 'services',
    heading:
      "Treatment of materials; recycling of waste and trash; air purification and treatment of water; printing services; food and drink preservation.",
    isApproved: false,
  },
  {
    classNumber: 41,
    category: 'services',
    heading:
      "Education; providing of training; entertainment; sporting and cultural activities.",
    isApproved: false,
  },
  {
    classNumber: 42,
    category: 'services',
    heading:
      "Scientific and technological services and research and design relating thereto; industrial analysis, industrial research and industrial design services; quality control and authentication services; design and development of computer hardware and software.",
    isApproved: false,
  },
  {
    classNumber: 43,
    category: 'services',
    heading:
      "Services for providing food and drink; temporary accommodation.",
    isApproved: false,
  },
  {
    classNumber: 44,
    category: 'services',
    heading:
      "Medical services; veterinary services; hygienic and beauty care for human beings or animals; agriculture, aquaculture, horticulture and forestry services.",
    isApproved: false,
  },
  {
    classNumber: 45,
    category: 'services',
    heading:
      "Legal services; security services for the physical protection of tangible property and individuals; dating services, online social networking services; funerary services; babysitting.",
    isApproved: false,
  },
];

/**
 * Six-stage statutory trademark registration process
 * Strictly avoids invented turnaround times, guarantees, or premature regulatory approvals.
 */
export const TRADEMARK_PROCESS_STAGES: TrademarkProcessStage[] = [
  {
    stepNumber: 1,
    title: 'Enquiry and Preliminary Assessment',
    shortDescription:
      'Initial evaluation of the proposed mark, intended commercial use, applicant status, and potential classification scope.',
  },
  {
    stepNumber: 2,
    title: 'Engagement',
    shortDescription:
      'Formal legal engagement, execution of professional terms of representation, and Power of Attorney authorization.',
  },
  {
    stepNumber: 3,
    title: 'Trademark Search',
    shortDescription:
      'Official clearance search conducted against registry records to identify conflicting prior registrations or pending marks.',
  },
  {
    stepNumber: 4,
    title: 'Initial Filing',
    shortDescription:
      'Formal submission of the application to the Trademarks Registry and receipt of the official Acknowledgement Form.',
  },
  {
    stepNumber: 5,
    title: 'Examination and Acceptance',
    shortDescription:
      'Substantive examination by registry examiners, addressing official queries, and issuance of the official Acceptance Letter.',
  },
  {
    stepNumber: 6,
    title: 'Publication, Opposition and Registration',
    shortDescription:
      'Publication in the Federal Trademarks Journal, monitoring the statutory opposition window, and sealing the Certificate of Registration.',
  },
];

/**
 * Count words in a string, trimming excess whitespace.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Draft Privacy Statement for trademark intake.
 * Explicitly marked as pending official legal finalization.
 */
export const DRAFT_TRADEMARK_PRIVACY_STATEMENT =
  'Draft Privacy Notice (Pending Legal Finalization): Information submitted through this portal is gathered solely to assess trademark eligibility, determine classification requirements, and structure legal engagement with Mustarred accredited attorneys. Data will not be shared with third parties without your explicit authorization, except as required for statutory registry filings.';
