<script lang="ts">
	import { page } from '$app/stores';
	import { themes } from '$lib/data/themes';
	import '../app.css';
</script>

<div class="flex flex-1 h-full">
	<!-- <ul class="menu bg-base-200 w-56 gap-4">
		<li class="menu-title">VPKS</li>
		<li>
			<a
				href="/deployments"
				class:bg-base-300={$page.url.pathname.includes('/deployments')}
				class:text-secondary={$page.url.pathname.includes('/deployments')}
				class="hover:bg-base-100 hover:text-secondary"
			>
				Deployments
			</a>
		</li>
		<li>
			<a
				href="/templates"
				class:bg-base-300={$page.url.pathname.includes('/templates')}
				class:text-secondary={$page.url.pathname.includes('/templates')}
				class="hover:bg-base-100 hover:text-secondary"
			>
				Templates
			</a>
		</li>

		<div class="divider" />

		<li class="flex items-end">
			<div class="dropdown dropdown-right dropdown-end">
				<div tabindex="0" role="button" class="btn w-full flex-1">
					Theme
					<svg
						width="12px"
						height="12px"
						class="h-2 w-2 fill-current opacity-60 inline-block"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 2048 2048"
						><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" /></svg
					>
				</div>
				<ul
					class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 h-[15em] overflow-auto"
				>
					{#each themes as theme}
						<li>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
								aria-label={theme}
								value={theme}
							/>
						</li>
					{/each}
				</ul>
			</div>
		</li>
	</ul> -->

	<div class="flex flex-col justify-between bg-base-200 w-56 gap-4">
		<div class="flex flex-col gap-2">
			<h1 class="font-bold text-center my-2">VKPS</h1>

			<a
				href="/deployments"
				class:bg-base-300={$page.url.pathname.includes('/deployments')}
				class:text-secondary={$page.url.pathname.includes('/deployments')}
				class:border-l-2={$page.url.pathname.includes('/deployments')}
				class:border-l-secondary={$page.url.pathname.includes('/deployments')}
				class="p-2 hover:bg-base-100 hover:text-secondary">Applications</a
			>
			<a
				href="/templates"
				class:bg-base-300={$page.url.pathname.includes('/templates')}
				class:text-secondary={$page.url.pathname.includes('/templates')}
				class:border-l-2={$page.url.pathname.includes('/templates')}
				class:border-l-secondary={$page.url.pathname.includes('/templates')}
				class="p-2 hover:bg-base-100 hover:text-secondary">Templates</a
			>
		</div>

		<div>
			<div class="divider" />
			<div class="dropdown dropdown-right dropdown-end w-full">
				<div tabindex="0" role="button" class="btn w-full flex-1 justify-start">
					Theme
					<svg
						width="12px"
						height="12px"
						class="h-2 w-2 fill-current opacity-60 inline-block"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 2048 2048"
						><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" /></svg
					>
				</div>
				<ul
					class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 h-[15em] overflow-auto"
				>
					{#each themes as theme}
						<li>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
								aria-label={theme}
								value={theme}
							/>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<div class="flex flex-col px-4 py-2 w-full h-full bg-base-100 overflow-hidden">
		<slot />
	</div>
</div>
