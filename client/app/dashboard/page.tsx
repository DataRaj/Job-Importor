"use client";
;
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, MapPin, Store } from 'lucide-react';

const jobs = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    shopName: 'Kumar General Store',
    phone: '+91 9876543210',
    city: 'Mumbai',
    status: 'active',
    joinDate: '2024-01-15',
    totalOrders: 145
  },
  {
    id: 2,
    name: 'Priya Sharma',
    shopName: 'Fresh Mart',
    phone: '+91 9876543211',
    city: 'Delhi',
    status: 'active',
    joinDate: '2024-02-20',
    totalOrders: 89
  },
  {
    id: 3,
    name: 'Amit Patel',
    shopName: 'Patel Grocery',
    phone: '+91 9876543212',
    city: 'Ahmedabad',
    status: 'inactive',
    joinDate: '2024-01-10',
    totalOrders: 67
  },
  {
    id: 4,
    name: 'Sunita Devi',
    shopName: 'Devi Store',
    phone: '+91 9876543213',
    city: 'Kolkata',
    status: 'active',
    joinDate: '2024-03-05',
    totalOrders: 112
  },
  {
    id: 5,
    name: 'Mohammed Ali',
    shopName: 'Ali Super Market',
    phone: '+91 9876543214',
    city: 'Hyderabad',
    status: 'active',
    joinDate: '2024-02-28',
    totalOrders: 98
  }
];
export default function DashboardPage() {
  return (
          <DashboardLayout>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Jobs Importor</h1>
                <p className="text-gray-600 mt-2">Manage your jobs</p>
              </div>
      
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total jobs</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{jobs.length}</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active jobs</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {jobs.filter(s => s.status === 'active').length}
                    </div>
                    <p className="text-xs text-muted-foreground">80% active rate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {jobs.reduce((sum, s) => sum + s.totalOrders, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
              </div>
      
              <Card>
                <CardHeader>
                  <CardTitle>All Shopkeepers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shopkeeper</TableHead>
                        <TableHead>Shop Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {job.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{job.name}</p>
                                <p className="text-sm text-gray-600">
                                  Joined {new Date(job.joinDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Store className="h-4 w-4 text-gray-400" />
                              <span>{job.shopName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{job.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{job.city}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{job.totalOrders}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </DashboardLayout>


  );
}
