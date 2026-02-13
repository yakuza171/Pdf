
export enum Role {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  stripeCustomerId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface PDFMetadata {
  id: string;
  title: string;
  description: string;
  filename: string;
  fileUrl: string;
  categoryId: string;
  tags: string[];
  views: number;
  downloads: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  plan: 'monthly' | 'yearly';
  currentPeriodEnd: string;
}
