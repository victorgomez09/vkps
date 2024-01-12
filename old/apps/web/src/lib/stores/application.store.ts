import type { Application } from '$lib/models/application.model';
import { writable } from 'svelte/store';

export const applicationStore = writable<Application>();
