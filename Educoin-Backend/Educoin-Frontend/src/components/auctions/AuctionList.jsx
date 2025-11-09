import { useState } from "react"
import { PlusIcon, ShoppingBagIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import AuctionCard from "./AuctionCard"
import CreateAuction from "./CreateAuction"
import { useAuthContext } from "../../context/AuthContext"
import { useAuctions, useDeleteAuction, useCloseAuction } from "../../hooks/useAuctions"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"

const AuctionList = () => {
  const { user } = useAuthContext()
  const isTeacher = user?.role === "docente"
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAuction, setEditingAuction] = useState(null)

  const { data: auctions, isLoading, error } = useAuctions()
  const deleteAuction = useDeleteAuction()
  const closeAuction = useCloseAuction()

  const handleEdit = (auction) => {
    setEditingAuction(auction)
    setShowCreateModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta subasta?")) {
      await deleteAuction.mutateAsync(id)
    }
  }

  const handleClose = async (id) => {
    if (window.confirm("¿Estás seguro de cerrar esta subasta? Esta acción no se puede deshacer.")) {
      await closeAuction.mutateAsync(id)
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingAuction(null)
  }

  // Asegurar que auctions es un array antes de filtrar
  const auctionsArray = Array.isArray(auctions) ? auctions : []

  const filteredAuctions = auctionsArray.filter((auction) => {
    const matchesSearch = auction.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || auction.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subastas</h1>
          <p className="text-gray-600">
            {isTeacher ? "Crea subastas para motivar a tus estudiantes" : "Participa en subastas y gana premios"}
          </p>
        </div>
        {isTeacher && (
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
            <PlusIcon className="h-5 w-5" />
            Nueva Subasta
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar subastas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="closed">Cerradas</option>
          </select>
        </div>
      </div>

      {filteredAuctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClose={handleClose}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron subastas</h3>
          <p className="text-gray-500 mb-4">
            {isTeacher
              ? "Crea tu primera subasta para motivar a tus estudiantes"
              : "No hay subastas disponibles en este momento"}
          </p>
          {isTeacher && (
            <button onClick={() => setShowCreateModal(true)} className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition inline-flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Nueva Subasta
            </button>
          )}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingAuction ? "Editar Subasta" : "Nueva Subasta"}
        size="lg"
      >
        <CreateAuction auction={editingAuction} onClose={handleCloseModal} />
      </Modal>
    </div>
  )
}

export default AuctionList