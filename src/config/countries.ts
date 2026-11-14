import { Country, CountryCode } from '../types';

export const ALL_COUNTRIES: Country[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    region: 'West Africa',
    registry: 'CAC',
    visible: true,
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    region: 'West Africa',
    registry: 'ORC',
    visible: true,
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    region: 'East Africa',
    registry: 'BRS eCitizen',
    visible: true,
  },
  {
    code: 'CI',
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    region: 'West Africa',
    registry: 'CEPICI',
    visible: true,
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    region: 'East Africa',
    registry: 'RDB',
    visible: false,
  },
];

export const SUPPORTED_COUNTRIES: Country[] = ALL_COUNTRIES.filter(
  (country) => country.visible !== false
);

export const DEFAULT_COUNTRY_CODE: CountryCode = 'NG';

export function getCountryByCode(code: CountryCode): Country {
  const found = SUPPORTED_COUNTRIES.find((c) => c.code === code);
  return found || SUPPORTED_COUNTRIES[0];
}
