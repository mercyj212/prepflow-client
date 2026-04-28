export function getStoredUser() {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.warn('[AUTH] Removed invalid saved user data.', error);
    localStorage.removeItem('user');
    return null;
  }
}
