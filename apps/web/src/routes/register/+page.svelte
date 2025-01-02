<script lang="ts">
	import { trpc } from '$base/src/lib/trpc/client';
	import { goto } from '$app/navigation';

	let { email = $bindable(), username = $bindable(), password = $bindable(), ...props } = $props();

	const register = trpc().user.register.createMutation({
		onSuccess: () => {
			goto('/');
		}
	});
</script>

<h1>register</h1>
<form>
	<input placeholder="email" type="email" bind:value={email} /> <br />
	<input placeholder="username" type="text" bind:value={username} /><br />
	<input placeholder="password" type="password" bind:value={password} /><br />
	<button
		onclick={(e) => {
			e.preventDefault();
			$register.mutate({
				email: email,
				name: username,
				password: password
			});
		}}>submit</button
	>
</form>
