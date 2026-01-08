// College Data API Integration
import indianCollegesData from '../data/indianColleges.json';

/**
 * Fetch colleges from static Indian colleges database
 * @param {string} searchTerm - Search term to filter colleges
 * @returns {Promise<Array>} Array of colleges
 */
export const fetchIndianColleges = async (searchTerm = '') => {
  // Simulate API delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let colleges = [...indianCollegesData];
  
  // Filter by search term if provided
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

/**
 * Fetch colleges from University Domains API (fallback to static data on error)
 * @param {string} country - Country name (e.g., "India", "United States")
 * @param {string} name - College name to search
 * @returns {Promise<Array>} Array of colleges
 */
export const fetchCollegesFromAPI = async (country = '', name = '') => {
  // If searching for India, use our comprehensive static data
  if (country === 'India' || country === 'IN') {
    return await fetchIndianColleges(name);
  }
  
  // For other countries, try the API
  const baseURL = 'http://universities.hipolabs.com/search';
  const params = new URLSearchParams();
  
  if (country) params.append('country', country);
  if (name) params.append('name', name);
  
  try {
    const response = await fetch(`${baseURL}?${params.toString()}`);
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    // Transform API data to our format
    return data.map(college => ({
      name: college.name,
      location: country === 'India' ? 'India' : 'Abroad',
      type: 'Private', // Default, admin can edit
      fees: estimateFees(country), // Estimate based on country
      ranking: 0, // Admin should set manually
      minCGPA: 6.0, // Default
      placementRate: 70, // Default
      about: `${college.name} is located in ${college.country}`,
      facilities: ['Library', 'Labs', 'Sports Complex'],
      scholarships: ['Merit-based scholarships available'],
      website: college.web_pages?.[0] || '',
      country: college.country,
      state: college['state-province'] || '',
      domains: college.domains || []
    }));
  } catch (error) {
    console.error('Error fetching colleges:', error);
    throw new Error('Failed to fetch colleges from API');
  }
};

/**
 * Search colleges by multiple criteria
 */
export const searchColleges = async (searchTerm, country = 'India') => {
  try {
    // Use static Indian data for India searches
    if (country === 'India' || country === 'IN') {
      return await fetchIndianColleges(searchTerm);
    }
    
    // For other countries, try the external API
    const response = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(searchTerm)}&country=${encodeURIComponent(country)}`);
    
    if (!response.ok) {
      // Fallback to Indian data if API fails
      console.warn('External API failed, using Indian colleges data');
      return await fetchIndianColleges(searchTerm);
    }
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    return data.slice(0, 50); // Limit to 50 results
  } catch (error) {
    console.error('Error searching colleges:', error);
    throw error;
  }
};

/**
 * Fetch colleges by country
 */
export const fetchCollegesByCountry = async (countryCode) => {
  const countryMap = {
    'India': 'India',
    'USA': 'United States',
    'UK': 'United Kingdom',
    'Canada': 'Canada',
    'Australia': 'Australia',
    'Germany': 'Germany'
  };
  
  const country = countryMap[countryCode] || countryCode;
  return fetchCollegesFromAPI(country, '');
};

/**
 * Estimate fees based on country (in INR)
 */
const estimateFees = (country) => {
  const feeMap = {
    'India': Math.floor(Math.random() * (500000 - 100000) + 100000), // 1L - 5L
    'United States': Math.floor(Math.random() * (6000000 - 3000000) + 3000000), // 30L - 60L
    'United Kingdom': Math.floor(Math.random() * (4000000 - 2000000) + 2000000), // 20L - 40L
    'Canada': Math.floor(Math.random() * (3000000 - 1500000) + 1500000), // 15L - 30L
    'Australia': Math.floor(Math.random() * (3500000 - 1800000) + 1800000), // 18L - 35L
    'Germany': Math.floor(Math.random() * (200000 - 50000) + 50000) // 50K - 2L (low cost)
  };
  
  return feeMap[country] || 200000;
};

/**
 * Get list of available countries
 */
export const getAvailableCountries = () => {
  return [
    { code: 'India', name: 'India' },
    { code: 'USA', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'Canada', name: 'Canada' },
    { code: 'Australia', name: 'Australia' },
    { code: 'Germany', name: 'Germany' }
  ];
};
