'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const orders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerPhone: '+91 9876543210',
    items: [
      { name: 'Fresh Apples', quantity: 2, price: 299 },
      { name: 'Organic Bananas', quantity: 1, price: 89 }
    ],
    totalAmount: 687,
    status: 'delivered',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-16',
    shopkeeper: 'Rajesh Kumar'
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerPhone: '+91 9876543211',
    items: [
      { name: 'Whole Wheat Bread', quantity: 2, price: 45 },
      { name: 'Fresh Milk', quantity: 1, price: 55 }
    ],
    totalAmount: 145,
    status: 'processing',
    orderDate: '2024-01-16',
    deliveryDate: null,
    shopkeeper: 'Priya Sharma'
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    customerPhone: '+91 9876543212',
    items: [
      { name: 'Basmati Rice', quantity: 1, price: 120 }
    ],
    totalAmount: 120,
    status: 'shipped',
    orderDate: '2024-01-16',
    deliveryDate: null,
    shopkeeper: 'Amit Patel'
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Wilson',
    customerPhone: '+91 9876543213',
    items: [
      { name: 'Fresh Apples', quantity: 3, price: 299 },
      { name: 'Organic Bananas', quantity: 2, price: 89 }
    ],
    totalAmount: 1075,
    status: 'pending',
    orderDate: '2024-01-17',
    deliveryDate: null,
    shopkeeper: 'Sunita Devi'
  },
  {
    id: 'ORD-005',
    customerName: 'David Brown',
    customerPhone: '+91 9876543214',
    items: [
      { name: 'Fresh Milk', quantity: 2, price: 55 },
      { name: 'Whole Wheat Bread', quantity: 1, price: 45 }
    ],
    totalAmount: 155,
    status: 'cancelled',
    orderDate: '2024-01-17',
    deliveryDate: null,
    shopkeeper: 'Mohammed Ali'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Clock,
  processing: ShoppingCart,
  shipped: ShoppingCart,
  delivered: CheckCircle,
  cancelled: XCircle
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
  };

  const stats = getStatusStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processing}</div>
              <p className="text-xs text-muted-foreground">Being prepared</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.delivered}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelled}</div>
              <p className="text-xs text-muted-foreground">Cancelled orders</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Shopkeeper</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-600 ml-2">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">₹{order.totalAmount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={statusColors[order.status as keyof typeof statusColors]}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</p>
                          {order.deliveryDate && (
                            <p className="text-xs text-gray-600">
                              Delivered: {new Date(order.deliveryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.shopkeeper}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}