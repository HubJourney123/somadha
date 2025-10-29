import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUserByEmail, getAgentByUsername } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: 'agent-login',
      name: 'Agent Login',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const agent = await getAgentByUsername(credentials.username);
          
          if (!agent) {
            throw new Error('Invalid credentials');
          }

          if (!agent.is_active) {
            throw new Error('Account is deactivated');
          }

          const isValid = await bcrypt.compare(credentials.password, agent.password_hash);
          
          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          return {
            id: agent.id.toString(),
            name: agent.full_name,
            email: agent.email,
            role: 'agent',
            username: agent.username,
          };
        } catch (error) {
          console.error('Agent login error:', error);
          return null;
        }
      }
    }),
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin Login',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        try {
          const { sql } = await import('@/lib/db');
          const result = await sql`
            SELECT * FROM admins 
            WHERE email = ${credentials.email} 
            AND role = ${credentials.role}
          `;

          if (result.length === 0) {
            throw new Error('Invalid credentials');
          }

          const admin = result[0];
          const isValid = await bcrypt.compare(credentials.password, admin.password_hash);
          
          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          return {
            id: admin.id.toString(),
            email: admin.email,
            role: admin.role,
            name: admin.role === 'developer' ? 'Developer' : 'Politician',
          };
        } catch (error) {
          console.error('Admin login error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await createUser({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: profile.sub,
          });
          return true;
        } catch (error) {
          console.error('Error creating user:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'user';
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };