const LOGGED_IN_KEY = 'admin_logged_in';
const USERNAME_KEY = 'admin_username';

export function isAdminLoggedIn() {
  return localStorage.getItem(LOGGED_IN_KEY) === 'true';
}

export function getAdminUsername() {
  return localStorage.getItem(USERNAME_KEY) || 'Админ';
}

export function setAdminSession(username) {
  localStorage.setItem(LOGGED_IN_KEY, 'true');
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAdminSession() {
  localStorage.removeItem(LOGGED_IN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}
