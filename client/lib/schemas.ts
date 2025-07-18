import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z.number().min(0, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock must be greater than or equal to 0'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;