import apiClient from '@/helpers/request.ts';
import type { EventResponse } from './postEvent';

export async function putEvent(id: string, payload: FormData): Promise<EventResponse> {
  try {
    const data = await apiClient.put<EventResponse, FormData>(`/events/${id}`, payload);
    return data;
  } catch (err) {
    const axiosErr = err as { response?: { data: { message?: string } } };
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default putEvent;
