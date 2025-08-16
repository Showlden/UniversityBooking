"use client"

import type React from "react"
import { useState } from "react"
import { apiClient, type Room } from "../utils/api"

interface BookingModalProps {
  room: Room
  onClose: () => void
  onSuccess: () => void
}

export const BookingModal: React.FC<BookingModalProps> = ({ room, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    purpose: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await apiClient.createBooking({
        room_id: room.id,
        start_time: formData.start_time,
        end_time: formData.end_time,
        purpose: formData.purpose,
      })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при создании бронирования")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Бронирование аудитории</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900">
            {room.building.name} - Аудитория {room.number}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {room.type} • Вместимость: {room.capacity} • Этаж: {room.floor}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата и время начала</label>
            <input
              type="datetime-local"
              name="start_time"
              required
              value={formData.start_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата и время окончания</label>
            <input
              type="datetime-local"
              name="end_time"
              required
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Цель бронирования</label>
            <textarea
              name="purpose"
              required
              rows={3}
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Опишите цель использования аудитории"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Бронирование..." : "Забронировать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
