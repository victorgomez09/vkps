<script lang="ts">
	import 'flowbite';
	import { onMount } from 'svelte';
	import { initFlowbite } from 'flowbite';
	import { page } from '$app/stores';
	import { themes } from '$lib/data/themes';
	import '../app.css';

	function changeTheme(theme: string) {
		localStorage.setItem('theme', theme);
	}

	onMount(() => {
		initFlowbite();
	});
</script>

<button
	data-drawer-target="default-sidebar"
	data-drawer-toggle="default-sidebar"
	aria-controls="default-sidebar"
	type="button"
	class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
>
	<span class="sr-only">Open sidebar</span>
	<svg
		class="w-6 h-6"
		aria-hidden="true"
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			clip-rule="evenodd"
			fill-rule="evenodd"
			d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
		/>
	</svg>
</button>

<aside
	id="default-sidebar"
	class="shadow fixed top-0 left-0 z-40 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0"
	aria-label="Sidebar"
>
	<div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
		<a href="/" class="flex items-center justify-center ps-2.5 mb-5">
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">VKPS</span>
		</a>
		<ul class="space-y-2 font-medium">
			<li>
				<a
					href="/applications"
					class:text-green-500={$page.url.pathname.includes('/applications')}
					class:bg-gray-100={$page.url.pathname.includes('/applications')}
					class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
				>
					<svg
						class:text-green-500={$page.url.pathname.includes('/applications')}
						class:bg-gray-100={$page.url.pathname.includes('/applications')}
						class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 18 18"
					>
						<path
							d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"
						/>
					</svg>
					<span class="ms-3">Applications</span>
				</a>
			</li>
			<li>
				<a
					href="/addons"
					class:text-green-500={$page.url.pathname.includes('/addons')}
					class:bg-gray-100={$page.url.pathname.includes('/addons')}
					class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
				>
					<svg
						class:text-green-500={$page.url.pathname.includes('/addons')}
						class:bg-gray-100={$page.url.pathname.includes('/addons')}
						class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 18 20"
					>
						<path
							d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"
						/>
					</svg>
					<span class="flex-1 ms-3 whitespace-nowrap">Addons</span>
				</a>
			</li>
		</ul>
	</div>
</aside>

<div class="flex flex-col flex-1 h-full overflow-hidden bg-gray-100 sm:ml-48">
	<div class="p-4 w-full h-full">
		<slot />
	</div>
</div>
