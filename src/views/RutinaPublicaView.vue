<!-- src/views/RutinaPublicaView.vue
     Página pública sin login. El técnico accede por QR para registrar
     la pre-ejecución de un mantenimiento. -->
<template>
  <div class="min-h-screen bg-gray-50 pb-10">
    <header class="bg-primary-600 text-white px-4 py-3 shadow-sm">
      <h1 class="text-lg font-semibold">Mantix · Registro de mantenimiento</h1>
    </header>

    <main class="max-w-xl mx-auto px-4 pt-4 space-y-4">
      <div v-if="loading" class="text-center py-10 text-gray-500">
        <svg class="mx-auto animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="mt-2">Buscando mantenimiento...</p>
      </div>

      <div v-else-if="errorMensaje" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p class="font-medium">{{ errorMensaje }}</p>
      </div>

      <div v-else-if="rutina?.ya_registrada" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="font-semibold text-yellow-900 mb-1">Este mantenimiento ya tiene un registro</p>
        <p class="text-sm text-yellow-800">
          Estado: <strong>{{ labelEstado(rutina.estado_pre_ejecucion) }}</strong>. Contactá al coordinador si necesitás corregir algo.
        </p>
      </div>

      <div v-else-if="exitoRegistrado" class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <p class="font-semibold text-green-900 mb-1">Registro enviado</p>
        <p class="text-sm text-green-800">
          Queda pendiente de aprobación del coordinador. Ya podés cerrar esta página.
        </p>
      </div>

      <template v-else-if="rutina?.mantenimiento">
        <section class="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ rutina.mantenimiento.codigo }}</span>
            <span class="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">
              {{ rutina.mantenimiento.categoria || 'Mantenimiento' }}
            </span>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 leading-snug">
            {{ rutina.mantenimiento.nombre_actividad || 'Mantenimiento programado' }}
          </h2>
          <div v-if="rutina.mantenimiento.equipo" class="pt-2 border-t border-gray-100">
            <p class="text-sm text-gray-600">Equipo</p>
            <p class="text-sm font-medium text-gray-900">
              {{ rutina.mantenimiento.equipo.nombre }}
              <span v-if="rutina.mantenimiento.equipo.codigo" class="text-gray-500">· {{ rutina.mantenimiento.equipo.codigo }}</span>
            </p>
            <p v-if="rutina.mantenimiento.equipo.ubicacion" class="text-xs text-gray-500">
              📍 {{ rutina.mantenimiento.equipo.ubicacion }}
            </p>
          </div>
          <div v-if="rutina.mantenimiento.sede" class="text-sm">
            <span class="text-gray-600">Sede: </span>
            <span class="font-medium text-gray-900">{{ rutina.mantenimiento.sede.nombre || rutina.mantenimiento.sede.codigo }}</span>
          </div>
          <div v-if="rutina.mantenimiento.proveedor" class="text-sm">
            <span class="text-gray-600">Proveedor asignado: </span>
            <span class="font-medium text-gray-900">{{ rutina.mantenimiento.proveedor }}</span>
          </div>
          <div class="text-xs text-gray-500">
            Programado: {{ formatearFecha(rutina.mantenimiento.fecha_programada) }}
          </div>
        </section>

        <form @submit.prevent="enviar" class="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 class="text-sm font-semibold text-gray-900">Datos de la ejecución</h3>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Hora de inicio</label>
            <input v-model="form.hora_inicio" type="time" class="input-field" />
            <p class="text-xs text-gray-500 mt-1">La hora de fin se registra automáticamente al enviar.</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Nombre del técnico <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nombre_recibe"
              type="text"
              required
              maxlength="150"
              placeholder="Nombre y apellido"
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Cédula (opcional)</label>
            <input v-model="form.cedula_recibe" type="text" maxlength="30" class="input-field" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Trabajo realizado <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.trabajo_realizado"
              required
              rows="4"
              maxlength="5000"
              placeholder="Describí qué se hizo"
              class="input-field resize-y"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
            <textarea
              v-model="form.observaciones"
              rows="2"
              maxlength="2000"
              class="input-field resize-y"
            ></textarea>
          </div>

          <!-- Fotos evidencia -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Fotos de evidencia (opcional, máx. 10)</label>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              @change="onFilesSelect"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 hover:border-primary-400 hover:bg-gray-50"
            >
              📷 Tomar o seleccionar fotos
            </button>
            <div v-if="archivos.length > 0" class="mt-2 grid grid-cols-3 gap-2">
              <div v-for="(a, i) in archivos" :key="i" class="relative">
                <img :src="a.preview" class="w-full h-20 object-cover rounded border border-gray-200" />
                <button
                  type="button"
                  @click="archivos.splice(i, 1)"
                  class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >×</button>
              </div>
            </div>
          </div>

          <!-- Firma -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Firma del técnico <span class="text-red-500">*</span>
            </label>
            <div class="border border-gray-300 rounded-lg bg-gray-50 relative overflow-hidden">
              <canvas
                ref="firmaCanvas"
                class="w-full"
                style="height: 160px; touch-action: none"
              ></canvas>
              <button
                v-if="firmaDirty"
                type="button"
                @click="limpiarFirma"
                class="absolute top-2 right-2 text-xs text-red-600 hover:text-red-700 bg-white rounded px-2 py-0.5 shadow-sm"
              >Borrar</button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Firmá con el dedo sobre el recuadro.</p>
          </div>

          <button
            type="submit"
            :disabled="enviando"
            class="w-full btn-primary justify-center py-3"
          >
            <svg v-if="enviando" class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ enviando ? (progresoMsg || 'Enviando...') : 'Enviar registro' }}
          </button>

          <p class="text-xs text-gray-500 text-center">
            Queda pendiente de aprobación del coordinador.
          </p>
        </form>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import SignaturePad from 'signature_pad'

const route = useRoute()
const token = route.params.token

const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

const loading = ref(true)
const rutina = ref(null)
const errorMensaje = ref('')
const exitoRegistrado = ref(false)
const enviando = ref(false)
const progresoMsg = ref('')

const archivos = ref([]) // {file, preview, nombre, base64, mime_type}
const firmaCanvas = ref(null)
const firmaDirty = ref(false)
let signaturePad = null

const form = ref({
  hora_inicio: '',
  nombre_recibe: '',
  cedula_recibe: '',
  trabajo_realizado: '',
  observaciones: ''
})

const cargar = async () => {
  loading.value = true
  errorMensaje.value = ''
  try {
    const resp = await axios.get(`${apiBase}/public/rutina/${token}`)
    rutina.value = resp.data?.data || null
  } catch (e) {
    const status = e.response?.status
    const msg = e.response?.data?.message
    if (status === 404) errorMensaje.value = 'Rutina no encontrada o QR inválido.'
    else if (status === 410) errorMensaje.value = msg || 'Este QR está vencido.'
    else if (status === 400) errorMensaje.value = msg || 'Token inválido.'
    else errorMensaje.value = 'No se pudo cargar. Revisá la conexión y reintentá.'
  } finally {
    loading.value = false
  }
}

// --- Firma ---
const inicializarFirma = () => {
  if (!firmaCanvas.value) return
  const canvas = firmaCanvas.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d').scale(ratio, ratio)
  signaturePad = new SignaturePad(canvas, {
    minWidth: 1,
    maxWidth: 2.5,
    penColor: 'rgb(30, 41, 59)',
    backgroundColor: 'rgb(249, 250, 251)'
  })
  signaturePad.addEventListener('endStroke', () => {
    firmaDirty.value = !signaturePad.isEmpty()
  })
}

const limpiarFirma = () => {
  signaturePad?.clear()
  firmaDirty.value = false
}

watch(rutina, async (val) => {
  if (val?.mantenimiento && !val.ya_registrada) {
    await nextTick()
    inicializarFirma()
  }
})

// --- Archivos ---
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const r = reader.result
    resolve(typeof r === 'string' ? r.split(',')[1] : '')
  }
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const onFilesSelect = async (e) => {
  const files = Array.from(e.target.files || [])
  for (const f of files) {
    if (f.size > 10 * 1024 * 1024) {
      alert(`"${f.name}" excede 10 MB y fue omitido`)
      continue
    }
    if (archivos.value.length >= 10) {
      alert('Máximo 10 fotos')
      break
    }
    archivos.value.push({
      file: f,
      nombre: f.name,
      mime_type: f.type || 'image/jpeg',
      preview: URL.createObjectURL(f)
    })
  }
  e.target.value = ''
}

const enviar = async () => {
  if (!firmaDirty.value || signaturePad?.isEmpty()) {
    alert('Por favor firmá antes de enviar.')
    return
  }
  enviando.value = true
  progresoMsg.value = archivos.value.length > 0 ? 'Subiendo fotos...' : 'Enviando...'

  try {
    // Preparar archivos en base64
    const archivosBase64 = []
    for (const a of archivos.value) {
      archivosBase64.push({
        nombre: a.nombre,
        base64: await fileToBase64(a.file),
        mime_type: a.mime_type
      })
    }

    const firmaDataUrl = signaturePad.toDataURL('image/png')

    await axios.post(`${apiBase}/public/rutina/${token}`, {
      hora_inicio: form.value.hora_inicio || null,
      nombre_recibe: form.value.nombre_recibe.trim(),
      cedula_recibe: form.value.cedula_recibe.trim() || null,
      trabajo_realizado: form.value.trabajo_realizado.trim(),
      observaciones: form.value.observaciones.trim() || null,
      firma_tecnico: firmaDataUrl,
      archivos: archivosBase64
    }, { timeout: 180000 })
    exitoRegistrado.value = true
  } catch (e) {
    const msg = e.response?.data?.message || 'No se pudo enviar. Intentá de nuevo.'
    alert(msg)
  } finally {
    enviando.value = false
    progresoMsg.value = ''
  }
}

const labelEstado = (estado) => ({
  pendiente: 'Pendiente de aprobar',
  aprobada: 'Aprobado',
  rechazada: 'Rechazado'
})[estado] || estado

const formatearFecha = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(cargar)
</script>
