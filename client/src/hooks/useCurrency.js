import { useState, useEffect } from 'react';

// Exchange rates relative to USD (approximate)
const CURRENCY_MAP = {
  IN: { code: 'INR', symbol: '₹', rate: 83.5,  name: 'Indian Rupee' },
  US: { code: 'USD', symbol: '$', rate: 1,      name: 'US Dollar' },
  GB: { code: 'GBP', symbol: '£', rate: 0.79,   name: 'British Pound' },
  CA: { code: 'CAD', symbol: 'C$', rate: 1.36,  name: 'Canadian Dollar' },
  AU: { code: 'AUD', symbol: 'A$', rate: 1.53,  name: 'Australian Dollar' },
  AE: { code: 'AED', symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham' },
  SG: { code: 'SGD', symbol: 'S$', rate: 1.34,  name: 'Singapore Dollar' },
  EU: { code: 'EUR', symbol: '€', rate: 0.92,   name: 'Euro' },
  DE: { code: 'EUR', symbol: '€', rate: 0.92,   name: 'Euro' },
  FR: { code: 'EUR', symbol: '€', rate: 0.92,   name: 'Euro' },
  NZ: { code: 'NZD', symbol: 'NZ$', rate: 1.63, name: 'New Zealand Dollar' },
  ZA: { code: 'ZAR', symbol: 'R',  rate: 18.6,  name: 'South African Rand' },
  PK: { code: 'PKR', symbol: '₨',  rate: 278,   name: 'Pakistani Rupee' },
  BD: { code: 'BDT', symbol: '৳',  rate: 110,   name: 'Bangladeshi Taka' },
};

const DEFAULT = CURRENCY_MAP['US'];

export function useCurrency() {
  const [currency, setCurrency] = useState(DEFAULT);
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Detect by Timezone first (instant, adblocker-proof, no network calls)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
        setCountry('IN');
        setCurrency(CURRENCY_MAP['IN']);
        setLoading(false);
        return;
      }
      
      const tzToCountry = {
        'Europe/London': 'GB',
        'Europe/Belfast': 'GB',
        'Europe/Dublin': 'GB',
        'America/New_York': 'US',
        'America/Chicago': 'US',
        'America/Denver': 'US',
        'America/Los_Angeles': 'US',
        'America/Phoenix': 'US',
        'America/Anchorage': 'US',
        'America/Honolulu': 'US',
        'America/Toronto': 'CA',
        'America/Vancouver': 'CA',
        'America/Edmonton': 'CA',
        'America/Winnipeg': 'CA',
        'Australia/Sydney': 'AU',
        'Australia/Melbourne': 'AU',
        'Australia/Brisbane': 'AU',
        'Australia/Adelaide': 'AU',
        'Australia/Perth': 'AU',
        'Australia/Hobart': 'AU',
        'Australia/Darwin': 'AU',
        'Asia/Dubai': 'AE',
        'Asia/Singapore': 'SG',
        'Asia/Dhaka': 'BD',
        'Asia/Karachi': 'PK',
        'Asia/Kathmandu': 'NP',
        'Pacific/Auckland': 'NZ',
      };
      
      if (tzToCountry[tz]) {
        const cc = tzToCountry[tz];
        setCountry(cc);
        setCurrency(CURRENCY_MAP[cc] || DEFAULT);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Timezone detection failed, trying IP fetch...', e);
    }

    // 2. Geolocation API Fallback
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const cc = data.country_code;
        setCountry(cc);
        setCurrency(CURRENCY_MAP[cc] || DEFAULT);
      })
      .catch(() => {
        // 3. Browser Language Fallback
        try {
          const locale = navigator.language || 'en-US';
          const region = locale.split('-')[1] || 'US';
          setCurrency(CURRENCY_MAP[region] || DEFAULT);
          setCountry(region);
        } catch {
          setCurrency(DEFAULT);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Convert USD price to local currency
  const convert = (usdPrice) => {
    if (!usdPrice) return null;
    const converted = Math.round(usdPrice * currency.rate);
    // Format with commas
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  // Show both USD and local if different
  const formatPrice = (usdPrice) => {
    if (!usdPrice) return null;
    const local = convert(usdPrice);
    if (currency.code === 'USD') return `$${usdPrice}`;
    return local;
  };

  return { currency, country, loading, convert, formatPrice };
}
