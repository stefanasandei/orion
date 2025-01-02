<script lang="ts">
	import { trpc } from '$base/src/lib/trpc/client';
	import { goto } from '$app/navigation';

	let { email = $bindable(), password = $bindable(), ...props } = $props();

	const login = trpc().user.login.createMutation({
		onSuccess: () => {
			goto('/');
		}
	});
</script>

<h1>
	login (
	<pre>a@b.c</pre>
	)
</h1>
<form>
	<input placeholder="email" type="email" bind:value={email} /> <br />
	<input placeholder="password" type="password" bind:value={password} /><br />
	<button
		onclick={(e) => {
			e.preventDefault();
			$login.mutate({
				email: email,
				password: password
			});
		}}>submit</button
	>
</form>
