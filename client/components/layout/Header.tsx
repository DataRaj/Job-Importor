'use client';

import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
          </div>
        </div>
        
        {/* Right side - User menu */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 sm:w-56" align="end">
              <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate text-sm">{user?.name || 'Admin'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 px-3 py-2 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}