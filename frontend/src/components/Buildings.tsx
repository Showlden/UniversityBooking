"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { apiClient, type Building, type Room } from "../utils/api"
import { BookingModal } from "./BookingModal"

export const Buildings: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    loadBuildings()
  }, [])

  const loadBuildings = async () => {
    try {
      const buildingsData = await apiClient.getBuildings()
      setBuildings(buildingsData)
    } catch (error) {
      console.error("Error loading buildings:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRooms = async (building: Building) => {
    try {
      setSelectedBuilding(building)
      const roomsData = await apiClient.getRooms(building.id)
      setRooms(roomsData)
    } catch (error) {
      console.error("Error loading rooms:", error)
    }
  }

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room)
    setShowBookingModal(true)
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buildings List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Здания</h2>
          <div className="space-y-4">
            {buildings.map((building) => (
              <div
                key={building.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedBuilding?.id === building.id
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                }`}
                onClick={() => loadRooms(building)}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{building.name}</h3>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2">📍</span>
                  {building.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rooms List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedBuilding ? `Аудитории - ${selectedBuilding.name}` : "Выберите здание"}
          </h2>
          {selectedBuilding ? (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Аудитория {room.number}</h3>
                      <p className="text-gray-600 capitalize">{room.type}</p>
                    </div>
                    <button
                      onClick={() => handleBookRoom(room)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Забронировать
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>👥 Вместимость: {room.capacity}</div>
                    <div>🏢 Этаж: {room.floor}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {room.has_projector && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">📽️ Проектор</span>
                    )}
                    {room.has_whiteboard && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">📝 Доска</span>
                    )}
                    {room.has_computers && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        💻 Компьютеры
                      </span>
                    )}
                  </div>

                  {room.description && <p className="text-gray-600 text-sm">{room.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🏢</div>
              <p>Выберите здание для просмотра аудиторий</p>
            </div>
          )}
        </div>
      </div>

      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false)
            // Можно добавить уведомление об успешном бронировании
          }}
        />
      )}
    </div>
  )
}
