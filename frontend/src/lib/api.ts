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
