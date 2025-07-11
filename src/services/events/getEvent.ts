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

export async function getEvent(id: string): Promise<EventDTO> {
  try {
    return await apiClient.get<EventDTO>(`/events/${id}`);
  } catch (error) {
    const axiosErr = error as RequestError<{ name: string; message: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw error;
  }
}

export default getEvent;
