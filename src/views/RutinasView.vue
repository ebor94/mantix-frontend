<!-- src/views/RutinasView.vue -->
<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Rutinas de ejecución</h1>
          <p class="text-sm text-gray-500">Pre-ejecuciones registradas vía QR por los técnicos.</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card">
        <div class="flex items-end flex-wrap gap-3">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Desde</label>
            <input v-model="filtros.desde" type="date" class="input-field" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Hasta</label>
            <input v-model="filtros.hasta" type="date" class="input-field" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Categoría</label>
            <select v-model="filtros.categoria_id" class="input-field">
              <option value="">Todas</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
          </div>
          <button @click="recargar" class="btn-secondary">Aplicar</button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activo = tab.key"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activo === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span v-if="tab.badge !== undefined" class="ml-2 text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
              {{ tab.badge }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab: Pre-aprobadas (pendientes de aprobación del coordinador) -->
      <div v-if="activo === 'pendientes_aprobar'">
        <div v-if="loading" class="text-center py-10 text-gray-500">Cargando...</div>
        <div v-else-if="pendientesAprobar.length === 0" class="card text-center text-gray-500 py-10">
          No hay pre-ejecuciones pendientes de aprobación.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="p in pendientesAprobar"
            :key="p.id"
            class="card hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between flex-wrap gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-xs text-gray-500">{{ p.mantenimiento?.codigo }}</span>
                  <span class="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                    {{ p.estado }}
                  </span>
                </div>
                <h3 class="text-base font-semibold text-gray-900 truncate">
                  {{ p.mantenimiento?.nombre_actividad }}
                </h3>
                <div class="mt-1 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <div>
                    <span class="text-gray-500">Equipo:</span>
                    <span class="font-medium text-gray-900">
                      {{ p.mantenimiento?.equipo?.nombre || '—' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500">Sede:</span>
                    <span class="font-medium text-gray-900">
                      {{ p.mantenimiento?.sede?.codigo || '—' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500">Ejecutado el:</span>
                    <span class="text-gray-900">{{ formatearFecha(p.fecha_ejecucion) }} {{ p.hora_inicio || '' }}{{ p.hora_fin ? ' - ' + p.hora_fin : '' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Técnico:</span>
                    <span class="text-gray-900">{{ p.nombre_recibe }}</span>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-700 line-clamp-3">
                  <strong class="text-gray-900">Trabajo:</strong> {{ p.trabajo_realizado }}
                </p>
                <p v-if="p.observaciones" class="mt-1 text-sm text-gray-600 line-clamp-2">
                  <strong class="text-gray-800">Obs.:</strong> {{ p.observaciones }}
                </p>

                <!-- Evidencia (fotos + firma) -->
                <div v-if="tieneEvidencia(p)" class="mt-3 pt-3 border-t border-gray-100 flex items-start flex-wrap gap-4">
                  <div v-if="p.fotos_urls?.archivos?.length" class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-600 mb-1">
                      Fotos adjuntas ({{ p.fotos_urls.archivos.length }})
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <a
                        v-for="(f, i) in p.fotos_urls.archivos"
                        :key="i"
                        :href="f.url"
                        target="_blank" rel="noopener noreferrer"
                        class="inline-flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded"
                      >
                        <span>📎 {{ f.nombre }}</span>
                      </a>
                    </div>
                    <a
                      v-if="p.fotos_urls.drive_jornada_url"
                      :href="p.fotos_urls.drive_jornada_url"
                      target="_blank" rel="noopener noreferrer"
                      class="inline-block mt-1 text-xs text-gray-500 hover:text-gray-700 underline"
                    >Abrir carpeta en Drive</a>
                  </div>
                  <div v-if="p.firma_tecnico">
                    <p class="text-xs font-medium text-gray-600 mb-1">Firma</p>
                    <img
                      :src="p.firma_tecnico"
                      alt="Firma"
                      class="h-16 border border-gray-200 rounded bg-white cursor-pointer"
                      @click="firmaZoom = p.firma_tecnico"
                    />
                  </div>
                </div>
              </div>

              <div class="flex flex-col space-y-2 w-full sm:w-auto">
                <button
                  @click="aprobarItem(p)"
                  :disabled="procesando === p.id"
                  class="btn-primary text-sm"
                >
                  {{ procesando === p.id ? '...' : 'Aprobar' }}
                </button>
                <button
                  @click="abrirRechazo(p)"
                  class="btn-secondary text-sm"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Pendientes de pre-aprobar (MNT programados sin pre-ejecución) -->
      <div v-else-if="activo === 'sin_preejec'">
        <div v-if="loading" class="text-center py-10 text-gray-500">Cargando...</div>
        <div v-else-if="pendientes.length === 0" class="card text-center text-gray-500 py-10">
          No hay mantenimientos programados pendientes.
        </div>
        <div v-else class="card overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-gray-500 uppercase">
                <th class="py-2 pr-4">Código</th>
                <th class="py-2 pr-4">Fecha</th>
                <th class="py-2 pr-4">Equipo</th>
                <th class="py-2 pr-4">Sede</th>
                <th class="py-2 pr-4">Categoría</th>
                <th class="py-2 pr-4">QR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in pendientes" :key="m.id" class="border-t border-gray-100">
                <td class="py-2 pr-4 text-xs text-gray-500">{{ m.codigo }}</td>
                <td class="py-2 pr-4">{{ formatearFecha(m.fecha_programada) }}</td>
                <td class="py-2 pr-4">{{ m.equipo?.nombre || '—' }}</td>
                <td class="py-2 pr-4">{{ m.sede?.codigo || '—' }}</td>
                <td class="py-2 pr-4">{{ m.categoria || '—' }}</td>
                <td class="py-2 pr-4">
                  <button
                    @click="verQR(m)"
                    class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver QR
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Historial (todas) -->
      <div v-else-if="activo === 'historial'">
        <div v-if="loading" class="text-center py-10 text-gray-500">Cargando...</div>
        <div v-else class="card overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-gray-500 uppercase">
                <th class="py-2 pr-4">MNT</th>
                <th class="py-2 pr-4">Fecha</th>
                <th class="py-2 pr-4">Técnico</th>
                <th class="py-2 pr-4">Estado</th>
                <th class="py-2 pr-4">Aprobado por</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in preEjecuciones" :key="p.id" class="border-t border-gray-100">
                <td class="py-2 pr-4 text-xs text-gray-500">{{ p.mantenimiento?.codigo }}</td>
                <td class="py-2 pr-4">{{ formatearFecha(p.fecha_ejecucion) }}</td>
                <td class="py-2 pr-4">{{ p.nombre_recibe }}</td>
                <td class="py-2 pr-4">
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': p.estado === 'pendiente',
                      'bg-green-100 text-green-800': p.estado === 'aprobada',
                      'bg-red-100 text-red-800': p.estado === 'rechazada'
                    }"
                  >
                    {{ p.estado }}
                  </span>
                </td>
                <td class="py-2 pr-4 text-xs text-gray-600">{{ p.aprobador || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal QR -->
    <div v-if="qrModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="qrModal = null">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ qrModal.codigo }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ qrModal.nombre_actividad }}</p>
        <div v-if="qrModal.qrDataUrl" class="flex justify-center mb-4">
          <img :src="qrModal.qrDataUrl" alt="QR" class="w-64 h-64" />
        </div>
        <div v-else class="py-6 text-sm text-gray-500">Generando QR...</div>
        <p class="text-xs text-gray-500 break-all mb-4">{{ qrModal.url_publica }}</p>
        <div class="flex justify-end space-x-2">
          <button @click="qrModal = null" class="btn-secondary text-sm">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal zoom firma -->
    <div v-if="firmaZoom" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" @click.self="firmaZoom = null">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Firma del técnico</h3>
        <img :src="firmaZoom" alt="Firma ampliada" class="w-full border border-gray-200 rounded bg-gray-50" />
        <button @click="firmaZoom = null" class="mt-4 btn-secondary text-sm">Cerrar</button>
      </div>
    </div>

    <!-- Modal rechazar -->
    <div v-if="rechazoItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="rechazoItem = null">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-1">Rechazar pre-ejecución</h3>
        <p class="text-sm text-gray-500 mb-3">{{ rechazoItem.mantenimiento?.codigo }}</p>
        <textarea
          v-model="motivoRechazo"
          rows="3"
          placeholder="Motivo del rechazo (opcional)"
          class="input-field resize-y"
        ></textarea>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="rechazoItem = null" class="btn-secondary text-sm">Cancelar</button>
          <button @click="confirmarRechazo" class="btn-primary bg-red-600 hover:bg-red-700 text-sm">
            Rechazar
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRutinasStore } from '@/stores/rutinas'
import MainLayout from '@/components/common/MainLayout.vue'
import api from '@/services/api'
import QRCode from 'qrcode'

const store = useRutinasStore()
const { preEjecuciones, pendientes, loading } = storeToRefs(store)

const activo = ref('pendientes_aprobar')
const procesando = ref(null)
const qrModal = ref(null)
const rechazoItem = ref(null)
const motivoRechazo = ref('')
const firmaZoom = ref(null)

const tieneEvidencia = (p) =>
  !!(p.firma_tecnico || (p.fotos_urls?.archivos && p.fotos_urls.archivos.length > 0))

const filtros = ref({ desde: '', hasta: '', categoria_id: '' })
const categorias = ref([])

const cargarCategorias = async () => {
  try {
    const resp = await api.get('/categorias-mantenimiento?activo=true')
    categorias.value = Array.isArray(resp?.data) ? resp.data : (resp?.data?.data || [])
  } catch (e) {
    console.error('Error cargando categorías:', e)
  }
}

const pendientesAprobar = computed(() =>
  preEjecuciones.value.filter(p => p.estado === 'pendiente')
)

const tabs = computed(() => [
  { key: 'pendientes_aprobar', label: 'Pre-aprobadas (listas para aprobar)', badge: pendientesAprobar.value.length },
  { key: 'sin_preejec', label: 'Programados sin registro', badge: pendientes.value.length },
  { key: 'historial', label: 'Historial', badge: preEjecuciones.value.length }
])

const recargar = async () => {
  // Limpiamos campos vacíos del payload de filtros para no enviar strings ""
  const params = Object.fromEntries(
    Object.entries(filtros.value).filter(([_, v]) => v !== '' && v != null)
  )
  await Promise.all([
    store.fetchPreEjecuciones(params),
    store.fetchPendientes(params)
  ])
}

const aprobarItem = async (p) => {
  procesando.value = p.id
  try {
    await store.aprobar(p.id)
    await recargar()
  } finally {
    procesando.value = null
  }
}

const abrirRechazo = (p) => {
  rechazoItem.value = p
  motivoRechazo.value = ''
}

const confirmarRechazo = async () => {
  if (!rechazoItem.value) return
  await store.rechazar(rechazoItem.value.id, motivoRechazo.value)
  rechazoItem.value = null
  await recargar()
}

const verQR = async (m) => {
  qrModal.value = { ...m, qrDataUrl: null }
  // Si no hay token ya, lo pido al backend
  if (!m.token_qr) {
    const resp = await store.generarToken(m.id)
    if (resp?.token) {
      qrModal.value.token_qr = resp.token
      qrModal.value.url_publica = resp.url_publica
    }
  }
  // Siempre reconstruimos la URL en el frontend porque conoce el prefijo
  // de montaje de la app (import.meta.env.BASE_URL), que puede ser "/" o "/mantix/".
  const appBase = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
  const baseWeb = (window.location.origin || '').replace(/\/+$/, '') + appBase
  const url = `${baseWeb}/rutina/${qrModal.value.token_qr}`
  qrModal.value.url_publica = url
  try {
    qrModal.value.qrDataUrl = await QRCode.toDataURL(url, { width: 256, margin: 1 })
  } catch (e) {
    console.error('Error QR:', e)
  }
}

const formatearFecha = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(async () => {
  // Default: último mes
  const hoy = new Date()
  const hace30 = new Date(hoy)
  hace30.setDate(hace30.getDate() - 30)
  filtros.value.desde = hace30.toISOString().slice(0, 10)
  filtros.value.hasta = hoy.toISOString().slice(0, 10)
  await cargarCategorias()
  await recargar()
})
</script>
