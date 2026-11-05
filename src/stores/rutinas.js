// src/stores/rutinas.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

export const useRutinasStore = defineStore('rutinas', () => {
  const toast = useToast()

  const preEjecuciones = ref([])
  const pendientes = ref([])
  const loading = ref(false)

  const fetchPreEjecuciones = async (filtros = {}) => {
    loading.value = true
    try {
      const resp = await api.get('/rutinas/pre-ejecuciones', { params: filtros })
      preEjecuciones.value = Array.isArray(resp?.data) ? resp.data : []
      return preEjecuciones.value
    } catch (e) {
      console.error('Error fetchPreEjecuciones:', e)
      preEjecuciones.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchPendientes = async (filtros = {}) => {
    loading.value = true
    try {
      const resp = await api.get('/rutinas/pendientes', { params: filtros })
      pendientes.value = Array.isArray(resp?.data) ? resp.data : []
      return pendientes.value
    } catch (e) {
      console.error('Error fetchPendientes:', e)
      pendientes.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const generarToken = async (mantenimientoId) => {
    try {
      const resp = await api.post(`/rutinas/${mantenimientoId}/token`)
      return resp?.data || null
    } catch (e) {
      toast.error('Error generando token')
      return null
    }
  }

  const generarTokensLote = async (ids) => {
    try {
      const resp = await api.post('/rutinas/tokens/lote', { ids })
      return resp?.data || []
    } catch (e) {
      toast.error('Error generando tokens')
      return []
    }
  }

  const aprobar = async (id) => {
    try {
      const resp = await api.post(`/rutinas/pre-ejecuciones/${id}/aprobar`)
      if (resp?.success) toast.success('Pre-ejecución aprobada')
      return resp?.data
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error aprobando')
      throw e
    }
  }

  const rechazar = async (id, motivo) => {
    try {
      const resp = await api.post(`/rutinas/pre-ejecuciones/${id}/rechazar`, {
        motivo_rechazo: motivo
      })
      if (resp?.success) toast.success('Pre-ejecución rechazada')
      return resp?.data
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error rechazando')
      throw e
    }
  }

  return {
    preEjecuciones,
    pendientes,
    loading,
    fetchPreEjecuciones,
    fetchPendientes,
    generarToken,
    generarTokensLote,
    aprobar,
    rechazar
  }
})
