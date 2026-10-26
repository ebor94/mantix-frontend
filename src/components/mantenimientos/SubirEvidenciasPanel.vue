<!-- src/components/mantenimientos/SubirEvidenciasPanel.vue -->
<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
        </svg>
        <h3 class="text-sm font-semibold text-gray-900">Subir evidencias a Drive</h3>
      </div>
      <button
        v-if="!dragover && archivos.length === 0 && !uploading"
        type="button"
        @click="abrirSelector"
        class="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Agregar archivos
      </button>
    </div>

    <!-- Dropzone -->
    <div
      v-if="archivos.length === 0"
      @dragover.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      @drop.prevent="onDrop"
      @click="abrirSelector"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition',
        dragover ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
      ]"
    >
      <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="mt-2 text-sm text-gray-600">
        Arrastrá archivos aquí o <span class="text-indigo-600 font-medium">seleccionálos</span>
      </p>
      <p class="text-xs text-gray-500 mt-1">PDF, fotos (jpg/png/heic), hasta 25 MB cada uno</p>
    </div>

    <!-- Lista de archivos seleccionados -->
    <div v-else class="space-y-2">
      <div
        v-for="(a, i) in archivos"
        :key="i"
        class="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
      >
        <div class="flex items-center space-x-2 min-w-0 flex-1">
          <svg class="h-4 w-4 flex-shrink-0" :class="iconColor(a)" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
          </svg>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-900 truncate">{{ a.nombre }}</p>
            <p class="text-xs text-gray-500">{{ humanSize(a.size) }} · {{ a.subcarpeta }}</p>
          </div>
        </div>
        <select
          v-model="a.subcarpeta"
          :disabled="uploading"
          class="ml-2 text-xs border border-gray-300 rounded px-2 py-1"
        >
          <option value="00_INFORME_CONSOLIDADO">00 Informe consolidado</option>
          <option value="02_Evidencias_Fotograficas">02 Evidencias fotográficas</option>
          <option value="03_Checklists_Firmados">03 Checklists firmados</option>
          <option value="04_Actas_Firmas">04 Actas / Firmas</option>
        </select>
        <button
          @click="archivos.splice(i, 1)"
          :disabled="uploading"
          class="ml-2 text-gray-400 hover:text-red-600 disabled:opacity-30"
          title="Quitar"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="flex items-center justify-between pt-2">
        <button
          type="button"
          @click="abrirSelector"
          :disabled="uploading"
          class="text-xs text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
        >
          + Agregar más
        </button>
        <button
          type="button"
          @click="subir"
          :disabled="uploading || archivos.length === 0"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="uploading" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ uploading ? 'Subiendo...' : `Subir ${archivos.length} archivo${archivos.length === 1 ? '' : 's'}` }}
        </button>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      multiple
      accept=".pdf,image/*"
      class="hidden"
      @change="onFileSelect"
    />

    <!-- Resultado -->
    <div v-if="resultado" class="mt-3 p-3 bg-green-50 border border-green-200 rounded">
      <p class="text-sm font-medium text-green-900 mb-2">
        ✅ {{ resultado.cantidad }} archivo{{ resultado.cantidad === 1 ? '' : 's' }} subido{{ resultado.cantidad === 1 ? '' : 's' }}
      </p>
      <ul class="space-y-1">
        <li v-for="(f, i) in resultado.archivos" :key="i" class="text-xs flex items-center justify-between">
          <span class="text-green-800 truncate flex-1">{{ f.nombre }}</span>
          <a :href="f.url" target="_blank" rel="noopener noreferrer"
             class="ml-2 text-indigo-600 hover:text-indigo-700 flex-shrink-0">
            Abrir
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const props = defineProps({
  mantenimientoId: { type: [Number, String], required: true }
})

const toast = useToast()
const fileInput = ref(null)
const archivos = ref([])
const uploading = ref(false)
const dragover = ref(false)
const resultado = ref(null)

const abrirSelector = () => fileInput.value?.click()

const clasificar = (nombre, mime) => {
  const n = (nombre || '').toLowerCase()
  const m = (mime || '').toLowerCase()
  if (n.includes('acta') || n.includes('firma')) return '04_Actas_Firmas'
  if (n.includes('checklist') || n.includes('check') || n.includes('lista')) return '03_Checklists_Firmados'
  if (n.includes('informe') || n.includes('reporte')) return '00_INFORME_CONSOLIDADO'
  if (m.startsWith('image/') || /\.(jpg|jpeg|png|heic|webp|gif)$/i.test(n)) return '02_Evidencias_Fotograficas'
  if (m === 'application/pdf' || n.endsWith('.pdf')) return '00_INFORME_CONSOLIDADO'
  return '02_Evidencias_Fotograficas'
}

const addFiles = (fileList) => {
  const nuevos = []
  for (const f of Array.from(fileList)) {
    if (f.size > 25 * 1024 * 1024) {
      toast.error(`"${f.name}" excede 25 MB y fue omitido`)
      continue
    }
    nuevos.push({
      file: f,
      nombre: f.name,
      size: f.size,
      tipo: f.type,
      subcarpeta: clasificar(f.name, f.type)
    })
  }
  archivos.value.push(...nuevos)
}

const onFileSelect = (e) => {
  addFiles(e.target.files)
  e.target.value = ''
}

const onDrop = (e) => {
  dragover.value = false
  addFiles(e.dataTransfer.files)
}

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const r = reader.result
    const b64 = typeof r === 'string' ? r.split(',')[1] : ''
    resolve(b64)
  }
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const subir = async () => {
  if (archivos.value.length === 0) return
  uploading.value = true
  resultado.value = null
  try {
    const payload = {
      archivos: await Promise.all(archivos.value.map(async (a) => ({
        nombre: a.nombre,
        base64: await fileToBase64(a.file),
        mime_type: a.tipo || 'application/octet-stream',
        subcarpeta: a.subcarpeta
      })))
    }
    const resp = await api.post(`/mantenimientos/${props.mantenimientoId}/upload-evidencias`, payload)
    if (resp?.success) {
      resultado.value = resp.data
      archivos.value = []
      toast.success(`${resp.data.cantidad} archivo${resp.data.cantidad === 1 ? '' : 's'} subido${resp.data.cantidad === 1 ? '' : 's'} a Drive`)
    } else {
      toast.error(resp?.message || 'No se pudo subir')
    }
  } catch (e) {
    toast.error(e.response?.data?.message || e.message || 'Error subiendo')
  } finally {
    uploading.value = false
  }
}

const humanSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const iconColor = (a) => ({
  '00_INFORME_CONSOLIDADO': 'text-red-500',
  '02_Evidencias_Fotograficas': 'text-green-500',
  '03_Checklists_Firmados': 'text-blue-500',
  '04_Actas_Firmas': 'text-purple-500'
})[a.subcarpeta] || 'text-gray-500'
</script>
