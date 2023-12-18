<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';

	import { themes } from '$lib/data/themes';

	const selectedTheme = writable<string>('default');

	/* FUNCTIONS */
	function saveThemeStorage(theme: string): void {
		localStorage.setItem('theme', theme);

		selectedTheme.update(() => theme);
	}
</script>

<div class="shadow h-full w-48 hidden md:block bg-base-200">
	<div class="flex flex-col gap-2 h-full">
		<h3 class="text-xl font-semibold text-center w-full p-4">VKPS</h3>

		<div class="flex flex-col justify-between h-full">
			<ul class="menu rounded-box h-full">
				<li>
					<a class:active={$page.url.pathname.includes('applications')} href="/applications"
						>Applications</a
					>
				</li>
				<li>
					<a class:active={$page.url.pathname.includes('databases')} href="/databases">Databases</a>
				</li>
			</ul>

			<div class="flex self-end p-2">
				<div class="dropdown dropdown-top">
					<div tabIndex={0} role="button" class="btn m-1">
						<img
							class="w-6 h-6"
							alt="Theme selector icon"
							src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACK0lEQVR4nO2YT2sTQRjGf70sFPHgwRYLKuJBClIptIEcFMGakwjtpS0IPejRHoRiPMmiePILKN69aoSccij0EyiIxZaWlqKgtdVY/4REVAY28DJssruZzTjIPPBCdvLMzPPs7My8M+Dh4eHh4ZGMQeAO8ByoJcRjoIhj4l8BfzLEL+AajqCcUXw7PgOB1tYxYA64AZy2ZaAiRN0DprpECdgU/HHRzhXgm/ivGb2cvmNZdHqxR/5l4GeHkXrougEVP0TZBrCimXjgqgH1iXwVz9vAyWhuPLM1EiYGfovfO8ApwVMmKjZGwsRAOz4CozHcwMZImBr4BIx14QcxI3HTFQNfgIkUdQLNxHfgUA7ajQ3MZugnANZF3YKB5tz3gTSYAVqi7nEDzdYNlICGqFc11GwkKCv/krZLvwGGctDds6As/CJwIPhrwEhOunsSlIU/CdQFV6UbC1FSeAYYcNnAOWAvIR1/m3IJtm5A7cgfUp4p3gNHXDKgDjHvtBSjFhP7gjPvioETwJaWYpzt0MZ9wbvrgoFhYFWU1xO+71Bww39t4CjwWstzLiS0EdowcBhYjBEj+dPAS/HciJZJXDDwJCprRaesOP6udoi/mrLP0KaBZjRB4/jynkhdp6RFaOsTUgeP81347WPl9Yx9hq5MYhVLPfQZ5mnA5GKrmsCf6hAvRBu3TA3cTrnt9ysKeVzuyqXQZjwyFS9NlFNer+cRT/PIgTw8PDw8/n/8BVnww+duLD+vAAAAAElFTkSuQmCC"
						/>
					</div>
					<ul
						tabIndex={0}
						class="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5"
					>
						<div class="grid grid-cols-1 gap-3 p-3">
							{#each themes as theme}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
								<label
									for={theme}
									class="theme-controller outline-base-content text-start outline-offset-4 hover:base-200"
									data-set-theme={theme}
									data-act-class="[&_svg]:visible"
									on:click={() => saveThemeStorage(theme)}
								>
									<input
										id={theme}
										type="checkbox"
										value={theme}
										aria-label={theme}
										class="theme-controller opacity-0 absolute"
									/>
									<span
										data-theme={theme}
										class="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
									>
										<span class="grid grid-cols-5 grid-rows-3">
											<span
												class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="currentColor"
													class="invisible h-3 w-3 shrink-0"
													class:block={$selectedTheme === theme}
												>
													<path
														d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
													/>
												</svg>
												<span class="flex-grow text-sm">
													{theme}
												</span>
												<span class="flex h-full shrink-0 flex-wrap gap-1">
													<span class="bg-primary rounded-badge w-2" />
													<span class="bg-secondary rounded-badge w-2" />
													<span class="bg-accent rounded-badge w-2" />
													<span class="bg-neutral rounded-badge w-2" />
												</span>
											</span>
										</span>
									</span>
								</label>
							{/each}
						</div>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
