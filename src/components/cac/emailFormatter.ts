import type { CACFormData, CacCountry, PersonEntry } from './types';

const line = (label: string, value?: string) =>
  value ? `${label}: ${value}\n` : '';

const section = (title: string, body: string) =>
  `\n━━━ ${title.toUpperCase()} ━━━\n${body}`;

const formatPerson = (p: PersonEntry, index: number, role: string): string => {
  let out = `\n  ${role} ${index + 1}: ${p.fullName}\n`;
  if (p.email) out += `    Email: ${p.email}\n`;
  if (p.phone) out += `    Phone: ${p.phone}\n`;
  if (p.address) out += `    Address: ${p.address}\n`;
  if (p.dateOfBirth) out += `    Date of Birth: ${p.dateOfBirth}\n`;
  if (p.gender) out += `    Gender: ${p.gender}\n`;
  if (p.occupation) out += `    Occupation: ${p.occupation}\n`;
  if (p.nationality) out += `    Nationality: ${p.nationality}\n`;
  if (p.taxPin) out += `    Tax PIN / TIN: ${p.taxPin}\n`;
  if (p.idType) out += `    ID Type: ${p.idType}\n`;
  if (p.serviceAddress) out += `    Service Address: ${p.serviceAddress}\n`;
  if (p.numberOfShares) out += `    Number of Shares: ${p.numberOfShares}\n`;
  if (p.shareholdingPercentage) out += `    Shareholding %: ${p.shareholdingPercentage}%\n`;
  if (p.qualification) out += `    Professional Qualification: ${p.qualification}\n`;
  return out;
};

export function formatEmailMessage(country: CacCountry, data: CACFormData): string {
  const countryLabel: Record<CacCountry, string> = {
    nigeria: '🇳🇬 Nigeria (CAC)',
    ghana: '🇬🇭 Ghana (ORC)',
    kenya: '🇰🇪 Kenya (BRS eCitizen)',
  };

  let msg = `REGISTER IN AFRICA — BUSINESS REGISTRATION APPLICATION\n`;
  msg += `Jurisdiction: ${countryLabel[country]}\n`;
  msg += `Submitted: ${new Date().toLocaleString()}\n`;

  // Applicant
  msg += section(
    'Applicant Contact',
    line('Full Name', data.applicantName) +
      line('Email', data.applicantEmail) +
      line('Phone', data.applicantPhone),
  );

  // Company identity
  msg += section(
    'Company Identity',
    line('Preferred Name 1', data.companyName1) +
      (data.companyName2 ? line('Preferred Name 2', data.companyName2) : '') +
      (data.companyName3 ? line('Preferred Name 3', data.companyName3) : '') +
      line('Company Type', data.companyType) +
      line('Company Email', data.companyEmail) +
      line('Company Phone', data.companyPhone) +
      (data.companyObjects
        ? `Nature of Business / Objectives:\n${data.companyObjects}\n`
        : ''),
  );

  // Registered address
  let addrBody = line('Physical Address', data.registeredAddress);
  if (data.digitalAddress) addrBody += line('Ghana Post GPS', data.digitalAddress);
  if (data.postalAddress) addrBody += line('Postal Address', data.postalAddress);
  msg += section('Registered Address', addrBody);

  // Capital
  let capitalBody =
    line('Share Capital', data.shareCapital) +
    (data.totalShares ? line('Total Number of Shares', data.totalShares) : '') +
    line('Ownership Type', data.ownershipType);
  if (data.shareClasses) capitalBody += line('Share Classes', data.shareClasses);
  if (data.nominalValuePerShare) capitalBody += line('Nominal Value Per Share', data.nominalValuePerShare);
  msg += section('Share Capital', capitalBody);

  // SIC (Kenya)
  if (country === 'kenya' && data.sicCode) {
    msg += section('SIC Code', line('SIC Code', data.sicCode));
  }

  // Directors
  if (data.directors.length > 0) {
    const dirBody = data.directors.map((d, i) => formatPerson(d, i, 'Director')).join('');
    msg += section('Directors', dirBody);
  }

  // Shareholders
  if (data.shareholders.length > 0) {
    const shBody = data.shareholders.map((s, i) => formatPerson(s, i, 'Shareholder')).join('');
    msg += section('Shareholders', shBody);
  }

  // Company Secretary
  if (data.secretaryOption === 'mustarred') {
    msg += section('Company Secretary', '  Option: Mustarred to act as Company Secretary\n');
  } else if (data.secretaryOption === 'exempt') {
    const basis =
      country === 'nigeria'
        ? 'Small Company Exemption under CAMA 2020 Section 330(1) (Proceeding without company secretary; subject to Mustarred legal verification)'
        : 'Statutory Exemption under Companies Act 2015 Section 244(1) (Paid-up capital below KES 5,000,000)';
    msg += section('Company Secretary', `  Option: Proceeding without Company Secretary\n  Basis: ${basis}\n`);
  } else if (data.secretaryOption === 'own') {
    if (data.secretaryType === 'corporate') {
      let body = line('Company Name', data.corporateSecretaryName);
      if (data.corporateSecretaryRcNumber) body += line('RC / Registration Number', data.corporateSecretaryRcNumber);
      if (data.corporateSecretaryEmail) body += line('Email', data.corporateSecretaryEmail);
      if (data.corporateSecretaryPhone) body += line('Phone', data.corporateSecretaryPhone);
      if (data.corporateSecretaryAddress) body += line('Registered Address', data.corporateSecretaryAddress);
      msg += section('Company Secretary (Corporate)', body);
    } else if (data.secretary.fullName) {
      msg += section('Company Secretary (Individual)', formatPerson(data.secretary, 0, 'Secretary'));
    }
  }

  // Beneficial Ownership
  if (data.beneficialOwnership) {
    msg += section('Beneficial Ownership', `${data.beneficialOwnership}\n`);
  }

  // GIPC (Ghana)
  if (country === 'ghana' && data.requiresGIPC) {
    msg += section('GIPC Registration', line('Foreign Participation / GIPC', data.requiresGIPC));
  }

  // Additional notes
  if (data.additionalNotes) {
    msg += section('Additional Notes', data.additionalNotes);
  }

  msg += `\n\n━━━ NOTE ━━━\n`;
  msg += `Supporting documents (government-issued IDs, passport photographs, and statutory specimen signatures) are requested separately by the Mustarred legal team upon review.\n`;

  return msg;
}
