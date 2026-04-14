const API_BASE_URL = "http://localhost:3000";

function getAuthHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	try {
		const userStr = localStorage.getItem('user');
		if (userStr) {
			const user = JSON.parse(userStr);
			if (user.token) {
				headers['Authorization'] = `Bearer ${user.token}`;
			}
		}
	} catch {
	}
	return headers;
}

export async function apiGet<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: "GET",
		headers: getAuthHeaders(),
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
		headers: getAuthHeaders(),
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
