import type { Application } from '$lib/models/application.model';
import { writable } from 'svelte/store';

export const deploymentStore = writable<Application>();
