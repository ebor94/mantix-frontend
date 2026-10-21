<!-- src/views/ReportesView.vue -->
<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
        <p class="text-gray-500 mt-1">Genera y exporta reportes personalizados</p>
      </div>

      <!-- Filtros Globales -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros Globales</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rango de Fechas
            </label>
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="filtros.fecha_inicio"
                type="date"
                class="input-field"
                placeholder="Fecha inicio"
              />
              <input
                v-model="filtros.fecha_fin"
                type="date"
                class="input-field"
                placeholder="Fecha fin"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sede</label>
            <select v-model="filtros.sede_id" class="input-field">
              <option :value="null">Todas las sedes</option>
              <option v-for="sede in sedes" :key="sede.id" :value="sede.id">
                {{ sede.nombre }}
              </option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="aplicarFiltros" class="btn-primary w-full">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Tipos de Reportes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReporteCard
          titulo="Cumplimiento"
          descripcion="Reporte de cumplimiento de mantenimientos por sede"
          icono="chart-bar"
          color="blue"
          @seleccionar="seleccionarReporte('cumplimiento')"
        />

        <ReporteCard
          titulo="Mantenimientos"
          descripcion="Listado detallado de mantenimientos realizados"
          icono="wrench"
          color="green"
          @seleccionar="seleccionarReporte('mantenimientos')"
        />

        <ReporteCard
          titulo="Solicitudes R-275"
          descripcion="Reporte de solicitudes de mantenimiento correctivo"
          icono="document"
          color="orange"
          @seleccionar="seleccionarReporte('solicitudes')"
        />

        <ReporteCard
          titulo="Inventario de Equipos"
          descripcion="Listado completo de equipos y su estado"
          icono="cube"
          color="purple"
          @seleccionar="seleccionarReporte('equipos')"
        />

        <ReporteCard
          titulo="R-25 Programa de Mantenimientos"
          descripcion="Cronograma anual por categoría, 12 meses programado/ejecutado"
          icono="document"
          color="red"
          @seleccionar="seleccionarReporte('programa-anual')"
        />
      </div>

      <!-- Filtros adicionales para R-25 -->
      <div v-if="reporteSeleccionado === 'programa-anual'" class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros del Programa Anual</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Año</label>
            <select v-model.number="anioSeleccionado" @change="generarReporte" class="input-field">
              <option v-for="y in aniosDisponibles" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select v-model="categoriaSeleccionada" @change="generarReporte" class="input-field">
              <option :value="null">Todas las categorías</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
          </div>
          <div class="text-xs text-gray-500 flex items-end">
            El filtro de Sede del encabezado también aplica a este reporte.
          </div>
        </div>
      </div>

      <!-- Vista Previa del Reporte -->
      <div v-if="reporteSeleccionado" class="card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ getTituloReporte(reporteSeleccionado) }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ datosReporte?.length || 0 }} registros encontrados
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="exportarExcel"
              class="btn-secondary"
              :disabled="loading || !datosReporte?.length"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar a Excel
            </button>
            <button
              @click="exportarPDF"
              class="btn-primary"
              :disabled="loading || !datosReporte?.length"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Exportar a PDF
            </button>
          </div>
        </div>

        <!-- Loader -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p class="text-gray-500 mt-4">Generando reporte...</p>
        </div>

        <!-- Tabla de datos -->
        <div v-else-if="datosReporte && datosReporte.length > 0" class="overflow-x-auto">
          <!-- Reporte de Cumplimiento -->
          <table v-if="reporteSeleccionado === 'cumplimiento'" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programados</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ejecutados</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cumplimiento</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in datosReporte" :key="item.sede_id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.nombre || item.codigo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.programados }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.ejecutados }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm font-semibold" :class="getCumplimientoColor(item.cumplimiento)">
                      {{ item.cumplimiento }}%
                    </span>
                    <div class="ml-2 w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full"
                        :class="getCumplimientoBarColor(item.cumplimiento)"
                        :style="{ width: item.cumplimiento + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Reporte de Mantenimientos -->
          <table v-else-if="reporteSeleccionado === 'mantenimientos'" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Programada</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in datosReporte" :key="item.id">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ item.actividad?.nombre || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.actividad?.sede?.nombre || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(item.fecha_programada) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :color="getEstadoColor(item.estado?.nombre)">
                    {{ item.estado?.nombre }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :color="getPrioridadColor(item.prioridad)">
                    {{ item.prioridad }}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Reporte de Solicitudes -->
          <table v-else-if="reporteSeleccionado === 'solicitudes'" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in datosReporte" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ item.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.solicitante }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {{ item.descripcion }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.sede?.nombre || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :color="getEstadoColor(item.estado?.nombre)">
                    {{ item.estado?.nombre }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :color="getPrioridadColor(item.prioridad)">
                    {{ item.prioridad }}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Reporte de Equipos -->
          <table v-else-if="reporteSeleccionado === 'equipos'" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in datosReporte" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {{ item.codigo }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ item.nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.sede?.nombre || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.categoria?.nombre || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :color="getEstadoEquipoColor(item.estado)">
                    {{ formatEstadoEquipo(item.estado) }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.responsable ? `${item.responsable.nombre} ${item.responsable.apellido}` : 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- R-25 Programa anual (pivot categoría × actividad × 12 meses P/E) -->
          <table v-else-if="reporteSeleccionado === 'programa-anual'" class="min-w-full border-collapse text-xs">
            <thead class="bg-green-500 text-white">
              <tr>
                <th rowspan="2" class="px-2 py-2 border border-green-700 text-left align-middle sticky left-0 bg-green-500 z-10">Trabajo a Realizar</th>
                <th rowspan="2" class="px-2 py-2 border border-green-700 text-left align-middle">Equipo</th>
                <th rowspan="2" class="px-2 py-2 border border-green-700 text-left align-middle">Sede(s)</th>
                <th rowspan="2" class="px-2 py-2 border border-green-700 text-left align-middle">Responsable</th>
                <th rowspan="2" class="px-2 py-2 border border-green-700 text-left align-middle">Periodicidad</th>
                <th rowspan="2" class="px-2 py-2 border border-green-700 text-left align-middle">Tipo de Mto</th>
                <th rowspan="2" class="px-2 py-2 border border-green-700 text-center align-middle">Reg.</th>
                <th v-for="m in meses" :key="m.num" colspan="2" class="px-2 py-1 border border-green-700 text-center">
                  {{ m.nombre }}
                </th>
              </tr>
              <tr>
                <template v-for="m in meses" :key="`sub-${m.num}`">
                  <th class="px-2 py-1 border border-green-700 text-center bg-yellow-200 text-gray-800">P</th>
                  <th class="px-2 py-1 border border-green-700 text-center bg-yellow-200 text-gray-800">E</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <template v-for="grupo in programaAnualData" :key="grupo.categoria_id">
                <tr class="bg-gray-100 font-bold">
                  <td :colspan="7 + 24" class="px-2 py-2 text-gray-800 border border-gray-300 uppercase">
                    {{ grupo.categoria }}
                  </td>
                </tr>
                <tr
                  v-for="act in grupo.actividades"
                  :key="act.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-2 py-2 border border-gray-300 sticky left-0 bg-white">{{ act.trabajo_a_realizar }}</td>
                  <td class="px-2 py-2 border border-gray-300">{{ act.equipo }}</td>
                  <td class="px-2 py-2 border border-gray-300">{{ act.sede_codigo || act.sede_nombre }}</td>
                  <td class="px-2 py-2 border border-gray-300">{{ act.responsable }}</td>
                  <td class="px-2 py-2 border border-gray-300">{{ act.periodicidad }}</td>
                  <td class="px-2 py-2 border border-gray-300">{{ act.tipo_mantenimiento }}</td>
                  <td class="px-2 py-2 border border-gray-300 text-center">{{ act.registro }}</td>
                  <template v-for="m in meses" :key="`cell-${act.id}-${m.num}`">
                    <td
                      class="px-1 py-1 border border-gray-300 text-center whitespace-nowrap"
                      :class="celdaProgramada(act, m.num) ? 'bg-yellow-50' : ''"
                    >
                      {{ formatProgramacionCorta(act.meses?.[m.num]) }}
                    </td>
                    <td
                      class="px-1 py-1 border border-gray-300 text-center whitespace-nowrap"
                      :class="celdaEjecutada(act, m.num) ? 'bg-green-200' : ''"
                      :title="tooltipEjecucion(act.meses?.[m.num])"
                    >
                      <div>{{ formatEjecucionCorta(act.meses?.[m.num]) }}</div>
                      <div v-if="celdaEjecutada(act, m.num)" class="text-[10px] text-gray-600 leading-tight mt-0.5">
                        {{ formatEjecutores(act.meses?.[m.num]) }}
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <EmptyState
          v-else
          title="No hay datos"
          description="No se encontraron datos con los filtros aplicados"
          icon="document"
        />
      </div>

      <!-- Mensaje inicial -->
      <div v-else class="card">
        <div class="text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Selecciona un tipo de reporte</h3>
          <p class="mt-2 text-sm text-gray-500">Elige una de las opciones arriba para generar un reporte</p>
        </div>
      </div>
    </div>

    <Loader :loading="loading" />
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportesStore } from '@/stores/reportes'
import MainLayout from '@/components/common/MainLayout.vue'
import ReporteCard from '@/components/reportes/ReporteCard.vue'
import Badge from '@/components/common/Badge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Loader from '@/components/common/Loader.vue'
import api from '@/services/api'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useToast } from 'vue-toastification'

const toast = useToast()
const reportesStore = useReportesStore()
const { loading } = storeToRefs(reportesStore)

const reporteSeleccionado = ref(null)
const datosReporte = ref(null)
const sedes = ref([])
const categorias = ref([])

const filtros = ref({
  fecha_inicio: dayjs().startOf('month').format('YYYY-MM-DD'),
  fecha_fin: dayjs().endOf('month').format('YYYY-MM-DD'),
  sede_id: null
})

// R-25 Programa anual
const anioSeleccionado = ref(new Date().getFullYear())
const categoriaSeleccionada = ref(null)
const programaAnualData = ref([])

const aniosDisponibles = computed(() => {
  const a = new Date().getFullYear()
  return [a, a - 1, a - 2, a - 3]
})

const meses = [
  { num: 1,  nombre: 'ENE' }, { num: 2,  nombre: 'FEB' },
  { num: 3,  nombre: 'MAR' }, { num: 4,  nombre: 'ABR' },
  { num: 5,  nombre: 'MAY' }, { num: 6,  nombre: 'JUN' },
  { num: 7,  nombre: 'JUL' }, { num: 8,  nombre: 'AGO' },
  { num: 9,  nombre: 'SEP' }, { num: 10, nombre: 'OCT' },
  { num: 11, nombre: 'NOV' }, { num: 12, nombre: 'DIC' }
]

const getTituloReporte = (tipo) => {
  const titulos = {
    cumplimiento: 'Reporte de Cumplimiento',
    mantenimientos: 'Reporte de Mantenimientos',
    solicitudes: 'Reporte de Solicitudes R-275',
    equipos: 'Inventario de Equipos',
    'programa-anual': `R-25 Programa de Mantenimientos ${anioSeleccionado.value}`
  }
  return titulos[tipo] || 'Reporte'
}

// Normaliza una celda del pivot soportando ambos shapes:
// - nuevo: { programaciones: ['YYYY-MM-DD'], ejecuciones: [{fecha, ejecutor}] }
// - viejo: { programado: boolean, ejecuciones: ['YYYY-MM-DD'] }
const normalizarCelda = (celda) => {
  if (!celda) return { programado: false, fechasP: [], ejecuciones: [] }

  const programaciones = Array.isArray(celda.programaciones) ? celda.programaciones : []
  const programado = programaciones.length > 0 || celda.programado === true

  let ejecuciones = []
  if (Array.isArray(celda.ejecuciones)) {
    ejecuciones = celda.ejecuciones.map(e => {
      if (typeof e === 'string') return { fecha: e, ejecutor: '' }
      return { fecha: e.fecha, ejecutor: e.ejecutor || '' }
    }).filter(e => e.fecha)
  }

  return { programado, fechasP: programaciones, ejecuciones }
}

const formatProgramacionCorta = (celda) => {
  const n = normalizarCelda(celda)
  if (!n.programado) return ''
  if (n.fechasP.length === 0) return 'X'
  return n.fechasP.map(f => dayjs(f).format('DD/MM')).join(', ')
}

const formatEjecucionCorta = (celda) => {
  const n = normalizarCelda(celda)
  if (n.ejecuciones.length === 0) return ''
  return n.ejecuciones.map(e => dayjs(e.fecha).format('DD/MM')).join(', ')
}

const formatEjecutores = (celda) => {
  const n = normalizarCelda(celda)
  return n.ejecuciones.map(e => e.ejecutor).filter(Boolean).join(', ')
}

const tooltipEjecucion = (celda) => {
  const n = normalizarCelda(celda)
  if (n.ejecuciones.length === 0) return ''
  return n.ejecuciones.map(e => `${dayjs(e.fecha).format('DD/MM/YYYY')}${e.ejecutor ? ' - ' + e.ejecutor : ''}`).join('\n')
}

const celdaProgramada = (act, mesNum) => {
  return normalizarCelda(act.meses?.[mesNum]).programado
}

const celdaEjecutada = (act, mesNum) => {
  return normalizarCelda(act.meses?.[mesNum]).ejecuciones.length > 0
}

const seleccionarReporte = async (tipo) => {
  reporteSeleccionado.value = tipo
  await generarReporte()
}

const generarReporte = async () => {
  if (!reporteSeleccionado.value) return

  if (reporteSeleccionado.value === 'programa-anual') {
    const resp = await reportesStore.generarReporteProgramaAnual({
      anio: anioSeleccionado.value,
      sede_id: filtros.value.sede_id,
      categoria_id: categoriaSeleccionada.value
    })
    const grupos = Array.isArray(resp?.data) ? [...resp.data] : []
    // "Equipos de Computo" al final de la lista
    const esEquiposComputo = (g) => (g.categoria || '').toLowerCase().includes('equipos de computo') ||
                                     (g.categoria || '').toLowerCase().includes('equipos de cómputo')
    grupos.sort((a, b) => {
      const ae = esEquiposComputo(a) ? 1 : 0
      const be = esEquiposComputo(b) ? 1 : 0
      if (ae !== be) return ae - be
      return (a.categoria || '').localeCompare(b.categoria || '', 'es')
    })
    programaAnualData.value = grupos
    // Para que la UI muestre el conteo y habilite exportar, poblamos datosReporte
    const totalActividades = programaAnualData.value.reduce((acc, g) => acc + (g.actividades?.length || 0), 0)
    datosReporte.value = totalActividades > 0 ? new Array(totalActividades).fill({}) : []
    return
  }

  const metodos = {
    cumplimiento: reportesStore.generarReporteCumplimiento,
    mantenimientos: reportesStore.generarReporteMantenimientos,
    solicitudes: reportesStore.generarReporteSolicitudes,
    equipos: reportesStore.generarReporteEquipos
  }

  const data = await metodos[reporteSeleccionado.value](filtros.value)
  datosReporte.value = Array.isArray(data) ? data : []
}

const aplicarFiltros = () => {
  if (reporteSeleccionado.value) {
    generarReporte()
  }
}

const exportarExcel = () => {
  if (!datosReporte.value || datosReporte.value.length === 0) return

  if (reporteSeleccionado.value === 'programa-anual') {
    exportarProgramaAnualExcel()
    return
  }

  const ws = XLSX.utils.json_to_sheet(prepararDatosParaExcel())
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, getTituloReporte(reporteSeleccionado.value))

  const filename = `${reporteSeleccionado.value}_${dayjs().format('YYYY-MM-DD')}.xlsx`
  XLSX.writeFile(wb, filename)
}

const exportarProgramaAnualExcel = () => {
  const anio = anioSeleccionado.value
  const aoa = []
  const FIJAS = 7 // Trabajo, Equipo, Sede, Responsable, Periodicidad, Tipo, Reg

  // Fila 1: título fusionado
  aoa.push([`PROGRAMA DE MANTENIMIENTOS - ${anio}`])
  aoa.push([])

  // Headers (2 filas: mes agrupado + P/E)
  const headerRow1 = ['Trabajo a Realizar', 'Equipo', 'Sede(s)', 'Responsable', 'Periodicidad', 'Tipo de Mto', 'Registro']
  for (const m of meses) { headerRow1.push(m.nombre, '') }
  const headerRow2 = Array(FIJAS).fill('')
  for (let i = 0; i < 12; i++) headerRow2.push('P', 'E')
  aoa.push(headerRow1)
  aoa.push(headerRow2)

  // Datos agrupados
  for (const grupo of programaAnualData.value) {
    aoa.push([String(grupo.categoria).toUpperCase()])
    for (const act of grupo.actividades) {
      const row = [
        act.trabajo_a_realizar,
        act.equipo,
        act.sede_codigo || act.sede_nombre,
        act.responsable,
        act.periodicidad,
        act.tipo_mantenimiento,
        act.registro
      ]
      for (const m of meses) {
        const n = normalizarCelda(act.meses?.[m.num])
        const p = n.fechasP.length > 0
          ? n.fechasP.map(f => dayjs(f).format('DD/MM/YYYY')).join(', ')
          : (n.programado ? 'X' : '')
        const e = n.ejecuciones.map(ej => {
          const fecha = dayjs(ej.fecha).format('DD/MM/YYYY')
          return ej.ejecutor ? `${fecha} (${ej.ejecutor})` : fecha
        }).join(', ')
        row.push(p)
        row.push(e)
      }
      aoa.push(row)
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa)

  // Fusiones: título fila 0 + headers de meses fila 2
  const totalCols = FIJAS + 24
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }
  ]
  for (let i = 0; i < 12; i++) {
    const colStart = FIJAS + i * 2
    ws['!merges'].push({ s: { r: 2, c: colStart }, e: { r: 2, c: colStart + 1 } })
  }

  // Anchos aproximados: 7 fijas + 24 de meses
  ws['!cols'] = [
    { wch: 45 }, { wch: 25 }, { wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 18 }, { wch: 8 }
  ]
  for (let i = 0; i < 24; i++) ws['!cols'].push({ wch: 22 })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `R-25 ${anio}`)
  XLSX.writeFile(wb, `R-25_Programa_Mantenimientos_${anio}.xlsx`)
}

const exportarPDF = () => {
  if (!datosReporte.value || datosReporte.value.length === 0) return
  if (reporteSeleccionado.value === 'programa-anual') {
    toast.info('Para el R-25 usá "Exportar a Excel" (el cronograma es demasiado ancho para PDF).')
    return
  }

  const doc = new jsPDF()
  
  // Título
  doc.setFontSize(18)
  doc.text(getTituloReporte(reporteSeleccionado.value), 14, 20)
  
  // Fecha del reporte
  doc.setFontSize(10)
  doc.text(`Generado el: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 14, 28)
  
  // Tabla
  const columns = obtenerColumnasTabla()
  const rows = prepararDatosParaPDF()
  
  doc.autoTable({
    startY: 35,
    head: [columns],
    body: rows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 135, 92] }
  })
  
  const filename = `${reporteSeleccionado.value}_${dayjs().format('YYYY-MM-DD')}.pdf`
  doc.save(filename)
}

const prepararDatosParaExcel = () => {
  // Implementar según el tipo de reporte
  return datosReporte.value
}

const obtenerColumnasTabla = () => {
  const columnas = {
    cumplimiento: ['Sede', 'Programados', 'Ejecutados', 'Cumplimiento'],
    mantenimientos: ['Actividad', 'Sede', 'Fecha', 'Estado', 'Prioridad'],
    solicitudes: ['ID', 'Solicitante', 'Descripción', 'Sede', 'Estado'],
    equipos: ['Código', 'Nombre', 'Sede', 'Categoría', 'Estado']
  }
  return columnas[reporteSeleccionado.value] || []
}

const prepararDatosParaPDF = () => {
  // Implementar según el tipo de reporte
  return datosReporte.value.map(item => Object.values(item))
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY')
}

const getCumplimientoColor = (cumplimiento) => {
  if (cumplimiento >= 90) return 'text-green-600'
  if (cumplimiento >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const getCumplimientoBarColor = (cumplimiento) => {
  if (cumplimiento >= 90) return 'bg-green-500'
  if (cumplimiento >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getEstadoColor = (estado) => {
  const colors = {
    'Programado': 'blue',
    'En Proceso': 'orange',
    'Ejecutado': 'green',
    'Atrasado': 'red',
    'Pendiente': 'yellow',
    'Aprobada': 'green',
    'Cerrada': 'gray'
  }
  return colors[estado] || 'gray'
}

const getPrioridadColor = (prioridad) => {
  const colors = {
    baja: 'green',
    media: 'yellow',
    alta: 'orange',
    critica: 'red'
  }
  return colors[prioridad?.toLowerCase()] || 'gray'
}

const getEstadoEquipoColor = (estado) => {
  const colors = {
    operativo: 'green',
    en_mantenimiento: 'orange',
    fuera_servicio: 'red',
    dado_baja: 'gray'
  }
  return colors[estado] || 'gray'
}

const formatEstadoEquipo = (estado) => {
  const estados = {
    operativo: 'Operativo',
    en_mantenimiento: 'En Mantenimiento',
    fuera_servicio: 'Fuera de Servicio',
    dado_baja: 'Dado de Baja'
  }
  return estados[estado] || estado
}

const loadSedes = async () => {
  try {
    const response = await api.get('/sedes')
    sedes.value = Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Error al cargar sedes:', error)
  }
}

const loadCategorias = async () => {
  try {
    const response = await api.get('/categorias-mantenimiento')
    categorias.value = Array.isArray(response?.data) ? response.data
      : Array.isArray(response) ? response
      : []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

onMounted(() => {
  loadSedes()
  loadCategorias()
})
</script>