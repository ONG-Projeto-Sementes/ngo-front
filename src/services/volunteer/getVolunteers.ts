import apiClient from '@/helpers/request.ts'
import type { RequestError } from '@/services/auth/authentication.ts'

export interface VolunteerDTO {
  _id: string
  name: string
  cpf?: string
  contact?: string
  birthDate?: string
  profilePicture?: string
  deleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface PaginatedVolunteers {
  data: VolunteerDTO[]
  total: number
  totalPages: number
  currentPage: number
  limit: number
}

export async function getVolunteers(params: {
  page?: number
  limit?: number
  search?: string
}): Promise<PaginatedVolunteers> {
  const { page = 1, limit = 10, search = '' } = params

  try {
    const response = await apiClient.get<PaginatedVolunteers>('/volunteers', {
      params: { page, limit, search },
    })
    return response
  } catch (error) {
    const axiosErr = error as RequestError<{ name: string; message: string }>
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message)
    }
    throw error
  }
}

export default getVolunteers
