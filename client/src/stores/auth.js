import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // Estat
    const tokenAcces = ref(localStorage.getItem('token_acces') || null);
    const tokenRefresc = ref(localStorage.getItem('token_refresc') || null);
    const usuariId = ref(localStorage.getItem('usuari_id') || null);
    const usuariActual = ref(null);

    // Getters (Computats)
    const estaAutenticat = computed(() => !!tokenAcces.value);

    // Accions
    function guardarSessio(acces, refresc, id) {
        tokenAcces.value = acces;
        tokenRefresc.value = refresc;
        usuariId.value = id;

        // Persistència bàsica
        localStorage.setItem('token_acces', acces);
        localStorage.setItem('token_refresc', refresc);
        localStorage.setItem('usuari_id', id);
    }

    function tancarSessio() {
        tokenAcces.value = null;
        tokenRefresc.value = null;
        usuariId.value = null;
        usuariActual.value = null;

        localStorage.removeItem('token_acces');
        localStorage.removeItem('token_refresc');
        localStorage.removeItem('usuari_id');
    }

    return {
        tokenAcces,
        tokenRefresc,
        usuariId,
        usuariActual,
        estaAutenticat,
        guardarSessio,
        tancarSessio
    };
});
