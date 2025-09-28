"use client"

import { useState } from "react"
import { MagnifyingGlassIcon, PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import AuctionCard from "./AuctionCard"
import CreateAuction from "./CreateAuction"
import { useAuth } from "../../hooks/useAuth"
import { useAuctions, useDeleteAuction } from "../../hooks/useAuctions"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import { debounce } from "../../utils/helpers"
import { AUCTION_STATUS } from "../../utils/constants"

const AuctionList = () => {
  const { isTeacher } = useAuth()
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAuction, setEditingAuction] = useState(null)
  const [deletingAuction, setDeletingAuction] = useState(null)

  const { data: auctions, isLoading, error } = useAuctions(filters)
  const deleteAuction = useDeleteAuction()

  const debouncedSearch = debounce((term) => {
    setFilters((prev) => ({ ...prev, search: term }))
  }, 300)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleEdit = (auction) => {
    setEditingAuction(auction)
    setShowCreateModal(true)
  }

  const handleDelete = (auction) => {
    setDeletingAuction(auction)
  }

  const confirmDelete = async () => {
    if (deletingAuction) {
      await deleteAuction.mutateAsync(deletingAuction.id)
      setDeletingAuction(null)
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingAuction(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar las subastas: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subastas</h1>
          <p className="text-gray-600">
            {isTeacher() ? "Crea subastas para motivar a tus estudiantes" : "Participa en subastas y gana premios"}
          </p>
        </div>
        {isTeacher() && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Subasta
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar subastas..."
              className="input pl-10"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="input"
          >
            <option value="">Todos los estados</option>
            <option value={AUCTION_STATUS.ACTIVE}>Activas</option>
            <option value={AUCTION_STATUS.FINISHED}>Finalizadas</option>
            <option value={AUCTION_STATUS.PENDING}>Pendientes</option>
          </select>
        </div>
      </div>

      {/* Auctions Grid */}
      {auctions?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron subastas</h3>
          <p className="text-gray-500 mb-4">
            {isTeacher()
              ? "Crea tu primera subasta para motivar a tus estudiantes"
              : "No hay subastas disponibles en este momento"}
          </p>
          {isTeacher() && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Subasta
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingAuction ? "Editar Subasta" : "Nueva Subasta"}
        size="lg"
      >
        <CreateAuction auction={editingAuction} onClose={handleCloseModal} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingAuction}
        onClose={() => setDeletingAuction(null)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar la subasta "{deletingAuction?.title}"? Esta acción no se puede
            deshacer.
          </p>
          <div className="flex space-x-3 justify-end">
            <button onClick={() => setDeletingAuction(null)} className="btn-secondary">
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteAuction.isPending}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              {deleteAuction.isPending ? <LoadingSpinner size="sm" /> : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AuctionList
