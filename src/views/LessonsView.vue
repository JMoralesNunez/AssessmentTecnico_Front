<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Navbar -->
        <nav class="bg-white shadow-sm border-b sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16 items-center">
                    <div class="flex items-center gap-4">
                        <router-link to="/dashboard" class="text-gray-400 hover:text-indigo-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </router-link>
                        <h1 class="text-xl font-bold text-gray-900 line-clamp-1">
                            {{ courseTitle }}
                        </h1>
                    </div>
                    <button @click="openModal()"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all">
                        + Nueva Lección
                    </button>
                </div>
            </div>
        </nav>

        <main class="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            <div v-if="lessonStore.loading" class="flex justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>

            <div v-else-if="!lessonStore.lessons.length"
                class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay lecciones aún</h3>
                <p class="mt-1 text-sm text-gray-500">Comienza agregando la primera lección de este curso.</p>
            </div>

            <div v-else class="space-y-4">
                <div v-for="(lesson, index) in lessonStore.lessons" :key="lesson.id"
                    class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-indigo-50 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {{ lesson.order }}
                        </div>
                        <span class="font-medium text-gray-800">{{ lesson.title }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <!-- Reorder Actions -->
                        <div class="flex flex-col gap-1 mr-4">
                            <button @click="handleReorder(index, 'up')" :disabled="index === 0"
                                class="text-gray-300 hover:text-indigo-600 disabled:opacity-0 transition-colors"
                                title="Subir">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button @click="handleReorder(index, 'down')"
                                :disabled="index === lessonStore.lessons.length - 1"
                                class="text-gray-300 hover:text-indigo-600 disabled:opacity-0 transition-colors"
                                title="Bajar">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <!-- CRUD Actions -->
                        <button @click="openModal(lesson)"
                            class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button @click="handleDelete(lesson.id)"
                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <LessonModal :isOpen="isModalOpen" :lesson="editingLesson" :nextOrder="lessonStore.lessons.length + 1"
            @close="closeModal" @save="handleSaveLesson" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonStore } from '@/stores/lessons';
import { useCourseStore } from '@/stores/courses';
import LessonModal from '@/components/LessonModal.vue';

const route = useRoute();
const router = useRouter();
const lessonStore = useLessonStore();
const courseStore = useCourseStore();

const courseId = route.params.id;
const courseTitle = ref('Cargando...');
const isModalOpen = ref(false);
const editingLesson = ref(null);

onMounted(async () => {
    await lessonStore.fetchLessons(courseId);

    // Try to find course title in store or fetch it
    const course = courseStore.courses.find(c => c.id === courseId);
    if (course) {
        courseTitle.value = course.title;
    } else {
        // Fallsback or fetch course summary if needed
        courseTitle.value = 'Gestión de Lecciones';
    }
});

const openModal = (lesson = null) => {
    editingLesson.value = lesson;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    editingLesson.value = null;
};

const handleSaveLesson = async (data) => {
    // Check for duplicate order in existing lessons (excluding the current one if editing)
    const isDuplicate = lessonStore.lessons.some(l => l.order === data.order && l.id !== data.id);
    if (isDuplicate) {
        alert(`Ya existe una lección con el número de orden ${data.order}. Por favor elige otro.`);
        return;
    }

    try {
        if (data.id) {
            await lessonStore.updateLesson(data.id, {
                title: data.title,
                order: data.order
            });
            await lessonStore.fetchLessons(courseId); // Refresh after update
        } else {
            await lessonStore.createLesson(courseId, {
                title: data.title,
                order: data.order
            });
        }
        closeModal();
    } catch (err) {
        console.error('Error saving lesson:', err);
        const errorMsg = err.response?.data?.message || err.response?.data || 'Error al guardar la lección';
        alert(typeof errorMsg === 'string' ? errorMsg : 'Error en la validación del servidor');
    }
};

const handleDelete = async (lessonId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta lección?')) {
        try {
            await lessonStore.deleteLesson(lessonId, courseId);
        } catch (err) {
            alert('Error al eliminar la lección');
        }
    }
};

const handleReorder = async (index, direction) => {
    try {
        await lessonStore.moveLesson(courseId, index, direction);
    } catch (err) {
        alert('Error al reordenar las lecciones');
    }
};
</script>
