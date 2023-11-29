<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';
</script>

<div class="flex flex-1 h-full">
	<ul class="menu bg-base-200 w-56">
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
	</ul>

	<div class="flex flex-col px-4 py-2 w-full h-full bg-base-100 overflow-hidden">
		<slot />
	</div>
</div>
