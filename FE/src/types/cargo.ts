export interface Cargo {
  id: string;
  description: string;
  weight: number;
  type: 'General' | 'Reefer' | 'Dangerous';
  containerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CargoFilter {
  containerId?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface CargoResponse {
  data: Cargo[];
  total: number;
  page: number;
  limit: number;
}

export default Cargo;