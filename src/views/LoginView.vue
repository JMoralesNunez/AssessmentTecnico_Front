<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenido de nuevo
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          O
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            crea una cuenta nueva
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email-address" name="email" type="email" v-model="form.email" required class="input-field"
              placeholder="tu@email.com" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input id="password" name="password" type="password" v-model="form.password" required class="input-field"
              placeholder="••••••••" />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading">Cargando...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(form);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.';
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  const lastError = localStorage.getItem('last_api_error');
  if (lastError) {
    console.group('Ultimo Error Detectado antes del Deslogueo');
    console.log(JSON.parse(lastError));
    console.groupEnd();
  }

  const refreshFail = localStorage.getItem('refresh_failure');
  if (refreshFail) {
    console.error('Fallo el Refresh Token:', JSON.parse(refreshFail));
  }
});
</script>
