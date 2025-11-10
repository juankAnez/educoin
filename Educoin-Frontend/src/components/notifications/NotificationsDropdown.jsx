import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { 
  BellIcon, 
  CheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
  TrophyIcon,
  AcademicCapIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import { formatDateTime, formatRelativeTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState('all') // 'all', 'unread'
  const [showActions, setShowActions] = useState(false) // Para móviles
  const dropdownRef = useRef(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Fetch notificaciones
  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/notifications/')
        return Array.isArray(res.data) ? res.data : []
      } catch (error) {
        console.error('Error fetching notifications:', error)
        return []
      }
    },
    refetchInterval: 15000, // Refrescar cada 15 segundos
  })

  const notifications = notificationsData || []
  
  // Filtrar notificaciones según el modo de vista
  const filteredNotifications = viewMode === 'unread' 
    ? notifications.filter(n => !n.leida)
    : notifications

  const unreadCount = notifications.filter(n => !n.leida).length

  // Marcar como leída
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/api/notifications/${id}/marcar-leida/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
    },
    onError: () => {
      toast.error('Error al marcar como leída')
    }
  })

  // Marcar todas como leídas
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/notifications/marcar-todas-leidas/')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Todas las notificaciones marcadas como leídas')
    },
    onError: () => {
      toast.error('Error al marcar todas como leídas')
    }
  })

  // Eliminar notificación
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/notifications/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Notificación eliminada')
    },
    onError: () => {
      toast.error('Error al eliminar notificación')
    }
  })

  // Eliminar todas las leídas
  const deleteAllReadMutation = useMutation({
    mutationFn: async () => {
      const readNotifications = notifications.filter(n => n.leida)
      await Promise.all(
        readNotifications.map(notification => 
          api.delete(`/api/notifications/${notification.id}/`)
        )
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Notificaciones leídas eliminadas')
    },
    onError: () => {
      toast.error('Error al eliminar notificaciones')
    }
  })

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowActions(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getNotificationIcon = (tipo) => {
    const baseClasses = "h-4 w-4 xs:h-5 xs:w-5"
    
    switch (tipo) {
      case 'actividad':
        return <AcademicCapIcon className={`${baseClasses} text-blue-600`} />
      case 'calificacion':
        return <CheckIcon className={`${baseClasses} text-green-600`} />
      case 'monedas':
        return <CurrencyEuroIcon className={`${baseClasses} text-orange-600`} />
      case 'subasta_nueva':
        return <TrophyIcon className={`${baseClasses} text-purple-600`} />
      case 'subasta_ganada':
        return <CheckBadgeIcon className={`${baseClasses} text-green-600`} />
      case 'anuncio':
        return <ExclamationTriangleIcon className={`${baseClasses} text-yellow-600`} />
      default:
        return <BellIcon className={`${baseClasses} text-gray-600`} />
    }
  }

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'actividad':
        return 'bg-blue-100 border-blue-200'
      case 'calificacion':
        return 'bg-green-100 border-green-200'
      case 'monedas':
        return 'bg-orange-100 border-orange-200'
      case 'subasta_nueva':
        return 'bg-purple-100 border-purple-200'
      case 'subasta_ganada':
        return 'bg-green-100 border-green-200'
      case 'anuncio':
        return 'bg-yellow-100 border-yellow-200'
      default:
        return 'bg-gray-100 border-gray-200'
    }
  }

  const handleNotificationClick = (notification) => {
    // Marcar como leída si no lo está
    if (!notification.leida) {
      markAsReadMutation.mutate(notification.id)
    }

    // Navegar según el tipo y datos disponibles
    let targetUrl = null
    
    if (notification.activity_id) {
      targetUrl = `/activities/${notification.activity_id}`
    } else if (notification.auction_id) {
      targetUrl = `/auctions/${notification.auction_id}`
    } else if (notification.grade_id) {
      targetUrl = `/activities` // Las calificaciones se ven en actividades
    } else if (notification.tipo === 'monedas') {
      targetUrl = '/wallet'
    }

    if (targetUrl) {
      navigate(targetUrl)
    } else {
      // Si no hay URL específica, navegar a la página principal correspondiente
      switch (notification.tipo) {
        case 'actividad':
          navigate('/activities')
          break
        case 'calificacion':
          navigate('/activities')
          break
        case 'subasta_nueva':
        case 'subasta_ganada':
          navigate('/auctions')
          break
        case 'monedas':
          navigate('/wallet')
          break
        default:
          // No navegar, solo cerrar el dropdown
          break
      }
    }
    
    setIsOpen(false)
    setShowActions(false)
  }

  const getPriority = (notification) => {
    // Notificaciones no leídas tienen prioridad
    if (!notification.leida) return 1
    // Notificaciones recientes (menos de 1 hora)
    const created = new Date(notification.creado)
    const now = new Date()
    const hoursDiff = (now - created) / (1000 * 60 * 60)
    if (hoursDiff < 1) return 2
    return 3
  }

  // Ordenar notificaciones por prioridad y fecha
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const priorityA = getPriority(a)
    const priorityB = getPriority(b)
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }
    
    return new Date(b.creado) - new Date(a.creado)
  })

  // Tamaños responsivos del dropdown
  const getDropdownWidth = () => {
    if (typeof window === 'undefined') return 'w-80'
    
    const width = window.innerWidth
    if (width < 475) return 'w-[calc(100vw-2rem)] max-w-xs' // xs
    if (width < 640) return 'w-80' // sm
    if (width < 768) return 'w-96' // md
    return 'w-96' // lg, xl
  }

  const getDropdownPosition = () => {
    if (typeof window === 'undefined') return 'right-0'
    
    const width = window.innerWidth
    if (width < 475) return 'right-1/2 transform translate-x-1/2' // Centrado en móviles muy pequeños
    return 'right-0'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-1.5 xs:p-2 rounded-lg xs:rounded-xl transition-all duration-200 ${
          isOpen 
            ? 'bg-orange-100 text-orange-600' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-orange-500'
        }`}
        aria-label="Notificaciones"
      >
        <BellIcon className="h-5 w-5 xs:h-6 xs:w-6" />
        {unreadCount > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 xs:top-1 xs:right-1 h-4 w-4 xs:h-5 xs:w-5 text-[10px] xs:text-xs rounded-full flex items-center justify-center font-bold ring-1 xs:ring-2 ring-white ${
            unreadCount > 9 
              ? 'bg-red-500 text-white text-[8px] xs:text-[10px]' 
              : 'bg-orange-500 text-white'
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute ${getDropdownPosition()} mt-2 ${getDropdownWidth()} bg-white rounded-xl xs:rounded-2xl shadow-xl border border-gray-200 z-50 max-h-[85vh] flex flex-col transform transition-all duration-200`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 xs:p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base xs:text-lg truncate">Notificaciones</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {unreadCount > 0 && (
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full whitespace-nowrap">
                    {unreadCount} sin leer
                  </span>
                )}
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {notifications.length} total
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Botón de acciones para móviles */}
              <div className="xs:hidden">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-600"
                  title="Más acciones"
                >
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Botones normales para tablets y mayores */}
              <div className="hidden xs:flex items-center gap-1">
                <button
                  onClick={() => setViewMode(viewMode === 'all' ? 'unread' : 'all')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                  title={viewMode === 'all' ? 'Ver solo no leídas' : 'Ver todas'}
                >
                  {viewMode === 'all' ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                  aria-label="Cerrar"
                >
                  <XMarkIcon className="h-4 w-4 xs:h-5 xs:w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions Bar - Siempre visible en tablets+, condicional en móviles */}
          {(unreadCount > 0 || notifications.some(n => n.leida)) && (
            <div className={`${showActions ? 'flex' : 'hidden'} xs:flex items-center justify-between p-2 xs:p-3 border-b border-gray-100 bg-gray-50/50`}>
              <div className="flex items-center gap-1 xs:gap-2 flex-wrap">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-blue-50 transition flex items-center gap-1 whitespace-nowrap"
                  >
                    <CheckIcon className="h-3 w-3" />
                    <span className="hidden xs:inline">Marcar todas</span>
                    <span className="xs:hidden">Todas leídas</span>
                  </button>
                )}
                
                {/* Filtro de vista para móviles */}
                <div className="xs:hidden">
                  <button
                    onClick={() => setViewMode(viewMode === 'all' ? 'unread' : 'all')}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition flex items-center gap-1 whitespace-nowrap"
                  >
                    {viewMode === 'all' ? <EyeSlashIcon className="h-3 w-3" /> : <EyeIcon className="h-3 w-3" />}
                    <span>{viewMode === 'all' ? 'Solo no leídas' : 'Ver todas'}</span>
                  </button>
                </div>
              </div>
              
              {notifications.some(n => n.leida) && (
                <button
                  onClick={() => deleteAllReadMutation.mutate()}
                  disabled={deleteAllReadMutation.isPending}
                  className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-red-50 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <TrashIcon className="h-3 w-3" />
                  <span className="hidden xs:inline">Limpiar leídas</span>
                  <span className="xs:hidden">Limpiar</span>
                </button>
              )}
            </div>
          )}

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 xs:py-12 px-4">
                <div className="animate-spin rounded-full h-6 w-6 xs:h-8 xs:w-8 border-b-2 border-orange-500 mb-3 xs:mb-4"></div>
                <p className="text-gray-500 text-xs xs:text-sm">Cargando notificaciones...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 xs:py-12 px-4">
                <ExclamationTriangleIcon className="h-8 w-8 xs:h-12 xs:w-12 text-red-300 mx-auto mb-3 xs:mb-4" />
                <p className="text-red-500 text-xs xs:text-sm">Error al cargar notificaciones</p>
                <button 
                  onClick={() => queryClient.invalidateQueries(['notifications'])}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-2"
                >
                  Reintentar
                </button>
              </div>
            ) : sortedNotifications.length === 0 ? (
              <div className="text-center py-8 xs:py-12 px-4">
                <BellIcon className="h-12 w-12 xs:h-16 xs:w-16 text-gray-200 mx-auto mb-3 xs:mb-4" />
                <p className="text-gray-500 text-sm font-medium">
                  {viewMode === 'unread' ? 'No hay notificaciones sin leer' : 'No tienes notificaciones'}
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  {viewMode === 'unread' 
                    ? '¡Buen trabajo! Estás al día con todo.' 
                    : 'Aquí verás tus actividades, calificaciones y más'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 xs:p-4 hover:bg-gray-50 transition-all duration-200 relative group border-l-2 xs:border-l-4 ${
                      !notification.leida 
                        ? 'bg-blue-50/50 border-l-blue-400' 
                        : 'border-l-transparent'
                    }`}
                  >
                    <div 
                      onClick={() => handleNotificationClick(notification)}
                      className="flex items-start gap-2 xs:gap-3 cursor-pointer"
                    >
                      {/* Icon */}
                      <div className={`p-1.5 xs:p-2 rounded-lg flex-shrink-0 border ${getNotificationColor(notification.tipo)}`}>
                        {getNotificationIcon(notification.tipo)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs xs:text-sm font-medium line-clamp-2 ${
                            !notification.leida ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.titulo}
                          </p>
                          {!notification.leida && (
                            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 xs:mt-1.5"></div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 xs:line-clamp-3 leading-relaxed">
                          {notification.mensaje}
                        </p>
                        
                        {/* Metadata adicional */}
                        {notification.metadata && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {notification.metadata.nota && (
                              <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-medium bg-green-100 text-green-800">
                                Nota: {notification.metadata.nota}
                              </span>
                            )}
                            {notification.metadata.cantidad && (
                              <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-medium bg-orange-100 text-orange-800">
                                +{notification.metadata.cantidad} EC
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center mt-2 text-[10px] xs:text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {notification.tiempo_transcurrido || formatRelativeTime(notification.creado) || formatDateTime(notification.creado)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Solo hover en tablets+ */}
                    <div className="absolute top-2 xs:top-3 right-2 xs:right-3 flex items-center gap-0.5 xs:gap-1 opacity-0 xs:group-hover:opacity-100 transition-opacity">
                      {!notification.leida && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsReadMutation.mutate(notification.id)
                          }}
                          className="p-0.5 xs:p-1 text-gray-400 hover:text-green-600 transition-colors rounded"
                          title="Marcar como leída"
                        >
                          <CheckIcon className="h-3 w-3 xs:h-4 xs:w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotificationMutation.mutate(notification.id)
                        }}
                        className="p-0.5 xs:p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-3 w-3 xs:h-4 xs:w-4" />
                      </button>
                    </div>

                    {/* Action Buttons - Siempre visibles en móviles pequeños */}
                    <div className="xs:hidden flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                      {!notification.leida && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsReadMutation.mutate(notification.id)
                          }}
                          className="flex-1 text-xs text-green-600 hover:text-green-700 font-medium py-1.5 rounded-lg hover:bg-green-50 transition flex items-center justify-center gap-1"
                        >
                          <CheckIcon className="h-3 w-3" />
                          Leída
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotificationMutation.mutate(notification.id)
                        }}
                        className="flex-1 text-xs text-red-600 hover:text-red-700 font-medium py-1.5 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-1"
                      >
                        <TrashIcon className="h-3 w-3" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {sortedNotifications.length > 0 && (
            <div className="p-2 xs:p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 truncate">
                  {viewMode === 'unread' 
                    ? `${unreadCount} sin leer` 
                    : `${sortedNotifications.length} notificaciones`
                  }
                </p>
                {viewMode === 'all' && unreadCount > 0 && (
                  <button
                    onClick={() => setViewMode('unread')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap ml-2"
                  >
                    Ver solo sin leer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationsDropdown