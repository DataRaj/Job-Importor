'use client';

import { useState, useEffect, useCallback, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Briefcase, MapPin, DollarSign, Calendar, Tag } from 'lucide-react'; // Changed icons
import DashboardLayout from '@/components/layout/DashboardLayout';

const debounce = (func:any, delay:number) => {
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

// --- Mock Job Data (replace with API call in real app) ---
const jobs = [
  {
    id: 'JOB-001',
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Bengaluru, India',
    type: 'full-time',
    category: 'Software Development',
    salary: '₹12 LPA - ₹18 LPA',
    postedDate: '2025-07-10',
    experience: '2-4 Years',
    description: 'Develop and maintain web applications using React, Next.js, and TypeScript.'
  },
  {
    id: 'JOB-002',
    title: 'Marketing Specialist',
    company: 'Global Brands Ltd.',
    location: 'Mumbai, India',
    type: 'full-time',
    category: 'Marketing',
    salary: '₹8 LPA - ₹12 LPA',
    postedDate: '2025-07-08',
    experience: '1-3 Years',
    description: 'Execute digital marketing campaigns and analyze performance.'
  },
  {
    id: 'JOB-003',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Remote',
    type: 'part-time',
    category: 'Design',
    salary: '₹50,000 - ₹70,000 / month',
    postedDate: '2025-07-12',
    experience: '3-5 Years',
    description: 'Design intuitive and aesthetically pleasing user interfaces.'
  },
  {
    id: 'JOB-004',
    title: 'Data Scientist',
    company: 'Innovate AI',
    location: 'Hyderabad, India',
    type: 'full-time',
    category: 'Data Science',
    salary: '₹15 LPA - ₹25 LPA',
    postedDate: '2025-07-05',
    experience: '4-7 Years',
    description: 'Build and deploy machine learning models for data analysis.'
  },
  {
    id: 'JOB-005',
    title: 'Customer Support Executive',
    company: 'Service First',
    location: 'Pune, India',
    type: 'contract',
    category: 'Customer Service',
    salary: '₹4 LPA - ₹6 LPA',
    postedDate: '2025-07-14',
    experience: '0-2 Years',
    description: 'Provide excellent customer support via phone and email.'
  },
  {
    id: 'JOB-006',
    title: 'Backend Engineer (Node.js)',
    company: 'API Masters',
    location: 'Bengaluru, India',
    type: 'full-time',
    category: 'Software Development',
    salary: '₹10 LPA - ₹16 LPA',
    postedDate: '2025-07-11',
    experience: '2-5 Years',
    description: 'Develop robust and scalable backend services with Node.js and Express.'
  },
  {
    id: 'JOB-007',
    title: 'Technical Writer',
    company: 'DocuWrite Solutions',
    location: 'Remote',
    type: 'part-time',
    category: 'Content Writing',
    salary: '₹30,000 - ₹50,000 / month',
    postedDate: '2025-07-09',
    experience: '1-3 Years',
    description: 'Create clear and concise technical documentation for software products.'
  }
];

// --- Status/Type/Category Badges and Icons (adjust as needed) ---
const jobTypeColors = {
  'full-time': 'bg-blue-100 text-blue-800',
  'part-time': 'bg-purple-100 text-purple-800',
  'contract': 'bg-yellow-100 text-yellow-800',
  'remote': 'bg-green-100 text-green-800'
};

const jobCategoryColors = {
  'Software Development': 'bg-indigo-100 text-indigo-800',
  'Marketing': 'bg-pink-100 text-pink-800',
  'Design': 'bg-orange-100 text-orange-800',
  'Data Science': 'bg-teal-100 text-teal-800',
  'Customer Service': 'bg-red-100 text-red-800',
  'Content Writing': 'bg-lime-100 text-lime-800'
};


export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // Debounced search term state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the setSearchTerm function
  const debouncedSetSearchTerm = useCallback(
    debounce((value: SetStateAction<string>) => {
      setDebouncedSearchTerm(value);
    }, 500), // 500ms debounce delay
    []
  );

  useEffect(() => {
    // This effect runs when debouncedSearchTerm, jobTypeFilter, or categoryFilter changes
    const applyFilters = () => {
      let tempJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                              job.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                              job.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesType = jobTypeFilter === 'all' || job.type === jobTypeFilter;
        const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
        return matchesSearch && matchesType && matchesCategory;
      });
      setFilteredJobs(tempJobs);
    };

    applyFilters();
  }, [debouncedSearchTerm, jobTypeFilter, categoryFilter]);


  const getJobStats = () => {
    return {
      total: jobs.length,
      fullTime: jobs.filter(j => j.type === 'full-time').length,
      partTime: jobs.filter(j => j.type === 'part-time').length,
      remote: jobs.filter(j => j.location.toLowerCase() === 'remote').length,
      contract: jobs.filter(j => j.type === 'contract').length
    };
  };

  const stats = getJobStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-gray-600 mt-2">Find your next career opportunity</p>
        </div>

        {/* Job Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </div>

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
            {filteredJobs.length === 0 ? (
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
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                        {job.location}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={jobTypeColors[job.type as keyof typeof jobTypeColors]}
                        >
                          {job.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={jobCategoryColors[job.category as keyof typeof jobCategoryColors]}
                        >
                          {job.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                          {job.salary}
                        </span>
                      </TableCell>
                      <TableCell>{job.experience}</TableCell>
                      <TableCell>
                        <span className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}