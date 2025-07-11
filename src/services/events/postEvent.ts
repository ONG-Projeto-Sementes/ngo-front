import apiClient from '@/helpers/request.ts';

export interface EventResponse {
  __v: number;
  _id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxVolunteers?: number;
  volunteers: string[];
  image?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function postEvent(payload: FormData): Promise<EventResponse> {
  try {
    const data = await apiClient.post<EventResponse, FormData>('/events', payload);
    return data;
  } catch (err) {
    const axiosErr = err as { response?: { data: { message?: string } } };
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default postEvent;
