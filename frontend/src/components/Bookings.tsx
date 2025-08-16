"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { apiClient, type Booking } from "../utils/api"
import { useAuth } from "../contexts/AuthContext"

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const bookingsData = await apiClient.getBookings()
      setBookings(bookingsData)
    } catch (error) {
      console.error("Error loading bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Вы уверены, что хотите отменить это бронирование?")) return

    try {
      await apiClient.cancelBooking(bookingId)
      await loadBookings()
    } catch (error) {
      console.error("Error canceling booking:", error)
    }
  }

  const handleApproveBooking = async (bookingId: number) => {
    try {
      await apiClient.approveBooking(bookingId)
      await loadBookings()
    } catch (error) {
      console.error("Error approving booking:", error)
    }
  }

  const handleRejectBooking = async (bookingId: number) => {
    if (!confirm("Вы уверены, что хотите отклонить это бронирование?")) return

    try {
      await apiClient.rejectBooking(bookingId)
      await loadBookings()
    } catch (error) {
      console.error("Error rejecting booking:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "canceled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает подтверждения"
      case "approved":
        return "Подтверждено"
      case "rejected":
        return "Отклонено"
      case "canceled":
        return "Отменено"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Мои бронирования</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📅</div>
          <p>У вас пока нет бронирований</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {booking.room.building.name} - Аудитория {booking.room.number}
                  </h3>
                  <p className="text-gray-600 mt-1">{booking.purpose}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">🕐</span>
                  <div>
                    <div className="font-medium">Начало:</div>
                    <div>{new Date(booking.start_time).toLocaleString("ru-RU")}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">🕐</span>
                  <div>
                    <div className="font-medium">Окончание:</div>
                    <div>{new Date(booking.end_time).toLocaleString("ru-RU")}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Создано: {new Date(booking.created_at).toLocaleString("ru-RU")}
                </div>

                <div className="flex space-x-2">
                  {user?.role === "admin" && booking.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApproveBooking(booking.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Подтвердить
                      </button>
                      <button
                        onClick={() => handleRejectBooking(booking.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Отклонить
                      </button>
                    </>
                  )}

                  {(booking.status === "pending" || booking.status === "approved") && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Отменить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
