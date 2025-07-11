export interface DonationCategory {
  _id: string;
  name: string;
  description: string;
  defaultUnit: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationCategoryPayload {
  name: string;
  description: string;
  defaultUnit: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface DonationCategoriesResponse {
  message?: string;
  data: {
    data: DonationCategory[];
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface GetDonationCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}
