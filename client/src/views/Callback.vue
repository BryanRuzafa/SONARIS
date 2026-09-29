<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-midnight-abyss text-starlight-white">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-signal mb-4"></div>
    <p class="text-lg animate-pulse">Sincronitzant amb el nucli de Sonaris...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const ruta = useRoute();
const enrutador = useRouter();
const magatzemAuth = useAuthStore();

onMounted(() => {
  // Capturem els paràmetres de la URL que ens envia el backend
  const { access_token, refresh_token, user_id } = ruta.query;

  if (access_token && refresh_token) {
    // Guardem les dades al magatzem Pinia
    magatzemAuth.guardarSessio(access_token, refresh_token, user_id);
    
    // Redirigim al Dashboard principal
    enrutador.push('/dashboard');
  } else {
    // Si alguna cosa falla, tornem al login
    console.error('No s\'han rebut els tokens correctes');
    enrutador.push('/login');
  }
});
</script>
