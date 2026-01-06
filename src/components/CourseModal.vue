<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" @click="close">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-xl leading-6 font-bold text-gray-900 mb-4">
                                {{ isEdit ? 'Editar Curso' : 'Crear Nuevo Curso' }}
                            </h3>
                            <div class="mt-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Título del curso</label>
                                <input type="text" v-model="title" class="input-field"
                                    placeholder="Ej. Introducción a Vue 3" @keyup.enter="handleSave" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" @click="handleSave"
                        class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        {{ isEdit ? 'Guardar Cambios' : 'Crear Curso' }}
                    </button>
                    <button type="button" @click="close"
                        class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    course: Object,
});

const emit = defineEmits(['close', 'save']);

const title = ref('');
const isEdit = ref(false);

watch(() => props.course, (newVal) => {
    if (newVal) {
        title.value = newVal.title;
        isEdit.value = true;
    } else {
        title.value = '';
        isEdit.value = false;
    }
}, { immediate: true });

const close = () => {
    emit('close');
};

const handleSave = () => {
    if (title.value.trim()) {
        emit('save', { id: props.course?.id, title: title.value });
    }
};
</script>
