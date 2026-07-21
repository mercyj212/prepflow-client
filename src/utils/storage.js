export function getStoredUser() {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) return null;

  try {
    const user = JSON.parse(rawUser);
    if (user?.token) {
      const { token, ...safeUser } = user;
      localStorage.setItem('user', JSON.stringify(safeUser));
      return safeUser;
    }
    return user;
  } catch (error) {
    console.warn('[AUTH] Removed invalid saved user data.', error);
    localStorage.removeItem('user');
    return null;
  }
}
