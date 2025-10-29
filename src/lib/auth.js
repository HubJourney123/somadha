import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth(allowedRoles = []) {
  const session = await getSession();
  
  if (!session) {
    return { authorized: false, redirect: '/admin/login' };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return { authorized: false, redirect: '/' };
  }

  return { authorized: true, user: session.user };
}