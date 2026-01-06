import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useCourseStore = defineStore('courses', {
    state: () => ({
        courses: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        loading: false,
        error: null,
        filters: {
            q: '',
            status: '', // 'Draft' or 'Published'
        }
    }),

    actions: {
        async fetchCourses(page = 1) {
            this.loading = true;
            this.error = null;
            try {
                const { q, status } = this.filters;
                const response = await api.get('/courses/search', {
                    params: {
                        q: q || undefined,
                        status: status || undefined,
                        page,
                        pageSize: this.pageSize
                    }
                });
                this.courses = response.data.items;
                this.totalCount = response.data.totalCount;
                this.page = response.data.page;
            } catch (error) {
                this.error = 'Error fetching courses';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async createCourse(title) {
            this.loading = true;
            try {
                const response = await api.post('/Courses', { title });
                await this.fetchCourses(this.page);
                return response.data;
            } catch (error) {
                this.error = 'Error creating course';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateCourse(id, title) {
            this.loading = true;
            try {
                const response = await api.put(`/Courses/${id}`, { title });
                await this.fetchCourses(this.page);
                return response.data;
            } catch (error) {
                this.error = 'Error updating course';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteCourse(id) {
            this.loading = true;
            try {
                await api.delete(`/Courses/${id}`);
                await this.fetchCourses(this.page);
            } catch (error) {
                this.error = 'Error deleting course';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async publishCourse(id) {
            this.loading = true;
            try {
                await api.patch(`/Courses/${id}/publish`);
                await this.fetchCourses(this.page);
            } catch (error) {
                this.error = error.response?.data?.message || 'Error publishing course';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async unpublishCourse(id) {
            this.loading = true;
            try {
                await api.patch(`/Courses/${id}/unpublish`);
                await this.fetchCourses(this.page);
            } catch (error) {
                this.error = 'Error unpublishing course';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        setFilters(filters) {
            this.filters = { ...this.filters, ...filters };
            this.fetchCourses(1);
        }
    }
});
