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

  const { data: auctions, isLoading, error, refetch } = useAuctions()
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
    refetch() // Refrescar la lista después de crear/editar
  }

  // Asegurar que auctions es un array antes de filtrar
  const auctionsArray = Array.isArray(auctions) ? auctions : []

  const filteredAuctions = auctionsArray.filter((auction) => {
    const matchesSearch = auction.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || auction.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  // Estadísticas reales
  const stats = {
    total: auctionsArray.length,
    active: auctionsArray.filter(a => a.estado === 'active').length,
    closed: auctionsArray.filter(a => a.estado === 'closed').length,
    totalBids: auctionsArray.reduce((sum, auction) => sum + (auction.total_pujas || 0), 0)
  }

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
        <button 
          onClick={() => refetch()} 
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-green-400 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Subastas Académicas</h1>
            <p className="text-purple-100">
              {isTeacher ? "Gestiona las subastas de tus grupos" : "Participa en subastas con tus Educoins"}
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-200">{stats.total}</div>
              <div className="text-sm text-gray-200">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-200">{stats.active}</div>
              <div className="text-sm text-gray-200">Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-200">{stats.closed}</div>
              <div className="text-sm text-gray-200">Cerradas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-200">{stats.totalBids}</div>
              <div className="text-sm text-gray-200">Pujas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="closed">Cerradas</option>
          </select>
        </div>
        
        {isTeacher && (
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva Subasta
          </button>
        )}
      </div>

      {/* Lista de subastas */}
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm || statusFilter ? "No se encontraron subastas" : "No hay subastas disponibles"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter 
              ? "Intenta con otros términos de búsqueda o filtros"
              : isTeacher
                ? "Crea tu primera subasta para motivar a tus estudiantes"
                : "No hay subastas disponibles en este momento"}
          </p>
          {(isTeacher && !searchTerm && !statusFilter) && (
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition inline-flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Crear Primera Subasta
            </button>
          )}
        </div>
      )}

      {/* Modal para crear/editar */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingAuction ? "Editar Subasta" : "Nueva Subasta"}
        size="lg"
      >
        <CreateAuction 
          auction={editingAuction} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  )
}

export default AuctionList