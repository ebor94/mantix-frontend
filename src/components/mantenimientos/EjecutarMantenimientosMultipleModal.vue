<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Ejecutar Mantenimientos</h2>
          <p class="text-sm text-gray-500 mt-1">
            Los datos de cierre se aplicarán a los
            <strong>{{ items.length }}</strong> mantenimientos seleccionados.
          </p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Panel de éxito (post-cierre con link Drive) -->
      <div v-if="jornadaResult" class="p-6 space-y-4">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ jornadaResult.count }} mantenimiento{{ jornadaResult.count > 1 ? 's' : '' }} ejecutado{{ jornadaResult.count > 1 ? 's' : '' }}
            </h3>
            <p class="text-sm text-gray-500">Los cierres quedaron guardados en mantix.</p>
          </div>
        </div>

        <div v-if="jornadaResult.drive_jornada_url"
             class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-center space-x-3">
            <svg class="h-8 w-8 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.75 5.25a.75.75 0 00-1.5 0v3.75H7.5a.75.75 0 000 1.5h3.75v3.75a.75.75 0 001.5 0v-3.75h3.75a.75.75 0 000-1.5h-3.75V5.25z"/>
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-blue-900">Carpeta de evidencias creada en Drive</p>
              <p class="text-xs text-blue-700 mt-0.5 truncate">
                Subí ahí el informe PDF, fotos y checklists de la jornada.
              </p>
            </div>
          </div>
          <a
            :href="jornadaResult.drive_jornada_url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Abrir carpeta en Drive
            <svg class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div v-else class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          No se pudo crear la carpeta en Drive automáticamente. Podés subir las evidencias manualmente o reintentar más tarde.
        </div>

        <div class="flex justify-end">
          <button @click="finalizar" class="btn-primary">Listo</button>
        </div>
      </div>

      <!-- Body -->
      <form v-if="!jornadaResult" @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Resumen de seleccionados -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mantenimientos a cerrar
          </label>
          <div class="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-64 overflow-y-auto">
            <div
              v-for="m in items"
              :key="m.id"
              class="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ m.actividad?.nombre || `Mantenimiento #${m.id}` }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ m.actividad?.sede?.nombre || 'Sin sede' }}
                  · {{ m.actividad?.equipo?.nombre || 'Sin equipo' }}
                  · Programado: {{ formatDate(m.fecha_programada) }}
                </p>
              </div>
              <button
                type="button"
                @click="quitar(m.id)"
                :disabled="items.length <= 1"
                class="ml-3 text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Quitar de la selección"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Fecha y horas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Ejecución <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fecha_ejecucion"
              type="date"
              required
              class="input-field"
              :class="{ 'border-yellow-500 focus:ring-yellow-500': mostrarAdvertenciaFecha }"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hora Inicio <span class="text-red-500">*</span>
            </label>
            <input v-model="form.hora_inicio" type="time" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hora Fin <span class="text-red-500">*</span>
            </label>
            <input v-model="form.hora_fin" type="time" required class="input-field" />
          </div>
        </div>

        <!-- Alerta fecha anticipada -->
        <div
          v-if="mostrarAdvertenciaFecha"
          class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-medium text-yellow-800">Ejecución anticipada</h3>
              <p class="mt-1 text-sm text-yellow-700">
                Al menos un mantenimiento tiene fecha programada posterior a
                <strong>{{ formatDate(form.fecha_ejecucion) }}</strong>.
              </p>
              <div class="mt-3">
                <label class="flex items-start cursor-pointer">
                  <input
                    v-model="form.confirmar_fecha_anticipada"
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-yellow-700">
                    Confirmo que se ejecutaron antes de lo programado y acepto registrar esta fecha
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Responsable / Costo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ejecutado por <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.ejecutado_por"
              type="text"
              required
              placeholder="Nombre del técnico o responsable"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Costo Real (total o por mantenimiento)
            </label>
            <input
              v-model.number="form.costo_real"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              class="input-field"
            />
          </div>
        </div>

        <!-- Trabajo realizado -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Trabajo realizado <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.trabajo_realizado"
            rows="3"
            required
            placeholder="Describe el trabajo realizado en estos mantenimientos..."
            class="input-field resize-none"
          ></textarea>
        </div>

        <!-- Observaciones -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
          <textarea
            v-model="form.observaciones"
            rows="3"
            placeholder="Notas, hallazgos, recomendaciones..."
            class="input-field resize-none"
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end space-x-3 pt-6 border-t">
          <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
          <button
            type="submit"
            :disabled="loading || !puedeGuardar"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ loading ? 'Guardando...' : `Registrar ${items.length} ejecuciones` }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMantenimientosStore } from '@/stores/mantenimientos'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'

const props = defineProps({
  mantenimientos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const mantenimientosStore = useMantenimientosStore()
const toast = useToast()
const loading = ref(false)
const jornadaResult = ref(null) // { count, drive_jornada_url }

const items = ref([...props.mantenimientos])

const form = ref({
  fecha_ejecucion: dayjs().format('YYYY-MM-DD'),
  hora_inicio: dayjs().format('HH:mm'),
  hora_fin: dayjs().add(1, 'hour').format('HH:mm'),
  ejecutado_por: '',
  costo_real: 0,
  trabajo_realizado: '',
  observaciones: '',
  confirmar_fecha_anticipada: false
})

const mostrarAdvertenciaFecha = computed(() => {
  if (!form.value.fecha_ejecucion) return false
  const fechaEjecucion = dayjs(form.value.fecha_ejecucion)
  return items.value.some(m =>
    m.fecha_programada && fechaEjecucion.isBefore(dayjs(m.fecha_programada), 'day')
  )
})

const puedeGuardar = computed(() => {
  if (items.value.length === 0) return false
  if (mostrarAdvertenciaFecha.value && !form.value.confirmar_fecha_anticipada) return false
  return true
})

const formatDate = (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '-')

const quitar = (id) => {
  if (items.value.length <= 1) return
  items.value = items.value.filter(m => m.id !== id)
}

const handleSubmit = async () => {
  if (items.value.length === 0) {
    toast.warning('No hay mantenimientos seleccionados')
    return
  }
  if (mostrarAdvertenciaFecha.value && !form.value.confirmar_fecha_anticipada) {
    toast.warning('Debes confirmar la ejecución anticipada')
    return
  }

  loading.value = true
  try {
    const payload = {
      fecha_ejecucion: form.value.fecha_ejecucion,
      hora_inicio: form.value.hora_inicio,
      hora_fin: form.value.hora_fin,
      trabajo_realizado: form.value.trabajo_realizado,
      observaciones: form.value.observaciones,
      costo_real: parseFloat(form.value.costo_real) || 0,
      nombre_recibe: form.value.ejecutado_por
    }

    const data = await mantenimientosStore.ejecutarMantenimientosMultiple(
      items.value.map(m => m.id),
      payload
    )

    // El backend devuelve el array de ejecuciones. Tomo la URL de Drive de la primera.
    const first = Array.isArray(data) ? data[0] : null
    jornadaResult.value = {
      count: items.value.length,
      drive_jornada_url: first?.drive_jornada_url || null
    }

    // Avisamos al padre para que refresque listas (sin cerrar el modal)
    emit('success')
  } catch (error) {
    console.error('Error al ejecutar mantenimientos múltiples:', error)
  } finally {
    loading.value = false
  }
}

const finalizar = () => {
  jornadaResult.value = null
  emit('close')
}
</script>
