export interface Donation {
  _id: string;
  donorName: string;
  donorContact?: string;
  categoryId: string | {
    _id: string;
    name: string;
    defaultUnit: string;
    color?: string;
    icon?: string;
    description?: string;
  };
  quantity: number;
  unit: string;
  description?: string;
  estimatedValue?: number;
  receivedDate: string;
  status: 'pending' | 'received' | 'distributed' | 'expired';
  images?: string[];
  notes?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationPayload {
  donorName: string;
  donorContact?: string;
  categoryId: string;
  quantity: number;
  unit: string;
  description?: string;
  estimatedValue?: number;
  receivedDate?: string;
  status?: 'pending' | 'received' | 'distributed' | 'expired';
  images?: string[];
  notes?: string;
}

export interface DonationsResponse {
  message?: string;
  data: {
    data: Donation[];
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface DonationStats {
  totalDonations: number;
  totalValue: number;
  totalDonors: number;
  pendingDonations: number;
  receivedDonations: number;
  distributedDonations: number;
  pendingValue: number;
  receivedValue: number;
  distributedValue: number;
}

export interface DonationStatsByCategory {
  categoryId: string;
  categoryName: string;
  categoryInfo?: {
    _id: string;
    name: string;
    defaultUnit: string;
    color?: string;
    icon?: string;
  };
  totalDonations: number;
  totalValue: number;
  totalQuantity: number;
}

export interface GetDonationsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  donor?: string;
  startDate?: string;
  endDate?: string;
}

export interface DonationFormData {
  donorName: string;
  donorContact?: string;
  categoryId: string;
  status?: 'pending' | 'received' | 'distributed' | 'expired';
  quantity: number;
  unit: string;
  estimatedValue?: number;
  receivedDate?: string;
  description?: string;
  images?: string[];
  notes?: string;
}
