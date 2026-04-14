export type UserShape = {
  id?: number | string;
  username?: string;
  token?: string;
  [key: string]: any;
};

export function getUser(): UserShape | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const u = getUser();
  return !!u && (!!u.token || !!u.id || !!u.username);
}

export function setUser(u: UserShape) {
  localStorage.setItem('user', JSON.stringify(u));
}

export function logout() {
  localStorage.removeItem('user');
}
