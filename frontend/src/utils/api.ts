const API_BASE_URL = "http://127.0.0.1:8000/api"

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: "student" | "teacher" | "admin"
  phone?: string
  department?: string
}

export interface Building {
  id: number
  name: string
  address: string
}

export interface Room {
  id: number
  building: Building
  number: string
  type: string
  capacity: number
  floor: number
  description?: string
  has_projector: boolean
  has_whiteboard: boolean
  has_computers: boolean
}

export interface Booking {
  id: number
  room: Room
  user: User
  start_time: string
  end_time: string
  purpose: string
  status: "pending" | "approved" | "rejected" | "canceled"
  created_at: string
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token")
    if (token) {
      return { Authorization: `JWT ${token}` }
    }
    return {}
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }))

        const errorMessage = error.message || error.detail || `HTTP error! status: ${response.status}`
        throw new Error(`${response.status}: ${errorMessage}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Unable to connect to server")
      }
      throw error
    }
  }

  // Auth methods
  async register(userData: {
    username: string
    password: string
    password2: string
    email: string
    first_name: string
    last_name: string
    role: string
    phone?: string
    department?: string
  }) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(username: string, password: string) {
    return this.request<{ access: string; refresh: string; user: User }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/auth/users/")
  }

  async refreshToken(): Promise<{ access: string; refresh: string }> {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    return this.request<{ access: string; refresh: string }>("/auth/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })
  }

  // Buildings and rooms
  async getBuildings(): Promise<Building[]> {
    return this.request<Building[]>("/buildings/")
  }

  async getRooms(buildingId?: number): Promise<Room[]> {
    const query = buildingId ? `?building_id=${buildingId}` : ""
    return this.request<Room[]>(`/rooms/${query}`)
  }

  async createBuilding(buildingData: { name: string; address: string }): Promise<Building> {
    return this.request<Building>("/buildings/", {
      method: "POST",
      body: JSON.stringify(buildingData),
    })
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return this.request<Booking[]>("/bookings/")
  }

  async createBooking(bookingData: {
    room_id: number
    start_time: string
    end_time: string
    purpose: string
  }): Promise<Booking> {
    return this.request<Booking>("/bookings/", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  }

  async approveBooking(bookingId: number) {
    return this.request(`/bookings/${bookingId}/approve/`, { method: "POST" })
  }

  async rejectBooking(bookingId: number) {
    return this.request(`/bookings/${bookingId}/reject/`, { method: "POST" })
  }

  async cancelBooking(bookingId: number) {
    return this.request(`/bookings/${bookingId}/cancel/`, { method: "POST" })
  }
}

export const apiClient = new ApiClient()
