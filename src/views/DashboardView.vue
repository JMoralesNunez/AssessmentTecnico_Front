<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-indigo-600">CoursePlatform</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Bienvenido</span>
            <button @click="handleLogout" class="text-sm font-medium text-red-600 hover:text-red-500 transition-colors">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header Actions -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Mis Cursos</h2>
          <p class="text-gray-500 mt-1">Gestiona tus cursos y su contenido.</p>
        </div>
        <button @click="openModal()"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105">
          + Nuevo Curso
        </button>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 rounded-2xl mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="col-span-1 md:col-span-2">
            <label class="block text-xs font-semibold uppercase text-gray-400 mb-1 ml-1">Buscar</label>
            <input v-model="courseStore.filters.q" @input="handleFilterChange" type="text"
              placeholder="Escribe el nombre del curso..." class="input-field" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase text-gray-400 mb-1 ml-1">Estado</label>
            <select v-model="courseStore.filters.status" @change="handleFilterChange"
              class="input-field appearance-none">
              <option value="">Todos los estados</option>
              <option value="Draft">Draft (Borrador)</option>
              <option value="Published">Published (Publicado)</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="clearFilters" class="text-sm font-medium text-indigo-600 hover:text-indigo-800 p-2 mb-1">
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Course List -->
      <div v-if="courseStore.loading && !courseStore.courses.length" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="!courseStore.courses.length"
        class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay cursos</h3>
        <p class="mt-1 text-sm text-gray-500">Comienza creando un nuevo curso.</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in courseStore.courses" :key="course.id"
            class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <!-- Badge -->
            <div class="absolute top-4 right-4">
              <span :class="[
                course.status === 1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider'
              ]">
                {{ course.status === 1 ? 'Publicado' : 'Borrador' }}
              </span>
            </div>


            <h3 class="font-bold text-xl mb-2 text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {{ course.title }}
            </h3>

            <div class="flex items-center text-sm text-gray-500 mb-6 gap-4">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ course.totalLessons }} lecciones
              </span>
              <span>
                Actualizado {{ formatDate(course.updatedAt) }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-50">
              <div class="flex gap-2 items-center">
                <router-link :to="{ name: 'lessons', params: { id: course.id } }"
                  class="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                  title="Gestionar Lecciones">
                  Lecciones
                </router-link>
                <button @click="openModal(course)"
                  class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Editar">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="handleDelete(course.id)"
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <button @click="togglePublish(course)" :class="[
                course.status === 1 ? 'text-amber-600 hover:bg-amber-50' : 'text-indigo-600 hover:bg-indigo-50',
                'text-sm font-bold px-3 py-1.5 rounded-lg transition-colors'
              ]">
                {{ course.status === 1 ? 'Despublicar' : 'Publicar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <Pagination :totalCount="courseStore.totalCount" :pageSize="courseStore.pageSize"
          :currentPage="courseStore.page" @page-change="handlePageChange" />
      </div>
    </main>

    <!-- Modal -->
    <CourseModal :isOpen="isModalOpen" :course="editingCourse" @close="closeModal" @save="handleSaveCourse" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/courses';
import CourseModal from '@/components/CourseModal.vue';
import Pagination from '@/components/Pagination.vue';

const authStore = useAuthStore();
const courseStore = useCourseStore();

const isModalOpen = ref(false);
const editingCourse = ref(null);

onMounted(() => {
  courseStore.fetchCourses();
});

const handleLogout = () => {
  authStore.logout();
};

const handleFilterChange = () => {
  courseStore.fetchCourses(1);
};

const clearFilters = () => {
  courseStore.filters.q = '';
  courseStore.filters.status = '';
  courseStore.fetchCourses(1);
};

const handlePageChange = (page) => {
  courseStore.fetchCourses(page);
};

const openModal = (course = null) => {
  editingCourse.value = course;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingCourse.value = null;
};

const handleSaveCourse = async (data) => {
  try {
    if (data.id) {
      await courseStore.updateCourse(data.id, data.title);
    } else {
      await courseStore.createCourse(data.title);
    }
    closeModal();
  } catch (err) {
    alert(err.message || 'Error al guardar el curso');
  }
};

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
    try {
      await courseStore.deleteCourse(id);
    } catch (err) {
      alert('Error al eliminar el curso');
    }
  }
};

const togglePublish = async (course) => {
  try {
    if (course.status === 1) {
      await courseStore.unpublishCourse(course.id);
    } else {
      if (course.totalLessons === 0) {
        alert('Para publicar este curso, primero debes asignarle lecciones.');
        return;
      }
      await courseStore.publishCourse(course.id);
    }
  } catch (err) {
    alert(err);
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(
    Math.round((date - new Date()) / (1000 * 60 * 60 * 24)),
    'day'
  );
};
</script>
