// College Data API Integration
import indianCollegesData from '../data/indianColleges.json';

/**
 * Fetch colleges from University Domains and Search List API
 * Free API: http://universities.hipolabs.com/
 */

/**
 * Fetch colleges worldwide by country
 * @param {string} country - Full country name (e.g., "United States", "India", "United Kingdom")
 * @param {number} limit - Maximum number of colleges to fetch
 * @returns {Promise<Array>} Array of colleges in standardized format
 */
export const fetchCollegesByCountry = async (country, limit = 100) => {
  try {
    const baseURL = 'http://universities.hipolabs.com/search';
    const params = new URLSearchParams();
    
    if (country) params.append('country', country);
    
    const response = await fetch(`${baseURL}?${params.toString()}`);
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    const limitedData = limit ? data.slice(0, limit) : data;
    
    // Transform API data to our standard format
    return limitedData.map((college, index) => ({
      name: college.name,
      country: college.country || country,
      state: college['state-province'] || '',
      city: extractCityFromName(college.name) || '',
      address: '',
      type: guessCollegeType(college.name),
      fees: estimateFees(college.country),
      currency: getCurrency(college.country),
      ranking: 0,
      minCGPA: 6.0,
      placementRate: 75,
      description: `${college.name} is a higher education institution located in ${college.country}.`,
      facilities: 'Library, Computer Labs, Sports Facilities, Student Housing',
      scholarships: 'Merit-based scholarships may be available. Contact institution for details.',
      website: college.web_pages && college.web_pages[0] ? college.web_pages[0] : '',
      email: '',
      phone: '',
      establishedYear: null,
      accreditation: '',
      coursesOffered: '',
      campusSize: '',
      studentCount: null,
      facultyCount: null,
      domains: college.domains || [],
      location: `${college['state-province'] ? college['state-province'] + ', ' : ''}${college.country}`
    }));
  } catch (error) {
    console.error('Error fetching colleges by country:', error);
    throw new Error(`Failed to fetch colleges for ${country}`);
  }
};

/**
 * Fetch colleges from multiple countries
 * @param {Array<string>} countries - Array of country names
 * @param {number} limitPerCountry - Maximum colleges per country
 * @returns {Promise<Array>} Combined array of colleges
 */
export const fetchCollegesFromMultipleCountries = async (countries, limitPerCountry = 50) => {
  try {
    const promises = countries.map(country => 
      fetchCollegesByCountry(country, limitPerCountry).catch(err => {
        console.warn(`Failed to fetch colleges for ${country}:`, err.message);
        return [];
      })
    );
    
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Error fetching colleges from multiple countries:', error);
    throw error;
  }
};

/**
 * Fetch top universities worldwide (pre-selected countries)
 * @returns {Promise<Array>} Array of colleges from major countries
 */
export const fetchWorldwideColleges = async () => {
  const majorCountries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Netherlands',
    'Switzerland',
    'Singapore',
    'Japan',
    'South Korea',
    'China',
    'India',
    'New Zealand',
    'Ireland',
    'Sweden'
  ];
  
  return fetchCollegesFromMultipleCountries(majorCountries, 30);
};

/**
 * Search colleges by name across all countries
 * @param {string} searchTerm - Search term
 * @param {string} country - Optional country filter
 * @returns {Promise<Array>} Matching colleges
 */
export const searchColleges = async (searchTerm, country = '') => {
  try {
    const baseURL = 'http://universities.hipolabs.com/search';
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('name', searchTerm);
    if (country) params.append('country', country);
    
    const response = await fetch(`${baseURL}?${params.toString()}`);
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    return data.slice(0, 100).map((college, index) => ({
      id: `api-${index}`,
      name: college.name,
      country: college.country,
      state: college['state-province'] || '',
      website: college.web_pages && college.web_pages[0] ? college.web_pages[0] : '',
      domains: college.domains || [],
      location: `${college['state-province'] ? college['state-province'] + ', ' : ''}${college.country}`
    }));
  } catch (error) {
    console.error('Error searching colleges:', error);
    throw error;
  }
};

/**
 * Helper: Extract city name from college name
 */
const extractCityFromName = (name) => {
  // Simple extraction - look for common patterns like "University of [City]"
  const patterns = [
    /University of ([A-Z][a-z]+)/,
    /([A-Z][a-z]+) University/,
    /([A-Z][a-z]+) College/,
    /College of ([A-Z][a-z]+)/
  ];
  
  for (const pattern of patterns) {
    const match = name.match(pattern);
    if (match) return match[1];
  }
  
  return '';
};

/**
 * Helper: Guess college type based on name
 */
const guessCollegeType = (name) => {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('engineering') || nameLower.includes('technology') || nameLower.includes('polytechnic')) {
    return 'Engineering';
  } else if (nameLower.includes('medical') || nameLower.includes('medicine') || nameLower.includes('health')) {
    return 'Medical';
  } else if (nameLower.includes('law')) {
    return 'Law';
  } else if (nameLower.includes('business') || nameLower.includes('management')) {
    return 'Management';
  } else if (nameLower.includes('arts') || nameLower.includes('fine arts')) {
    return 'Arts';
  } else if (nameLower.includes('science')) {
    return 'Science';
  } else if (nameLower.includes('design')) {
    return 'Design';
  } else if (nameLower.includes('agriculture') || nameLower.includes('agricultural')) {
    return 'Agriculture';
  }
  
  return 'Engineering'; // Default
};

/**
 * Helper: Estimate fees based on country (in local currency equivalent to INR)
 */
const estimateFees = (country) => {
  const feeMap = {
    'India': Math.floor(Math.random() * (500000 - 100000) + 100000),
    'United States': Math.floor(Math.random() * (4000000 - 2000000) + 2000000),
    'United Kingdom': Math.floor(Math.random() * (3000000 - 1500000) + 1500000),
    'Canada': Math.floor(Math.random() * (2500000 - 1200000) + 1200000),
    'Australia': Math.floor(Math.random() * (2800000 - 1500000) + 1500000),
    'Germany': Math.floor(Math.random() * (200000 - 50000) + 50000),
    'France': Math.floor(Math.random() * (400000 - 100000) + 100000),
    'Netherlands': Math.floor(Math.random() * (1500000 - 800000) + 800000),
    'Switzerland': Math.floor(Math.random() * (3500000 - 2000000) + 2000000),
    'Singapore': Math.floor(Math.random() * (2000000 - 1000000) + 1000000),
    'Japan': Math.floor(Math.random() * (1500000 - 700000) + 700000),
    'South Korea': Math.floor(Math.random() * (1200000 - 600000) + 600000),
    'China': Math.floor(Math.random() * (800000 - 300000) + 300000),
    'New Zealand': Math.floor(Math.random() * (2200000 - 1300000) + 1300000),
    'Ireland': Math.floor(Math.random() * (2000000 - 1200000) + 1200000),
    'Sweden': Math.floor(Math.random() * (200000 - 50000) + 50000)
  };
  
  return feeMap[country] || 500000;
};

/**
 * Helper: Get currency code based on country
 */
const getCurrency = (country) => {
  const currencyMap = {
    'India': 'INR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'Netherlands': 'EUR',
    'Switzerland': 'CHF',
    'Singapore': 'SGD',
    'Japan': 'JPY',
    'South Korea': 'KRW',
    'China': 'CNY',
    'New Zealand': 'NZD',
    'Ireland': 'EUR',
    'Sweden': 'SEK'
  };
  
  return currencyMap[country] || 'USD';
};

/**
 * Get list of available countries
 */
export const getAvailableCountries = () => {
  return [
    { code: 'India', name: 'India' },
    { code: 'United States', name: 'United States' },
    { code: 'United Kingdom', name: 'United Kingdom' },
    { code: 'Canada', name: 'Canada' },
    { code: 'Australia', name: 'Australia' },
    { code: 'Germany', name: 'Germany' },
    { code: 'France', name: 'France' },
    { code: 'Netherlands', name: 'Netherlands' },
    { code: 'Switzerland', name: 'Switzerland' },
    { code: 'Singapore', name: 'Singapore' },
    { code: 'Japan', name: 'Japan' },
    { code: 'South Korea', name: 'South Korea' },
    { code: 'China', name: 'China' },
    { code: 'New Zealand', name: 'New Zealand' },
    { code: 'Ireland', name: 'Ireland' },
    { code: 'Sweden', name: 'Sweden' },
    { code: 'Norway', name: 'Norway' },
    { code: 'Denmark', name: 'Denmark' },
    { code: 'Finland', name: 'Finland' },
    { code: 'Belgium', name: 'Belgium' }
  ];
};

/**
 * Fetch Indian colleges from static data
 */
export const fetchIndianColleges = async (searchTerm = '') => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let colleges = [...indianCollegesData];
  
  if (searchTerm) {
   const term = searchTerm.toLowerCase();
    colleges = colleges.filter(college =>
      college.name.toLowerCase().includes(term) ||
      college.location.toLowerCase().includes(term) ||
      college.type.toLowerCase().includes(term)
    );
  }
  
  return colleges;
};

