import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const sampleColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    type: "Engineering",
    location: "Delhi, India",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    fees: 200000,
    currency: "INR",
    minCGPA: 8.5,
    ranking: 1,
    placementRate: 95,
    description: "Premier engineering institution known for excellence in technology and research. IIT Delhi is one of the top engineering colleges in India.",
    facilities: "World-class laboratories, Libraries, Sports complex, Hostels, Wi-Fi campus, Medical facilities",
    scholarships: "Merit-based scholarships, Need-based financial aid, Research fellowships",
    accreditation: "NAAC A++, NBA Accredited",
    contact: "+91-11-26591999",
    email: "info@iitd.ac.in",
    website: "https://home.iitd.ac.in"
  },
  {
    name: "Indian Institute of Technology Bombay",
    type: "Engineering",
    location: "Mumbai, India",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    fees: 215000,
    currency: "INR",
    minCGPA: 8.5,
    ranking: 2,
    placementRate: 96,
    description: "Leading technical institute with strong industry connections and research programs.",
    facilities: "Advanced labs, Central library, Sports facilities, Hostels, Research centers",
    scholarships: "Merit scholarships, SC/ST scholarships, Financial assistance programs",
    accreditation: "NAAC A++, NBA Accredited",
    contact: "+91-22-25722545",
    email: "info@iitb.ac.in",
    website: "https://www.iitb.ac.in"
  },
  {
    name: "Indian Institute of Technology Madras",
    type: "Engineering",
    location: "Chennai, India",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    fees: 200000,
    currency: "INR",
    minCGPA: 8.5,
    ranking: 3,
    placementRate: 94,
    description: "Top-ranked IIT with strong focus on innovation and entrepreneurship.",
    facilities: "Research labs, Library, Sports complex, Hostels, Incubation center",
    scholarships: "Merit-based aid, Research assistantships, Government scholarships",
    accreditation: "NAAC A++, NBA Accredited",
    contact: "+91-44-22574000",
    email: "info@iitm.ac.in",
    website: "https://www.iitm.ac.in"
  },
  {
    name: "BITS Pilani",
    type: "Engineering",
    location: "Pilani, India",
    country: "India",
    state: "Rajasthan",
    city: "Pilani",
    fees: 450000,
    currency: "INR",
    minCGPA: 8.0,
    ranking: 5,
    placementRate: 92,
    description: "Premier private engineering institution with multiple campuses across India.",
    facilities: "Modern labs, Digital library, Sports facilities, Hostels, Innovation center",
    scholarships: "Merit-cum-need scholarships, Fee waivers for deserving students",
    accreditation: "NAAC A, NBA Accredited",
    contact: "+91-1596-242210",
    email: "info@pilani.bits-pilani.ac.in",
    website: "https://www.bits-pilani.ac.in"
  },
  {
    name: "Delhi Technological University",
    type: "Engineering",
    location: "Delhi, India",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    fees: 175000,
    currency: "INR",
    minCGPA: 7.5,
    ranking: 8,
    placementRate: 88,
    description: "State university offering quality engineering education with strong industry ties.",
    facilities: "Well-equipped labs, Library, Sports ground, Hostels, Training cell",
    scholarships: "Government scholarships, Merit scholarships, Fee concessions",
    accreditation: "NAAC A+, NBA Accredited",
    contact: "+91-11-27871023",
    email: "info@dtu.ac.in",
    website: "https://www.dtu.ac.in"
  },
  {
    name: "Netaji Subhas University of Technology",
    type: "Engineering",
    location: "Delhi, India",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    fees: 150000,
    currency: "INR",
    minCGPA: 7.5,
    ranking: 10,
    placementRate: 85,
    description: "Renowned engineering college with focus on research and innovation.",
    facilities: "Modern laboratories, Central library, Sports complex, Hostels",
    scholarships: "SC/ST scholarships, Merit-based awards, Financial assistance",
    accreditation: "NAAC A, NBA Accredited",
    contact: "+91-11-25000568",
    email: "info@nsut.ac.in",
    website: "https://www.nsut.ac.in"
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    type: "Management",
    location: "Ahmedabad, India",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    fees: 2500000,
    currency: "INR",
    minCGPA: 8.0,
    ranking: 1,
    placementRate: 100,
    description: "Premier management institute with world-class faculty and global recognition.",
    facilities: "Smart classrooms, Case study rooms, Library, Sports facilities, Hostels",
    scholarships: "Need-based financial aid, Merit scholarships, Loan assistance",
    accreditation: "AACSB, EQUIS, AMBA accredited",
    contact: "+91-79-71524478",
    email: "info@iima.ac.in",
    website: "https://www.iima.ac.in"
  },
  {
    name: "Indian Institute of Management Bangalore",
    type: "Management",
    location: "Bangalore, India",
    country: "India",
    state: "Karnataka",
    city: "Bangalore",
    fees: 2400000,
    currency: "INR",
    minCGPA: 8.0,
    ranking: 2,
    placementRate: 100,
    description: "Top B-school known for academic excellence and strong industry connections.",
    facilities: "Modern classrooms, Research centers, Library, Gym, Hostels",
    scholarships: "Merit scholarships, Financial aid programs, Education loans",
    accreditation: "AACSB, Association of MBAs accredited",
    contact: "+91-80-26993000",
    email: "info@iimb.ac.in",
    website: "https://www.iimb.ac.in"
  },
  {
    name: "All India Institute of Medical Sciences Delhi",
    type: "Medical",
    location: "Delhi, India",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    fees: 5000,
    currency: "INR",
    minCGPA: 9.0,
    ranking: 1,
    placementRate: 100,
    description: "Premier medical institute offering world-class medical education and healthcare.",
    facilities: "Super-specialty hospitals, Research labs, Library, Hostels, Sports complex",
    scholarships: "Government scholarships, Merit-based aid, Fee waivers",
    accreditation: "MCI approved, NAAC A++",
    contact: "+91-11-26588500",
    email: "info@aiims.edu",
    website: "https://www.aiims.edu"
  },
  {
    name: "National Law School of India University",
    type: "Law",
    location: "Bangalore, India",
    country: "India",
    state: "Karnataka",
    city: "Bangalore",
    fees: 250000,
    currency: "INR",
    minCGPA: 8.5,
    ranking: 1,
    placementRate: 98,
    description: "India's premier law school with excellent faculty and judicial training.",
    facilities: "Moot court halls, Legal aid clinics, Library, Hostels, Sports facilities",
    scholarships: "Merit-based scholarships, Need-based financial aid, Fee waivers",
    accreditation: "Bar Council of India approved, NAAC A++",
    contact: "+91-80-23160532",
    email: "info@nls.ac.in",
    website: "https://www.nls.ac.in"
  },
  {
    name: "St. Stephen's College",
    type: "Arts",
    location: "Delhi, India",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    fees: 50000,
    currency: "INR",
    minCGPA: 7.5,
    ranking: 1,
    placementRate: 85,
    description: "Premier liberal arts college affiliated with Delhi University.",
    facilities: "Well-stocked library, Laboratories, Sports ground, Hostels, Auditorium",
    scholarships: "Merit scholarships, Minority scholarships, Financial assistance",
    accreditation: "NAAC A++, UGC recognized",
    contact: "+91-11-27667296",
    email: "principal@ststephens.edu",
    website: "https://www.ststephens.edu"
  },
  {
    name: "Indian Institute of Science",
    type: "Science",
    location: "Bangalore, India",
    country: "India",
    state: "Karnataka",
    city: "Bangalore",
    fees: 50000,
    currency: "INR",
    minCGPA: 9.0,
    ranking: 1,
    placementRate: 95,
    description: "Premier research institution for science and engineering.",
    facilities: "State-of-art research labs, Library, Computing facilities, Hostels, Sports",
    scholarships: "Research fellowships, Merit scholarships, INSPIRE scholarships",
    accreditation: "NAAC A++, Deemed University",
    contact: "+91-80-22932000",
    email: "office@iisc.ac.in",
    website: "https://www.iisc.ac.in"
  },
  {
    name: "National Institute of Technology Trichy",
    type: "Engineering",
    location: "Trichy, India",
    country: "India",
    state: "Tamil Nadu",
    city: "Tiruchirappalli",
    fees: 165000,
    currency: "INR",
    minCGPA: 7.5,
    ranking: 6,
    placementRate: 90,
    description: "Premier NIT with excellent academic programs and placement records.",
    facilities: "Modern labs, Central library, Sports complex, Hostels, Wi-Fi campus",
    scholarships: "Government scholarships, Merit awards, Fee concessions",
    accreditation: "NAAC A++, NBA Accredited",
    contact: "+91-431-2503000",
    email: "dir@nitt.edu",
    website: "https://www.nitt.edu"
  },
  {
    name: "Vellore Institute of Technology",
    type: "Engineering",
    location: "Vellore, India",
    country: "India",
    state: "Tamil Nadu",
    city: "Vellore",
    fees: 200000,
    currency: "INR",
    minCGPA: 7.0,
    ranking: 12,
    placementRate: 87,
    description: "Large private university with strong industry partnerships and placements.",
    facilities: "Advanced labs, Digital library, Sports facilities, Hostels, Innovation center",
    scholarships: "Merit-based scholarships, Sports scholarships, Financial aid",
    accreditation: "NAAC A++, NBA Accredited",
    contact: "+91-416-2202000",
    email: "info@vit.ac.in",
    website: "https://www.vit.ac.in"
  },
  {
    name: "Manipal Institute of Technology",
    type: "Engineering",
    location: "Manipal, India",
    country: "India",
    state: "Karnataka",
    city: "Manipal",
    fees: 350000,
    currency: "INR",
    minCGPA: 7.0,
    ranking: 15,
    placementRate: 85,
    description: "Well-established private engineering college with global collaborations.",
    facilities: "Modern infrastructure, Research centers, Library, Sports complex, Hostels",
    scholarships: "Merit scholarships, Need-based aid, Sports scholarships",
    accreditation: "NAAC A, NBA Accredited",
    contact: "+91-820-2925100",
    email: "mit@manipal.edu",
    website: "https://manipal.edu/mit.html"
  }
];

export const addSampleColleges = async () => {
  console.log('Starting to add sample colleges...');
  let successCount = 0;
  let errorCount = 0;

  for (const college of sampleColleges) {
    try {
      await addDoc(collection(db, 'colleges'), {
        ...college,
        createdAt: serverTimestamp(),
        source: 'Sample Data'
      });
      successCount++;
      console.log(`✓ Added: ${college.name}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Failed to add ${college.name}:`, error.message);
    }
  }

  console.log(`\nCompleted!`);
  console.log(`Success: ${successCount} colleges`);
  console.log(`Failed: ${errorCount} colleges`);
  
  return { successCount, errorCount };
};

// For direct import in browser console
if (typeof window !== 'undefined') {
  window.addSampleColleges = addSampleColleges;
}

export default addSampleColleges;
