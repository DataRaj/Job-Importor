import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication
        if (email === 'admin@example.com' && password === 'password123') {
          const user = {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User'
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  status: 'active' | 'inactive';
}

interface ProductState {
  products: Product[];
  loading: boolean;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) => set((state) => ({
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  setLoading: (loading) => set({ loading })
}));

export interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [
    { id: 1, name: 'Fruits', description: 'Fresh fruits and vegetables' },
    { id: 2, name: 'Dairy', description: 'Milk, cheese, yogurt products' },
    { id: 3, name: 'Bakery', description: 'Bread, cakes, pastries' },
    { id: 4, name: 'Groceries', description: 'Rice, lentils, spices' },
    { id: 5, name: 'Beverages', description: 'Juices, soft drinks, water' }
  ],
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { ...category, id: Date.now() }]
  }))
}));