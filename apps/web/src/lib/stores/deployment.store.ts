import type { Deployment } from '$lib/models/deployment.model';
import { writable } from 'svelte/store';

export const deploymentStore = writable<Deployment>();
