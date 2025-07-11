import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface DashboardOverview {
  period: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
  summary: {
    totalDonations: number;
    totalValue: number;
    totalQuantity: number;
    avgDonationValue: number;
    totalDonors: number;
    donationsGrowth?: number;
    valueGrowth?: number;
    donorsGrowth?: number;
  };
  statusBreakdown: Array<{
    status: string;
    count: number;
    totalValue: number;
    totalQuantity: number;
    percentage: string;
  }>;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    categoryIcon?: string;
    categoryColor?: string;
    count: number;
    totalValue: number;
    totalQuantity: number;
    percentage: string;
  }>;
  topDonors: Array<{
    name: string;
    contact?: string;
    totalDonations: number;
    totalValue: number;
    lastDonation: string;
  }>;
  recentActivity: Array<{
    _id: string;
    donorName: string;
    category: {
      categoryId: string;
      categoryName: string;
      categoryIcon?: string;
      categoryColor?: string;
    };
    quantity: number;
    unit: string;
    estimatedValue?: number;
    status: string;
    receivedDate: string;
  }>;
}

export interface GetDashboardParams {
  startDate?: string;
  endDate?: string;
  period?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  categoryId?: string;
}

// Interface para os dados que vem do backend
interface BackendOverview {
  totalDonations: number;
  totalValue: number;
  totalQuantity: number;
  averageDonationValue: number;
  totalDistributed: number;
  totalDistributedValue: number;
  inStock: number;
  stockValue: number;
  totalFamiliesBenefited: number;
  distributionPercentage: number;
  stockPercentage: number;
}

interface BackendStatusItem {
  _id: string;
  count: number;
  totalValue: number;
  totalQuantity: number;
}

interface BackendCategoryItem {
  _id: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  count: number;
  totalValue: number;
  totalQuantity: number;
}

interface BackendDonation {
  _id: string;
  donorName: string;
  categoryId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  quantity: number;
  unit: string;
  estimatedValue: number;
  status: string;
  receivedDate: string;
}

interface BackendData {
  overview: BackendOverview;
  recent: {
    donations: BackendDonation[];
    topDonations: BackendDonation[];
  };
  breakdown: {
    byStatus: BackendStatusItem[];
    byCategory: BackendCategoryItem[];
  };
  period: string;
  generatedAt: string;
}

export async function getDashboardOverview(params?: GetDashboardParams): Promise<DashboardOverview> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.period) queryParams.append('period', params.period);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);

    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/dashboard?${queryString}` : '/analytics/dashboard';

    const response = await apiClient.get<{ 
      message: string; 
      data: BackendData;
    }>(url);
    
    const backendData = (response as { data: BackendData }).data;
    
    // Mapear dados do backend para a interface frontend
    const mappedData: DashboardOverview = {
      period: backendData.period || 'month',
      dateRange: null, // Backend não retorna isso ainda
      summary: {
        totalDonations: backendData.overview?.totalDonations || 0,
        totalValue: backendData.overview?.totalValue || 0,
        totalQuantity: backendData.overview?.totalQuantity || 0,
        avgDonationValue: backendData.overview?.averageDonationValue || 0,
        totalDonors: backendData.overview?.totalDonations || 0, // Aproximação por enquanto
      },
      statusBreakdown: backendData.breakdown?.byStatus?.map((item: BackendStatusItem) => ({
        status: item._id,
        count: item.count,
        totalValue: item.totalValue,
        totalQuantity: item.totalQuantity,
        percentage: ((item.count / (backendData.overview?.totalDonations || 1)) * 100).toFixed(1) + '%'
      })) || [],
      categoryBreakdown: backendData.breakdown?.byCategory?.map((item: BackendCategoryItem) => ({
        categoryId: item._id,
        categoryName: item.categoryName,
        categoryIcon: item.categoryIcon,
        categoryColor: item.categoryColor,
        count: item.count,
        totalValue: item.totalValue,
        totalQuantity: item.totalQuantity,
        percentage: ((item.count / (backendData.overview?.totalDonations || 1)) * 100).toFixed(1) + '%'
      })) || [],
      topDonors: [], // Backend não retorna isso ainda
      recentActivity: backendData.recent?.donations?.map((item: BackendDonation) => ({
        _id: item._id,
        donorName: item.donorName,
        category: {
          categoryId: item.categoryId._id,
          categoryName: item.categoryId.name,
          categoryIcon: item.categoryId.icon,
          categoryColor: item.categoryId.color,
        },
        quantity: item.quantity,
        unit: item.unit,
        estimatedValue: item.estimatedValue,
        status: item.status,
        receivedDate: item.receivedDate,
      })) || [],
    };
    
    return mappedData;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDashboardOverview;
