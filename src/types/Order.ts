// ============================================
// File: src/types/Order.ts
// ============================================
export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  statusVariant: 'success' | 'warning' | 'info' | 'danger';
}