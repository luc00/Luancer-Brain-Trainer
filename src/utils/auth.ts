import { UserAccount, UserProfile, UserTrainingPace } from '../types';
import { createZeroProfile, saveProfile, setActiveProfile, getProfile } from './storage';

const AUTH_USER_KEY = 'luancer_auth_user_v1';
const AUTH_TOKEN_KEY = 'luancer_auth_token_v1';
const LOCAL_USERS_KEY = 'luancer_local_users_db_v1';

export interface LocalUserRecord {
  user: UserAccount;
  passwordHash: string;
  profile: UserProfile;
  token: string;
}

// Simple browser-safe hash for offline multi-account persistence
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16) + '_' + str.length;
}

function getLocalUsersDB(): Record<string, LocalUserRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUsersDB(db: Record<string, LocalUserRecord>) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save local users DB:', err);
  }
}

export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function registerUser({
  email,
  password,
  name,
  trainingPace = 'steady',
}: {
  email: string;
  password: string;
  name: string;
  trainingPace?: UserTrainingPace;
}): Promise<{ success: boolean; user?: UserAccount; profile?: UserProfile; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  // 1. Try server registration first
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password, name: cleanName, trainingPace }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Errore durante la registrazione.' };
    }

    const { user, profile, token } = data;

    // Save auth session
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    // Save locally for offline fallback
    const localDb = getLocalUsersDB();
    localDb[cleanEmail] = {
      user,
      passwordHash: simpleHash(password),
      profile,
      token,
    };
    saveLocalUsersDB(localDb);

    // Apply profile to storage
    setActiveProfile(profile);

    return { success: true, user, profile };
  } catch (serverErr) {
    console.warn('Server auth unavailable, using resilient local storage registration:', serverErr);

    // Offline / direct local fallback
    const localDb = getLocalUsersDB();
    if (localDb[cleanEmail]) {
      return { success: false, error: 'Un account con questa email esiste già localmente. Effettua l\'accesso.' };
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: UserAccount = {
      id: userId,
      email: cleanEmail,
      name: cleanName,
      trainingPace,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    const zeroProfile = createZeroProfile(cleanName, cleanEmail, trainingPace);
    zeroProfile.id = userId;
    zeroProfile.accountId = userId;

    const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    localDb[cleanEmail] = {
      user,
      passwordHash: simpleHash(password),
      profile: zeroProfile,
      token,
    };
    saveLocalUsersDB(localDb);

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setActiveProfile(zeroProfile);

    return { success: true, user, profile: zeroProfile };
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: UserAccount; profile?: UserProfile; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Try server login
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    const data = await res.json();
    if (res.ok) {
      const { user, profile, token } = data;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // Cache locally
      const localDb = getLocalUsersDB();
      localDb[cleanEmail] = {
        user,
        passwordHash: simpleHash(password),
        profile,
        token,
      };
      saveLocalUsersDB(localDb);

      setActiveProfile(profile);
      return { success: true, user, profile };
    } else if (res.status === 401 || res.status === 400 || res.status === 409) {
      // Valid error from server (bad credentials or user not found)
      return { success: false, error: data.error || 'Credenziali non valide.' };
    }
  } catch (serverErr) {
    console.warn('Server auth unreachable, attempting offline local login:', serverErr);
  }

  // Fallback to local storage DB
  const localDb = getLocalUsersDB();
  const localRecord = localDb[cleanEmail];
  if (!localRecord) {
    return { success: false, error: 'Nessun account trovato per questa email. Registrati per iniziare da zero.' };
  }

  if (localRecord.passwordHash !== simpleHash(password)) {
    return { success: false, error: 'Password non corretta. Riprova.' };
  }

  localRecord.user.lastLoginAt = Date.now();
  saveLocalUsersDB(localDb);

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(localRecord.user));
  localStorage.setItem(AUTH_TOKEN_KEY, localRecord.token);
  setActiveProfile(localRecord.profile);

  return { success: true, user: localRecord.user, profile: localRecord.profile };
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function updateUserTrainingPace(pace: UserTrainingPace): Promise<UserProfile> {
  const token = getStoredToken();
  const user = getStoredUser();

  if (user) {
    user.trainingPace = pace;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    const localDb = getLocalUsersDB();
    if (localDb[user.email]) {
      localDb[user.email].user.trainingPace = pace;
      localDb[user.email].profile.trainingPace = pace;
      saveLocalUsersDB(localDb);
    }
  }

  // Try sync with server
  if (token) {
    try {
      await fetch('/api/auth/update-pace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pace }),
      });
    } catch (err) {
      console.warn('Failed to sync pace with server:', err);
    }
  }

  const p = getProfile();
  const updated: UserProfile = {
    ...p,
    trainingPace: pace,
    reminderSettings: {
      ...(p.reminderSettings || {
        notificationsEnabled: true,
        autoSmartScheduling: true,
        dailyFrequency: 2,
        quietHoursStart: 22,
        quietHoursEnd: 7,
        userChronotype: 'auto_detected' as const,
        completedMicroWorkoutsCount: 0,
      }),
      dailyFrequency: pace === 'gentle' ? 1 : pace === 'steady' ? 2 : (4 as 1 | 2 | 3 | 4),
    },
  };
  saveProfile(updated);
  return updated;
}

export async function resetCurrentUserToZero(): Promise<UserProfile> {
  const user = getStoredUser();
  const token = getStoredToken();
  const name = user ? user.name : 'Neuro-Explorer';
  const email = user ? user.email : '';
  const pace = user ? user.trainingPace : 'steady';

  const freshZeroProfile = createZeroProfile(name, email, pace);

  if (user) {
    freshZeroProfile.id = user.id;
    freshZeroProfile.accountId = user.id;

    const localDb = getLocalUsersDB();
    if (localDb[user.email]) {
      localDb[user.email].profile = freshZeroProfile;
      saveLocalUsersDB(localDb);
    }
  }

  if (token) {
    try {
      await fetch('/api/auth/reset-to-zero', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.warn('Failed to reset on server:', err);
    }
  }

  setActiveProfile(freshZeroProfile);
  return freshZeroProfile;
}

export async function syncProfileBackground(profile: UserProfile): Promise<void> {
  const token = getStoredToken();
  const user = getStoredUser();

  if (user) {
    const localDb = getLocalUsersDB();
    if (localDb[user.email]) {
      localDb[user.email].profile = profile;
      saveLocalUsersDB(localDb);
    }
  }

  if (token) {
    try {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile, trainingPace: profile.trainingPace }),
      });
    } catch {
      // background sync fail ignored silently
    }
  }
}
