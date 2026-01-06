import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useLessonStore = defineStore('lessons', {
    state: () => ({
        lessons: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchLessons(courseId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get(`/Lessons/course/${courseId}`);
                // Sort by order field
                this.lessons = response.data.sort((a, b) => a.order - b.order);
            } catch (error) {
                this.error = 'Error fetching lessons';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async createLesson(courseId, lessonData) {
            this.loading = true;
            try {
                const response = await api.post(`/Lessons/course/${courseId}`, lessonData);
                await this.fetchLessons(courseId);
                return response.data;
            } catch (error) {
                this.error = 'Error creating lesson';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateLesson(lessonId, lessonData) {
            this.loading = true;
            try {
                const response = await api.put(`/Lessons/${lessonId}`, lessonData);
                if (lessonData.courseId) {
                    await this.fetchLessons(lessonData.courseId);
                }
                return response.data;
            } catch (error) {
                this.error = 'Error updating lesson';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteLesson(lessonId, courseId) {
            this.loading = true;
            try {
                await api.delete(`/Lessons/${lessonId}`);
                await this.fetchLessons(courseId);
            } catch (error) {
                this.error = 'Error deleting lesson';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async reorderLessons(courseId, orders) {
            this.loading = true;
            try {
                const payload = { orders };
                console.log('Enviando reorder payload:', JSON.stringify(payload, null, 2));
                await api.post(`/Lessons/course/${courseId}/reorder`, payload);
                await this.fetchLessons(courseId);
            } catch (error) {
                console.error('Error reordering:', error.response?.data || error.message);
                this.error = 'Error reordering lessons';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // UI Helper for easy reordering (move up/down)
        async moveLesson(courseId, lessonIndex, direction) {
            const newLessons = [...this.lessons];
            const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;

            if (targetIndex < 0 || targetIndex >= newLessons.length) return;

            // Swap
            const [movedItem] = newLessons.splice(lessonIndex, 1);
            newLessons.splice(targetIndex, 0, movedItem);

            // Prepare orders for API
            const orders = newLessons.map((lesson, index) => ({
                lessonId: lesson.id,
                newOrder: index + 1
            }));

            await this.reorderLessons(courseId, orders);
        }
    }
});
