import type { User } from 'firebase/auth';

// Quick client-side admin whitelist for development/testing
export const ADMIN_EMAILS = [
  'admin@sazon.com',
];

export function getUserRole(user: User | null | undefined): string | undefined {
  if (!user) return undefined;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return 'admin';
  }
  return undefined;
}
