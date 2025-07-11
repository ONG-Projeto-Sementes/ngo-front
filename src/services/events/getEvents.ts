import apiClient from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface EventDTO {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxVolunteers?: number;
  volunteers: Array<{
    _id: string;
    name: string;
    profilePicture?: string;
  }>;
  image?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginatedEvents {
  data: EventDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export async function getEvents(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedEvents> {
  const { page = 1, limit = 10, search = '' } = params;

  try {
    const response = await apiClient.get<PaginatedEvents>('/events', {
      params: { page, limit, search },
    });
    return response;
  } catch (error) {
    const axiosErr = error as RequestError<{ name: string; message: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw error;
  }
}

export default getEvents;
