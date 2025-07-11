export interface EventFormValues {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxVolunteers?: number;
  image?: FileList;
}

export interface EventListItem {
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
  createdAt: string;
  updatedAt: string;
}

export interface EventVolunteer {
  _id: string;
  name: string;
  profilePicture?: string;
  cpf?: string;
  contact?: string;
}

export interface VolunteerSelectionProps {
  selectedVolunteers: string[];
  onVolunteerToggle: (volunteerId: string) => void;
  maxVolunteers?: number;
}
