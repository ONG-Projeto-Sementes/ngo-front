import type { DonationCategory } from './DonationCategory';

export interface Donation {
  _id: string;
  categoryId: string | DonationCategory;
  category?: DonationCategory;
  donorName: string;
  donorContact?: string;
  quantity: number;
  estimatedValue?: number;
  unit: string;
  description?: string;
  status: 'pending' | 'received' | 'distributed' | 'expired';
  receivedDate?: string;
  quantityDistributed?: number;
  quantityRemaining?: number;
  familiesCount?: number;
  images?: string[];
  notes?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationPayload {
  categoryId: string;
  donorName: string;
  donorContact?: string;
  quantity: number;
  estimatedValue?: number;
  unit: string;
  description?: string;
  receivedDate?: string;
}

export interface DonationFormData {
  categoryId: string;
  donorName: string;
  donorContact?: string;
  quantity: number;
  estimatedValue?: number;
  unit: string;
  description?: string;
  receivedDate?: string;
}

export interface DonationsResponse {
  message: string;
  data: {
    data: Donation[];
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface GetDonationsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: 'pending' | 'received' | 'distributed' | 'expired';
  donor?: string;
  startDate?: string;
  endDate?: string;
}

export interface DonationStats {
  totalDonations: number;
  totalValue: number;
  totalQuantity: number;
  averageValue: number;
  statusBreakdown: {
    pending: number;
    received: number;
    distributed: number;
    expired: number;
  };
  recentDonations: Donation[];
  topDonors: Array<{
    donor: string;
    totalDonations: number;
    totalValue: number;
  }>;
}

export interface DonationStatsByCategory {
  _id: string;
  categoryName: string;
  totalDonations: number;
  totalValue: number;
  totalQuantity: number;
  averageValue: number;
  statusBreakdown: {
    pending: number;
    received: number;
    distributed: number;
    expired: number;
  };
}

// Donation Distribution types
export interface DonationDistribution {
  _id: string;
  donationId: string | Donation;
  donation?: Donation;
  familyId: string;
  family?: {
    _id: string;
    name: string;
    city: string;
    neighborhood: string;
    contact: string;
  };
  quantity: number;
  unit: string;
  distributionDate: string;
  notes?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationDistributionPayload {
  donationId: string;
  familyId: string;
  quantity: number;
  notes?: string;
}

export interface DonationDistributionsResponse {
  data: DonationDistribution[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  message?: string;
}

export interface GetDonationDistributionsParams {
  page?: number;
  limit?: number;
  donationId?: string;
  familyId?: string;
  startDate?: string;
  endDate?: string;
}