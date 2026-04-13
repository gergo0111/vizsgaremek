const API_BASE_URL = "http://localhost:3000";

export async function apiGet<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		let message = `HTTP ${res.status}`;
		try {
			const data = await res.json();
			message = data?.message ?? message;
		} catch {
		}
		throw new Error(message);
	}

	return (await res.json()) as T;
}

export async function apiPatch<T>(path: string, data: Record<string, any>): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		let message = `HTTP ${res.status}`;
		try {
			const jsonData = await res.json();
			message = jsonData?.message ?? message;
		} catch {
		}
		throw new Error(message);
	}

	return (await res.json()) as T;
}
