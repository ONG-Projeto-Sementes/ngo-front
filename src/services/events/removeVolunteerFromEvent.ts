import apiClient from '@/helpers/request.ts';

export async function removeVolunteerFromEvent(eventId: string, volunteerId: string): Promise<void> {
  try {
    await apiClient.delete(`/events/${eventId}/volunteers/${volunteerId}`);
  } catch (err) {
    const axiosErr = err as { response?: { data: { message?: string } } };
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default removeVolunteerFromEvent;
