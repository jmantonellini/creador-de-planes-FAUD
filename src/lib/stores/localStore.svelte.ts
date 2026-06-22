const browser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const CURRENT_VERSION = '2.0';

function checkAndMigrateVersion() {
	if (!browser) return;

	const storedVersion = localStorage.getItem('app_version');

	if (storedVersion && storedVersion !== CURRENT_VERSION) {
		migrateOldData(storedVersion);
	}

	localStorage.setItem('app_version', CURRENT_VERSION);
}

function migrateOldData(oldVersion: string) {
	if (oldVersion === '1.0' || oldVersion === '1.1') {
		localStorage.removeItem('subjects');
		localStorage.removeItem('plans');
		localStorage.removeItem('custom_plans');
	}
}

export class LocalStore<T> {
	value = $state<T>();
	key: string;

	constructor(key: string, initial: T) {
		this.key = key;
		this.value = initial;

		if (browser) {
			checkAndMigrateVersion();

			const saved = localStorage.getItem(key);
			if (saved) {
				try {
					this.value = this.deserialize(saved);
				} catch (e) {
					this.value = initial;
				}
			}
		}

		$effect(() => {
			if (this.value !== undefined) {
				localStorage.setItem(this.key, this.serialize(this.value));
			} else {
				localStorage.removeItem(this.key);
			}
		});
	}

	serialize(value: T): string {
		return JSON.stringify(value);
	}

	deserialize(item: string): T {
		return JSON.parse(item);
	}
}

export function localStore<T>(key: string, initial: T) {
	return new LocalStore(key, initial);
}
