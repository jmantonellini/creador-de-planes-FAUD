const browser = typeof window !== 'undefined';

const CURRENT_VERSION = '3.0'; // Incrementa cuando quieras resetear todos los datos

function checkAndMigrateVersion() {
	if (!browser) return;

	const storedVersion = localStorage.getItem('app_version');

	// Si la versión no coincide, limpiar todo y guardar nueva versión
	if (storedVersion !== CURRENT_VERSION) {
		// Limpiar todo el localStorage
		localStorage.clear();
		console.log(`Cache cleared - New version: ${CURRENT_VERSION}`);

		// Guardar la nueva versión
		localStorage.setItem('app_version', CURRENT_VERSION);
	}
}

export function localStore<T>(key: string, initial: T) {
	let value = $state<T>(initial);

	if (browser) {
		// Verificar versión al cargar el store
		checkAndMigrateVersion();

		const saved = localStorage.getItem(key);
		if (saved) {
			try {
				value = JSON.parse(saved);
			} catch (e) {
				value = initial;
			}
		}
	}

	return {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;
			if (browser) {
				localStorage.setItem(key, JSON.stringify(newValue));
			}
		}
	};
}
