"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { apiClient, type User, type Building } from "../utils/api"

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("users")
  const [showAddBuildingForm, setShowAddBuildingForm] = useState(false)
  const [newBuilding, setNewBuilding] = useState({ name: "", address: "" })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, buildingsData] = await Promise.all([apiClient.getUsers(), apiClient.getBuildings()])
      setUsers(usersData)
      setBuildings(buildingsData)
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.createBuilding(newBuilding)
      setNewBuilding({ name: "", address: "" })
      setShowAddBuildingForm(false)
      await loadData()
    } catch (error) {
      console.error("Error adding building:", error)
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Администрирование</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "users"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            👥 Пользователи ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("buildings")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "buildings"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            🏢 Здания ({buildings.length})
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Роль
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Кафедра
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Телефон
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "teacher"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Buildings Tab */}
      {activeTab === "buildings" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Управление зданиями</h3>
            <button
              onClick={() => setShowAddBuildingForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              + Добавить здание
            </button>
          </div>

          {showAddBuildingForm && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Добавить новое здание</h4>
              <form onSubmit={handleAddBuilding} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Название здания</label>
                    <input
                      type="text"
                      required
                      value={newBuilding.name}
                      onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Например: Главный корпус"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
                    <input
                      type="text"
                      required
                      value={newBuilding.address}
                      onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Например: ул. Ленина, 1"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Добавить
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBuildingForm(false)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <div
                key={building.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{building.name}</h4>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2">📍</span>
                  {building.address}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
