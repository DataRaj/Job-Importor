'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, Database, Clock, Zap, CheckCircle, XCircle, Play, RotateCw } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getImportLogs, triggerImport } from '@/lib/api';
import { ImportLog, Pagination } from '@/types/api';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/useToast';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner'; // Assuming you have a toast component
export default function ImportLogsPage() {
  const [isTriggering, setIsTriggering] = useState(false); 
  // const { toast } = useToast();
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); 

  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getImportLogs({
        page: currentPage,
        limit: currentLimit,
        feedUrl: debouncedSearchTerm || undefined, 
      });
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error('Failed to fetch import logs:', err);
      setError(err.message || 'Failed to load import logs.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, debouncedSearchTerm]); 

  const handleTrigger = async () => {
    setIsTriggering(true);
    try {
      const response = await triggerImport();
      toast.success("Jobs Imported successfully!", {
        description: response.message,
        icon: '✅',
        position: 'top-right',
        richColors: true,
        duration: 3000,
      });
      await fetchLogs(); 
    } catch (error: any) {
      console.error('Failed to trigger import:', error);
      toast.error("Import Failed", {
        description: error.response?.data?.message || 'An unexpected error occurred.',
        duration: 5000,
      });
    } finally {
      setIsTriggering(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const getLogStats = () => {
    const totalFetched = logs.reduce((sum, log) => sum + log.totalFetched, 0);
    const newJobs = logs.reduce((sum, log) => sum + log.newJobs, 0);
    const updatedJobs = logs.reduce((sum, log) => sum + log.updatedJobs, 0);
    const failedJobs = logs.reduce((sum, log) => sum + log.failedJobs.length, 0);
    return { totalFetched, newJobs, updatedJobs, failedJobs };
  };

  const stats = getLogStats();

  const getLogStatusBadge = (log: ImportLog) => {
    if (log.failedJobs && log.failedJobs.length > 0) {
      return { className: 'bg-red-100 text-red-800', text: 'Failed Jobs', Icon: XCircle };
    } else if (log.totalFetched > 0 && log.newJobs === log.totalFetched && log.updatedJobs === 0) {
      return { className: 'bg-green-100 text-green-800', text: 'All New', Icon: CheckCircle };
    } else if (log.totalFetched > 0 && (log.newJobs > 0 || log.updatedJobs > 0)) {
      return { className: 'bg-blue-100 text-blue-800', text: 'Processed', Icon: CheckCircle };
    }
    return { className: 'bg-gray-100 text-gray-800', text: 'No Data', Icon: Clock }; // Or a relevant default
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Import Logs</h1>
          <p className="text-gray-600 mt-2">Track and manage automated job import processes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fetched Jobs (across logs)</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFetched}</div>
              <p className="text-xs text-muted-foreground">Cumulative count from all logs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Jobs Added</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newJobs}</div>
              <p className="text-xs text-muted-foreground">Newly created entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Updated</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.updatedJobs}</div>
              <p className="text-xs text-muted-foreground">Existing entries updated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Job Imports</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failedJobs}</div>
              <p className="text-xs text-muted-foreground">Jobs that encountered errors</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Log Entries</CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
              <div className="relative flex-1 max-w-lg w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter by feed URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                 <Button onClick={handleTrigger} disabled={isTriggering} className="w-full sm:w-auto">
                  {isTriggering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Triggering...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Trigger New Import
                    </>
                  )}
                 </Button>
                 <Button onClick={fetchLogs} disabled={loading} variant="outline" size="icon">
                   {loading ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                   ) : (
                     <RotateCw className="h-4 w-4" />
                   )}
                 </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading logs...</span>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">Error: {error}</div>
            ) : logs.length === 0 ? (
              <div className="text-center text-gray-500 p-4">No import logs found. Trigger an import!</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feed URL</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Fetched</TableHead>
                      <TableHead>New</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Failed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => {
                      const { className, text, Icon } = getLogStatusBadge(log);
                      return (
                        <TableRow key={log._id}>
                          <TableCell className="font-medium max-w-xs truncate" title={log.feedUrl}>{log.feedUrl}</TableCell>
                          <TableCell className="text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{log.totalFetched}</TableCell>
                          <TableCell>{log.newJobs}</TableCell>
                          <TableCell>{log.updatedJobs}</TableCell>
                          <TableCell>{log.failedJobs?.length || 0}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={className}>
                              <Icon className="h-3 w-3 mr-1" />
                              {text}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex justify-end items-center space-x-2 mt-4">
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}