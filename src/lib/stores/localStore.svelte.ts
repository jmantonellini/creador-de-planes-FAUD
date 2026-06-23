const browser = typeof window !== 'undefined';

export function localStore<T>(key: string, initial: T) {
	let value = $state<T>(initial);

	if (browser) {
		const saved = localStorage.getItem(key);
		if (saved) {
			try {
				value = JSON.parse(saved);
			} catch (e) {
				value = initial;
			}
		}
	}

	// Guardar cuando cambie (esto funciona en componentes .svelte)
	return {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;
			if (browser) {
				localStorage.setItem(key, JSON.stringify(newValue));
			}
		},
		// Para usar en $effect dentro de componentes
		subscribe(fn: (value: T) => void) {
			const unsubscribe = () => {};
			// Usamos un efecto para trackear cambios
			return unsubscribe;
		}
	};
}
