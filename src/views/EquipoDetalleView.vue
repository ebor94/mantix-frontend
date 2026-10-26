<!-- src/views/EquipoDetalleView.vue -->
<template>
  <MainLayout>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p class="text-gray-500 mt-4">Cargando equipo...</p>
      </div>
    </div>

    <div v-else-if="!equipo" class="text-center py-12">
      <EmptyState
        title="Equipo no encontrado"
        description="El equipo que buscas no existe o fue eliminado"
        icon="cube"
      />
      <router-link to="/equipos" class="btn-primary mt-4">
        Volver a Equipos
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <!-- Header con Breadcrumb -->
      <div class="flex items-center justify-between">
        <div>
          <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <router-link to="/equipos" class="hover:text-primary-600">Equipos</router-link>
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900">{{ equipo.codigo }}</span>
          </nav>
          <h1 class="text-3xl font-bold text-gray-900">{{ equipo.nombre }}</h1>
          <p class="text-gray-500 mt-1">{{ equipo.codigo }}</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <Badge :color="getEstadoColor(equipo.estado)" size="lg">
            {{ formatEstado(equipo.estado) }}
          </Badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna Principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Información General -->
          <div class="card">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información General
            </h2>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-600">Código</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.codigo }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Categoría</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.categoria?.nombre || 'N/A' }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Sede</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.sede?.nombre || 'N/A' }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Ubicación</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.ubicacion_especifica || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Especificaciones Técnicas -->
          <div class="card">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Especificaciones Técnicas
            </h2>
            
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-600">Marca</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.marca || 'N/A' }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Modelo</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.modelo || 'N/A' }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Número de Serie</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.numero_serie || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Información Comercial -->
          <div class="card">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información Comercial
            </h2>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-600">Fecha de Compra</label>
                <p class="text-gray-900 font-semibold mt-1">{{ formatDate(equipo.fecha_compra) }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Fecha de Instalación</label>
                <p class="text-gray-900 font-semibold mt-1">{{ formatDate(equipo.fecha_instalacion) }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Valor de Compra</label>
                <p class="text-gray-900 font-semibold mt-1">{{ formatCurrency(equipo.valor_compra) }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-600">Vida Útil</label>
                <p class="text-gray-900 font-semibold mt-1">{{ equipo.vida_util_anos ? `${equipo.vida_util_anos} años` : 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Observaciones -->
          <div v-if="equipo.observaciones" class="card">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Observaciones
            </h2>
            <p class="text-gray-700 leading-relaxed">{{ equipo.observaciones }}</p>
          </div>

          <!-- Historial de Mantenimientos -->
         <!-- ✅ HISTORIAL DE MANTENIMIENTOS - ACTUALIZADO -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900 flex items-center">
                <svg class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historial de Mantenimientos
              </h2>
              
              <!-- Filtros -->
              <div v-if="historialMantenimientos.length > 0" class="flex items-center space-x-2">
                <select v-model="filtroEstado" class="text-sm border border-gray-300 rounded-lg px-3 py-1">
                  <option value="">Todos los estados</option>
                  <option value="Programado">Programado</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Ejecutado">Ejecutado</option>
                  <option value="Reprogramado">Reprogramado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </div>
            </div>

            <!-- Estadísticas del historial -->
            <div v-if="estadisticasHistorial" class="grid grid-cols-4 gap-4 mb-6">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-blue-600">{{ estadisticasHistorial.total_mantenimientos }}</p>
                <p class="text-xs text-blue-700 font-medium">Total</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-green-600">{{ estadisticasHistorial.completados }}</p>
                <p class="text-xs text-green-700 font-medium">Completados</p>
              </div>
              <div class="bg-yellow-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-yellow-600">{{ estadisticasHistorial.pendientes }}</p>
                <p class="text-xs text-yellow-700 font-medium">Pendientes</p>
              </div>
              <div class="bg-orange-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-orange-600">{{ estadisticasHistorial.reprogramados }}</p>
                <p class="text-xs text-orange-700 font-medium">Reprogramados</p>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingHistorial" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p class="text-gray-500 mt-2 text-sm">Cargando historial...</p>
            </div>

            <!-- Lista de mantenimientos -->
            <div v-else-if="mantenimientosFiltrados.length > 0" class="space-y-3">
              <MantenimientoHistorialCard
                v-for="mantenimiento in mantenimientosFiltrados"
                :key="mantenimiento.id"
                :mantenimiento="mantenimiento"
                @ver-detalle="verDetalleMantenimiento"
              />

              <!-- Paginación info -->
              <div v-if="paginacionHistorial" class="text-center pt-4 border-t">
                <p class="text-sm text-gray-600">
                  Mostrando {{ mantenimientosFiltrados.length }} de {{ paginacionHistorial.total }} mantenimientos
                </p>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-sm font-medium">No hay mantenimientos registrados</p>
              <p class="text-xs mt-1">Este equipo aún no tiene historial de mantenimientos</p>
            </div>
          </div>
        
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Acciones Rápidas -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
            <div class="space-y-3">
              <button
                @click="openEditarModal"
                class="w-full btn-primary"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Equipo
              </button>

              <button
                @click="$router.push('/equipos')"
                class="w-full btn-secondary"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </button>
            </div>
          </div>

          <!-- Información Adicional -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Detalles</h3>
            <div class="space-y-3">
              <div v-if="equipo.responsable_proveedor">
                <label class="text-xs font-medium text-gray-600">Proveedor de Mantenimiento</label>
                <p class="text-sm font-semibold text-gray-900">
                  {{ equipo.responsable_proveedor.nombre }}
                </p>
              </div>
              <div v-else-if="equipo.responsable">
                <label class="text-xs font-medium text-gray-600">Responsable Interno</label>
                <p class="text-sm font-semibold text-gray-900">
                  {{ equipo.responsable.nombre }} {{ equipo.responsable.apellido }}
                </p>
              </div>

              <div v-if="equipo.created_at">
                <label class="text-xs font-medium text-gray-600">Creado el</label>
                <p class="text-sm text-gray-700">{{ formatDateTime(equipo.created_at) }}</p>
              </div>

              <div v-if="equipo.updated_at">
                <label class="text-xs font-medium text-gray-600">Última actualización</label>
                <p class="text-sm text-gray-700">{{ formatDateTime(equipo.updated_at) }}</p>
              </div>
            </div>
          </div>

     <!-- ✅ ACTUALIZAR Estadísticas -->
          <div class="card bg-gradient-to-br from-primary-50 to-primary-100">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Estadísticas</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Mantenimientos</span>
                <span class="text-lg font-bold text-primary-600">
                  {{ estadisticasHistorial?.total_mantenimientos || 0 }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Último mantenimiento</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ ultimoMantenimiento ? formatDate(ultimoMantenimiento.fecha_programada) : 'N/A' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Próximo mantenimiento</span>
                <span class="text-sm font-medium" :class="colorProximoMto">
                  {{ proximoMantenimiento ? formatDate(proximoMantenimiento.fecha_programada) : 'N/A' }}
                </span>
              </div>
              <div v-if="diasDesdeUltimo !== null" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Días desde último</span>
                <span class="text-sm font-semibold text-gray-900">{{ diasDesdeUltimo }}</span>
              </div>
              <div v-if="diasHastaProximo !== null" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Días hasta próximo</span>
                <span class="text-sm font-semibold" :class="colorProximoMto">
                  {{ diasHastaProximo >= 0 ? diasHastaProximo : `${Math.abs(diasHastaProximo)} atrasado` }}
                </span>
              </div>
            </div>
          </div>

          <!-- Estado de vida útil del equipo -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Vida útil</h3>
            <div v-if="equipo.fecha_instalacion && equipo.vida_util_anos" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Edad del equipo</span>
                <span class="text-sm font-semibold text-gray-900">{{ edadEquipo }} años</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Vida útil total</span>
                <span class="text-sm font-semibold text-gray-900">{{ equipo.vida_util_anos }} años</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Vida útil restante</span>
                <span class="text-sm font-semibold" :class="colorVidaUtil">
                  {{ vidaUtilRestante >= 0 ? `${vidaUtilRestante} años` : 'Vencida' }}
                </span>
              </div>
              <!-- Barra de progreso -->
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  class="h-2 rounded-full transition-all"
                  :class="barraVidaUtilColor"
                  :style="{ width: Math.min(100, Math.max(0, porcentajeVidaUtil)) + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ Math.round(porcentajeVidaUtil) }}% de vida útil consumida
              </p>
            </div>
            <!-- Prompt para completar si faltan datos -->
            <div v-else class="space-y-3">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div class="flex items-start space-x-2">
                  <svg class="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="flex-1 text-xs text-yellow-800">
                    <p class="font-semibold mb-1">Datos no registrados</p>
                    <p>
                      Falta
                      <template v-if="!equipo.fecha_instalacion && !equipo.vida_util_anos">
                        <strong>fecha de instalación</strong> y <strong>vida útil (años)</strong>
                      </template>
                      <template v-else-if="!equipo.fecha_instalacion">
                        <strong>fecha de instalación</strong>
                      </template>
                      <template v-else>
                        <strong>vida útil (años)</strong>
                      </template>
                      para calcular edad y vida útil restante del equipo.
                    </p>
                  </div>
                </div>
              </div>
              <button @click="openEditarModal"
                      class="w-full inline-flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium">
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Completar datos del equipo
              </button>
            </div>
          </div>

          <!-- Alerta próximo mantenimiento vencido -->
          <div v-if="diasHastaProximo !== null && diasHastaProximo < 0"
               class="card bg-red-50 border border-red-200">
            <div class="flex items-start space-x-3">
              <svg class="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-red-800">Mantenimiento atrasado</h4>
                <p class="text-xs text-red-700 mt-1">
                  El próximo mantenimiento programado tenía fecha {{ formatDate(proximoMantenimiento?.fecha_programada) }}
                  ({{ Math.abs(diasHastaProximo) }} días de atraso).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <EditarEquipoModal
      v-if="showEditarModal"
      :equipo="equipo"
      @close="showEditarModal = false"
      @success="handleSuccess"
    />
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEquiposStore } from '@/stores/equipos'
import { storeToRefs } from 'pinia'
import MainLayout from '@/components/common/MainLayout.vue'
import Badge from '@/components/common/Badge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import EditarEquipoModal from '@/components/equipos/EditarEquipoModal.vue'
import MantenimientoHistorialCard from '@/components/equipos/MantenimientoHistorialCard.vue' // ✅ NUEVO
import api from '@/services/api' // ✅ NUEVO
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

const route = useRoute()
const router = useRouter()
const equiposStore = useEquiposStore()

const { equipoActual: equipo, loading } = storeToRefs(equiposStore)

const showEditarModal = ref(false)

// ✅ NUEVAS REFERENCIAS PARA HISTORIAL
const historialMantenimientos = ref([])
const estadisticasHistorial = ref(null)
const paginacionHistorial = ref(null)
const loadingHistorial = ref(false)
const filtroEstado = ref('')

// ✅ COMPUTED PARA FILTRAR MANTENIMIENTOS
const mantenimientosFiltrados = computed(() => {
  if (!filtroEstado.value) {
    return historialMantenimientos.value
  }
  return historialMantenimientos.value.filter(m => 
    m.estado.nombre === filtroEstado.value
  )
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY')
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const formatCurrency = (value) => {
  if (!value) return 'N/A'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}

const formatEstado = (estado) => {
  const estados = {
    operativo: 'Operativo',
    fuera_servicio: 'Fuera de Servicio',
    en_mantenimiento: 'En Mantenimiento',
    dado_baja: 'Dado de Baja'
  }
  return estados[estado] || estado
}

const getEstadoColor = (estado) => {
  const colors = {
    operativo: 'green',
    en_mantenimiento: 'orange',
    fuera_servicio: 'red',
    dado_baja: 'gray'
  }
  return colors[estado] || 'gray'
}

const openEditarModal = () => {
  showEditarModal.value = true
}

const handleSuccess = async () => {
  showEditarModal.value = false
  await loadEquipo()
}
// ✅ COMPUTED PARA ÚLTIMO Y PRÓXIMO MANTENIMIENTO
const ultimoMantenimiento = computed(() => {
  const ejecutados = historialMantenimientos.value.filter(m => 
    m.estado.nombre === 'Ejecutado'
  )
  if (ejecutados.length === 0) return null
  return ejecutados.sort((a, b) => 
    new Date(b.fecha_programada) - new Date(a.fecha_programada)
  )[0]
})

const proximoMantenimiento = computed(() => {
  const pendientes = historialMantenimientos.value.filter(m =>
    m.estado.nombre === 'Programado' || m.estado.nombre === 'Reprogramado'
  )
  if (pendientes.length === 0) return null
  console.log('Mantenimientos pendientes:', pendientes)
  return pendientes.sort((a, b) =>
    new Date() - new Date(b.fecha_programada)
  )[0]
})

// Métricas calculadas para auditoría
const diasDesdeUltimo = computed(() => {
  if (!ultimoMantenimiento.value) return null
  return dayjs().diff(dayjs(ultimoMantenimiento.value.fecha_programada), 'day')
})

const diasHastaProximo = computed(() => {
  if (!proximoMantenimiento.value) return null
  return dayjs(proximoMantenimiento.value.fecha_programada).diff(dayjs(), 'day')
})

const colorProximoMto = computed(() => {
  const d = diasHastaProximo.value
  if (d === null) return 'text-gray-900'
  if (d < 0) return 'text-red-600'
  if (d <= 7) return 'text-orange-600'
  if (d <= 30) return 'text-yellow-600'
  return 'text-green-600'
})

const edadEquipo = computed(() => {
  if (!equipo.value?.fecha_instalacion) return 0
  const years = dayjs().diff(dayjs(equipo.value.fecha_instalacion), 'year', true)
  return Math.round(years * 10) / 10
})

const vidaUtilRestante = computed(() => {
  if (!equipo.value?.vida_util_anos) return null
  const restante = equipo.value.vida_util_anos - edadEquipo.value
  return Math.round(restante * 10) / 10
})

const porcentajeVidaUtil = computed(() => {
  if (!equipo.value?.vida_util_anos) return 0
  return (edadEquipo.value / equipo.value.vida_util_anos) * 100
})

const colorVidaUtil = computed(() => {
  const r = vidaUtilRestante.value
  if (r === null) return 'text-gray-900'
  if (r < 0) return 'text-red-600'
  if (r < 1) return 'text-orange-600'
  if (r < 3) return 'text-yellow-600'
  return 'text-green-600'
})

const barraVidaUtilColor = computed(() => {
  const p = porcentajeVidaUtil.value
  if (p >= 100) return 'bg-red-500'
  if (p >= 80) return 'bg-orange-500'
  if (p >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
})

// ✅ NUEVA FUNCIÓN PARA CARGAR HISTORIAL
const loadHistorialMantenimientos = async () => {
  loadingHistorial.value = true
  try {
    const response = await api.get(`/equipos/${route.params.id}/historial-mantenimientos`)
    console.log('Respuesta historial mantenimientos:', response)
    if (response.success) {
      historialMantenimientos.value = response.data.mantenimientos || []
      estadisticasHistorial.value = response.data.estadisticas || null
      paginacionHistorial.value = response.data.paginacion || null
    } else {
      historialMantenimientos.value = []
    }
  } catch (error) {
    console.error('Error al cargar historial:', error)
    historialMantenimientos.value = []
  } finally {
    loadingHistorial.value = false
  }
}

// ✅ FUNCIÓN PARA VER DETALLE DE MANTENIMIENTO
const verDetalleMantenimiento = (mantenimiento) => {
  router.push(`/mantenimientos/${mantenimiento.id}`)
}

const loadEquipo = async () => {
  const id = route.params.id
  console.log('Cargando equipo con ID:', id)
  await equiposStore.fetchEquipo(id)
  
  // ✅ CARGAR HISTORIAL DESPUÉS DE CARGAR EL EQUIPO
  await loadHistorialMantenimientos()
}

onMounted(() => {
  console.log('EquipoDetalleView montado')
  console.log('Parámetro ID:', route.params.id)
  loadEquipo()
})
</script>