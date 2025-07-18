'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductTable from '@/components/products/ProductTable';
import ProductModal from '@/components/products/ProductModal';
import { useProductStore, Product } from '@/lib/store';
import { productAPI } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductFormData } from '@/lib/schemas';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { products, loading, setProducts, addProduct, removeProduct, setLoading } = useProductStore();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productAPI.getAll(debouncedSearchTerm);
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const newProduct = await productAPI.create({ ...data, status: 'active' });
      addProduct(newProduct);
      setIsModalOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    // For now, just show an alert. You can implement edit functionality later
    alert('Edit functionality will be implemented in the next version');
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await productAPI.delete(id);
      removeProduct(id);
      setError('');
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your product inventory</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              loading={loading}
            />
          </CardContent>
        </Card>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProduct}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}