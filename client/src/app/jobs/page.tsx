'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MapPin, DollarSign, Calendar } from 'lucide-react'; // Changed icons
import  DashboardLayout from '@/components/layout/DashboardLayout';
import { PaginationDemo } from '@/components/job_pagination';
import { fetchTheJobs } from '@/lib/api';
import { Job } from '@/types/api';

const debounce = (func: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return function executed(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

const companies = [
  "Tata Consultancy Services",
  "Infosys",
  "Wipro",
  "HCL Technologies",
  "Tech Mahindra",
  "Larsen & Toubro Infotech",
  "Mindtree",
  "Capgemini India",
  "Accenture India",
  "IBM India",
  "Cognizant",
  "Amazon India",
  "Google India",
  "Microsoft India",
  "Flipkart",
  "Ola Cabs",
  "Uber India",
  "Paytm",
  "PhonePe",
  "Swiggy",
  "Zomato",
  "BYJU'S",
  "Unacademy",
  "Freshworks",
  "Zoho",
  "InMobi",
  "Delhivery",
  "Razorpay",
  "CRED",
  "Meesho",
  "Udaan",
  "Dream11",
  "Nykaa",
  "PolicyBazaar",
  "MakeMyTrip",
  "RedBus",
  "BigBasket",
  "Urban Company",
  "Lenskart",
  "OYO Rooms",
  "Quikr",
  "Snapdeal",
  "Myntra",
  "BookMyShow",
  "Cleartrip",
  "1mg",
  "CureFit",
  "Practo",
  "Dunzo",
  "Groww",
  "ShareChat",
  "Bounce",
  "Rivigo",
  "BlackBuck",
  "CarDekho",
  "Cars24",
  "NoBroker",
  "Housing.com",
  "Naukri.com",
  "Shiksha.com",
  "Times Internet",
  "HackerRank",
  "HackerEarth",
  "Turing",
  "UpGrad",
  "Vedantu",
  "WhiteHat Jr.",
  "Testbook",
  "Toppr",
  "Ernst & Young India",
  "Deloitte India",
  "KPMG India",
  "PwC India",
  "Siemens India",
  "Bosch India",
  "Honeywell India",
  "Samsung R&D India",
  "Nvidia India",
  "Intel India",
  "Qualcomm India",
  "Oracle India",
  "SAP Labs India",
  "Adobe India",
  "Salesforce India",
  "LinkedIn India",
  "Twitter India",
  "Facebook India",
  "Reliance Jio",
  "Bharti Airtel",
  "Vodafone Idea",
  "Tata Steel",
  "Tata Motors",
  "Mahindra & Mahindra",
  "Maruti Suzuki",
  "Hero MotoCorp",
  "Bajaj Auto",
  "TVS Motor",
  "Asian Paints",
  "Pidilite Industries",
  "Godrej Group",
  "Aditya Birla Group",
  "Hindustan Unilever",
  "ITC Limited",
  "Nestle India",
  "Britannia Industries",
  "Parle Products",
  "Amul",
  "Havells India",
  "Bharat Petroleum",
  "Indian Oil Corporation",
  "ONGC",
  "GAIL India",
  "NTPC Limited",
  "Coal India",
  "Power Grid Corporation",
  "Tata Power",
  "JSW Steel",
  "Vedanta Resources",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "State Bank of India",
  "Punjab National Bank",
  "Bank of Baroda",
  "IDFC FIRST Bank",
  "IndusInd Bank",
  "Yes Bank",
  "Canara Bank",
  "Union Bank of India",
  "Federal Bank",
  "South Indian Bank",
  "RBL Bank",
  "Bandhan Bank",
  "IDBI Bank",
  "LIC India",
  "Max Life Insurance",
  "Bajaj Finserv",
  "Muthoot Finance",
  "Manappuram Finance",
  "Tata AIA Life",
  "HDFC Life",
  "ICICI Prudential",
  "SBI Life Insurance",
  "Star Health Insurance",
  "Apollo Hospitals",
  "Fortis Healthcare",
  "Max Healthcare",
  "Sun Pharma",
  "Dr. Reddy's Laboratories",
  "Cipla",
  "Biocon",
  "Lupin Limited",
  "Aurobindo Pharma",
  "Cadila Healthcare",
  "Torrent Pharmaceuticals",
  "Glenmark Pharmaceuticals",
  "Wockhardt",
  "Sun TV Network",
  "Zee Entertainment",
  "Sony Pictures Networks India",
  "Network18",
  "Balaji Telefilms",
  "PVR Cinemas",
  "INOX Leisure",
  "Saregama India",
  "T-Series",
  "Red FM",
  "Radio Mirchi",
  "Dainik Bhaskar Group",
  "The Times Group",
  "Hindustan Times",
  "The Hindu Group",
  "Indian Express Group",
  "Jagran Prakashan",
  "ABP Group",
  "Amar Ujala",
  "DB Corp",
  "Future Group",
  "Reliance Retail",
  "Aditya Birla Fashion & Retail",
  "Shoppers Stop",
  "V-Mart Retail",
  "Spencer's Retail",
  "Trent Limited",
  "Raymond Group",
  "Arvind Limited",
  "Page Industries",
  "Bata India",
  "Relaxo Footwears",
  "Titan Company",
  "Tanishq",
  "BlueStone",
  "CaratLane",
  "FabIndia",
  "Pantaloons",
  "Westside",
  "Central",
  "Lifestyle",
  "Max Fashion",
  "Big Bazaar",
  "DMart",
  "Metro Cash & Carry",
  "Reliance Digital",
  "Croma",
  "Vijay Sales",
  "Sangeetha Mobiles",
  "Poorvika Mobiles",
  "Chroma",
  "SpiceJet",
  "IndiGo",
  "Air India",
  "Vistara",
  "Go First",
  "AirAsia India",
  "Jet Airways",
  "Indian Railways",
  "IRCTC",
  "Bharat Electronics",
  "Bharat Dynamics",
  "Hindustan Aeronautics",
  "BEML Limited",
  "Mazagon Dock Shipbuilders",
  "Garden Reach Shipbuilders",
  "Cochin Shipyard",
  "Bharat Forge",
  "Ashok Leyland",
  "Eicher Motors",
  "Force Motors",
  "Sundaram Clayton",
  "SKF India",
  "Timken India",
  "Schneider Electric India",
  "ABB India",
  "GE India",
  "Alstom India",
  "Hitachi India",
  "Jindal Steel & Power",
  "JSPL",
  "Essar Steel",
  "Bhushan Steel",
  "Tata Chemicals",
  "SRF Limited",
  "Gujarat Alkalies & Chemicals",
  "Pidilite Industries",
  "Berger Paints",
  "Kansai Nerolac Paints",
  "Shalimar Paints",
  "Asian Paints",
  "Berger Paints",
  "Nippon Paint India",
  "AkzoNobel India",
  "Grasim Industries",
  "UltraTech Cement",
  "Ambuja Cements",
  "ACC Limited",
  "Shree Cement",
  "Dalmia Bharat",
  "JK Cement",
  "Ramco Cements",
  "India Cements",
  "Birla Corporation",
  "HeidelbergCement India",
  "Orient Cement",
  "Prism Johnson",
  "Star Cement",
  "JK Lakshmi Cement",
  "Sagar Cements",
  "Mangalam Cement",
  "Kesoram Industries",
  "Chettinad Cement",
  "Penna Cement",
  "Zuari Cement",
  "Rain Industries",
  "Nuvoco Vistas",
  "Wonder Cement",
  "My Home Industries",
  "Anjani Portland Cement",
  "Deccan Cements",
  "HeidelbergCement India",
  "Sanghi Industries",
  "Shree Digvijay Cement",
  "Andhra Cements",
  "Burnpur Cement",
  "J K Cement",
  "JK Lakshmi Cement",
  "KCP Limited",
  "Orient Cement",
  "Sagar Cements",
  "Saurashtra Cement",
  "Shree Cement",
  "UltraTech Cement",
  "Vicat Sagar Cement",
  "Zuari Cement"
];


const jobLocations = [
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Gurugram, Haryana",
  "Noida, Uttar Pradesh",
  "Chennai, Tamil Nadu",
  "Mumbai, Maharashtra",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
  "Delhi, Delhi",
  "Thiruvananthapuram, Kerala",
  "Kochi, Kerala",
  "Chandigarh, Chandigarh",
  "Indore, Madhya Pradesh",
  "Jaipur, Rajasthan",
  "Coimbatore, Tamil Nadu",
  "Visakhapatnam, Andhra Pradesh",
  "Nagpur, Maharashtra",
  "Lucknow, Uttar Pradesh",
  "Bhubaneswar, Odisha",
  "Vadodara, Gujarat",
  "Mysuru, Karnataka",
  "Surat, Gujarat",
  "Vijayawada, Andhra Pradesh",
  "Madurai, Tamil Nadu",
  "Patna, Bihar",
  "Bhopal, Madhya Pradesh",
  "Rajkot, Gujarat",
  "Kanpur, Uttar Pradesh",
  "Nashik, Maharashtra",
  "Jamshedpur, Jharkhand",
  "Raipur, Chhattisgarh",
  "Ludhiana, Punjab",
  "Agra, Uttar Pradesh",
  "Varanasi, Uttar Pradesh",
  "Aurangabad, Maharashtra",
  "Guwahati, Assam",
  "Dehradun, Uttarakhand",
  "Amritsar, Punjab",
  "Jodhpur, Rajasthan",
  "Ranchi, Jharkhand",
  "Greater Noida, Uttar Pradesh",
  "Faridabad, Haryana",
  "Ghaziabad, Uttar Pradesh",
  "Trichy, Tamil Nadu",
  "Hubli-Dharwad, Karnataka",
  "Salem, Tamil Nadu",
  "Warangal, Telangana",
  "Gwalior, Madhya Pradesh",
  "Meerut, Uttar Pradesh",
  "Jabalpur, Madhya Pradesh",
  "Tirupati, Andhra Pradesh",
  "Udaipur, Rajasthan",
  "Jalandhar, Punjab",
  "Siliguri, West Bengal",
  "Durgapur, West Bengal",
  "Vellore, Tamil Nadu",
  "Mangalore, Karnataka",
  "Kozhikode, Kerala",
  "Thrissur, Kerala",
  "Aligarh, Uttar Pradesh",
  "Bareilly, Uttar Pradesh",
  "Moradabad, Uttar Pradesh",
  "Solapur, Maharashtra",
  "Kolhapur, Maharashtra",
  "Guntur, Andhra Pradesh",
  "Asansol, West Bengal",
  "Dhanbad, Jharkhand",
  "Ajmer, Rajasthan",
  "Jamnagar, Gujarat",
  "Bhilai, Chhattisgarh",
  "Cuttack, Odisha",
  "Bilaspur, Chhattisgarh",
  "Panaji, Goa",
  "Shillong, Meghalaya",
  "Imphal, Manipur",
  "Aizawl, Mizoram",
  "Itanagar, Arunachal Pradesh",
  "Gangtok, Sikkim",
  "Port Blair, Andaman and Nicobar Islands"
];

// Helper to get a random location
const getRandomJobLocation = () => {
  return jobLocations[Math.floor(Math.random() * jobLocations.length)];
};
// // --- Mock Job Data (replace with API call in real app) ---
// const jobs = [
//   {
//     id: 'JOB-001',
//     title: 'Frontend Developer',
//     company: 'Tech Solutions Inc.',
//     location: 'Bengaluru, India',
//     type: 'full-time',
//     category: 'Software Development',
//     salary: '₹12 LPA - ₹18 LPA',
//     postedDate: '2025-07-10',
//     experience: '2-4 Years',
//     description: 'Develop and maintain web applications using React, Next.js, and TypeScript.'
//   },
//   {
//     id: 'JOB-002',
//     title: 'Marketing Specialist',
//     company: 'Global Brands Ltd.',
//     location: 'Mumbai, India',
//     type: 'full-time',
//     category: 'Marketing',
//     salary: '₹8 LPA - ₹12 LPA',
//     postedDate: '2025-07-08',
//     experience: '1-3 Years',
//     description: 'Execute digital marketing campaigns and analyze performance.'
//   },
//   {
//     id: 'JOB-003',
//     title: 'UI/UX Designer',
//     company: 'Creative Studio',
//     location: 'Remote',
//     type: 'part-time',
//     category: 'Design',
//     salary: '₹50,000 - ₹70,000 / month',
//     postedDate: '2025-07-12',
//     experience: '3-5 Years',
//     description: 'Design intuitive and aesthetically pleasing user interfaces.'
//   },
//   {
//     id: 'JOB-004',
//     title: 'Data Scientist',
//     company: 'Innovate AI',
//     location: 'Hyderabad, India',
//     type: 'full-time',
//     category: 'Data Science',
//     salary: '₹15 LPA - ₹25 LPA',
//     postedDate: '2025-07-05',
//     experience: '4-7 Years',
//     description: 'Build and deploy machine learning models for data analysis.'
//   },
//   {
//     id: 'JOB-005',
//     title: 'Customer Support Executive',
//     company: 'Service First',
//     location: 'Pune, India',
//     type: 'contract',
//     category: 'Customer Service',
//     salary: '₹4 LPA - ₹6 LPA',
//     postedDate: '2025-07-14',
//     experience: '0-2 Years',
//     description: 'Provide excellent customer support via phone and email.'
//   },
//   {
//     id: 'JOB-006',
//     title: 'Backend Engineer (Node.js)',
//     company: 'API Masters',
//     location: 'Bengaluru, India',
//     type: 'full-time',
//     category: 'Software Development',
//     salary: '₹10 LPA - ₹16 LPA',
//     postedDate: '2025-07-11',
//     experience: '2-5 Years',
//     description: 'Develop robust and scalable backend services with Node.js and Express.'
//   },
//   {
//     id: 'JOB-007',
//     title: 'Technical Writer',
//     company: 'DocuWrite Solutions',
//     location: 'Remote',
//     type: 'part-time',
//     category: 'Content Writing',
//     salary: '₹30,000 - ₹50,000 / month',
//     postedDate: '2025-07-09',
//     experience: '1-3 Years',
//     description: 'Create clear and concise technical documentation for software products.'
//   }
// ];


// --- Status/Type/Category Badges and Icons (adjust as needed) ---
const jobTypeColors = {
  'full-time': 'bg-blue-100 text-blue-800',
  'part-time': 'bg-purple-100 text-purple-800',
  'contract': 'bg-yellow-100 text-yellow-800',
  'remote': 'bg-green-100 text-green-800'
};

const generateRandomJob = () => {
  return companies[Math.floor(Math.random() * companies.length)];

}

const jobCategories = [
  'Software Development',
  'Marketing',
  'Design',
  'Data Science',
  'Customer Service',
  'Content Writing'
];

const jobCategoryColors = {
  'Software Development': 'bg-indigo-100 text-indigo-800',
  'Marketing': 'bg-pink-100 text-pink-800',
  'Design': 'bg-orange-100 text-orange-800',
  'Data Science': 'bg-teal-100 text-teal-800',
  'Customer Service': 'bg-red-100 text-red-800',
  'Content Writing': 'bg-lime-100 text-lime-800'
};

const getRandomCategory = () => {
  return jobCategories[Math.floor(Math.random() * jobCategories.length)];
};

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredJobs, setFilteredJobs] = useState<Job[] | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  // @ts-ignore
  const [limit, setLimit] = useState(10);
  // Debounced search term state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the setSearchTerm function
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 500), // 500ms debounce delay
    []
  );

  const onPrevJobPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setOffset(offset - limit);
    }
  };
  
  if(loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading jobs...</div>
      </div>
    );
  }
  if(error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  const onNextJobPage = () => {
    setPage(page + 1);
    setOffset(offset + limit);
  };
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    setOffset((newPage - 1) * limit);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTheJobs(page, limit)
        .then(data => {
          setFilteredJobs(data?.jobs || []);
          setLoading(false);
          setError(null);
          // setError(data.succe);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs");
      });
    }
    fetchData();
    
  }, [page, limit]); // Fetch jobs when page or limit changes


  useEffect(() => {
    // This effect runs when debouncedSearchTerm, jobTypeFilter, or categoryFilter changes
    const applyFilters = () => {
      const tempJobs = filteredJobs?.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                              generateRandomJob().toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                              getRandomJobLocation().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesType = jobTypeFilter === 'all' || job.title === jobTypeFilter;
        const matchesCategory = categoryFilter === 'all' || getRandomCategory() === categoryFilter;
        return matchesSearch && matchesType && matchesCategory;
      });
      setFilteredJobs(tempJobs);
    };

    applyFilters();
  }, [debouncedSearchTerm, jobTypeFilter, categoryFilter]);


  // const getJobStats = () => {
  //   return {
  //     total: jobs.length,
  //     fullTime: jobs.filter(j => j.type === 'full-time').length,
  //     partTime: jobs.filter(j => j.type === 'part-time').length,
  //     remote: jobs.filter(j => j.location.toLowerCase() === 'remote').length,
  //     contract: jobs.filter(j => j.type === 'contract').length
  //   };
  // };

  // const stats = getJobStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-gray-600 mt-2">Find your next career opportunity</p>
        </div>

        {/* Job Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Available opportunities</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full-time</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.fullTime}</div>
              <p className="text-xs text-muted-foreground">Stable career paths</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Part-time</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.partTime}</div>
              <p className="text-xs text-muted-foreground">Flexible work options</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remote Jobs</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.remote}</div>
              <p className="text-xs text-muted-foreground">Work from anywhere</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle>Browse Jobs</CardTitle>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    debouncedSetSearchTerm(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Software Development">Software Development</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Content Writing">Content Writing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredJobs?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No jobs found matching your criteria.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Posted Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs?.map((job) => (
                    <TableRow key={job.guid}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{generateRandomJob()}</TableCell>
                      <TableCell className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                        {getRandomJobLocation()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={jobTypeColors[job.title as keyof typeof jobTypeColors]}
                        >
                          {job.title}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={jobCategoryColors[getRandomCategory() as keyof typeof jobCategoryColors]}
                        >
                          {getRandomCategory()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                          {Math.random() < 0.5 ? '₹' + (Math.floor(Math.random() * 20) + 5) + ' LPA' : '₹' + (Math.floor(Math.random() * 10) + 2) + ' LPA'}
                        </span>
                      </TableCell>
                      <TableCell>{Math.random() < 0.5 ? 'Fresher' : Math.floor(Math.random() * 5) + ' Years'}</TableCell>
                      <TableCell>
                        <span className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(Math.random() * 100000000000).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <div className="flex justify-center mt-4">
            <PaginationDemo
            // @ts-ignore
              numberOfPages={Math.ceil(filteredJobs.length / limit)} 
              activePage={page} 
              onNextJobPage={onNextJobPage}
              onPrevJobPage={onPrevJobPage}
              onPageChange={onPageChange}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
