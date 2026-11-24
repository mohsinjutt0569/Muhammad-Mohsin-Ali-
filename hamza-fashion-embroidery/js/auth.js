// auth.js – simple client‑side authentication for Hamza Fashion Embroidery

import { hashPassword, loadJSON, saveJSON, generateId } from './utils.js';

const USERS_KEY = 'hamza_users';
const SESSION_KEY = 'hamza_session';

// Retrieve all users from localStorage (array of {id, username, passwordHash})
function getUsers() {
  return loadJSON(USERS_KEY) || [];
}

function setUsers(users) {
  saveJSON(USERS_KEY, users);
}

// Register a new user. Returns {success, message}
export async function register(username, password) {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return { success: false, message: 'Username already exists.' };
  }
  const passwordHash = await hashPassword(password);
  const newUser = { id: generateId(), username, passwordHash };
  users.push(newUser);
  setUsers(users);
  // Auto‑login after registration
  saveJSON(SESSION_KEY, { userId: newUser.id });
  return { success: true, message: 'Registered and logged in.' };
}

// Login with username/password. Returns {success, message}
export async function login(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    return { success: false, message: 'User not found.' };
  }
  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, message: 'Incorrect password.' };
  }
  saveJSON(SESSION_KEY, { userId: user.id });
  return { success: true, message: 'Logged in.' };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function currentUser() {
  const session = loadJSON(SESSION_KEY);
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.id === session.userId) || null;
}

// Helper to check auth state and toggle UI elements
export function updateAuthUI() {
  const user = currentUser();
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const avatarBtn = document.getElementById('avatarBtn');
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (avatarBtn) {
      avatarBtn.style.display = 'inline-block';
      avatarBtn.title = `Logged in as ${user.username}`;
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (registerBtn) registerBtn.style.display = 'inline-block';
    if (avatarBtn) avatarBtn.style.display = 'none';
  }
}

// Export for convenience
export const auth = { register, login, logout, currentUser, updateAuthUI };
