import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // En una implementación real, aquí verificaríamos las credenciales con la base de datos
        
        // Usuario de prueba para desarrollo
        const testUser = {
          id: '1',
          name: 'Administrador',
          email: 'admin@example.com',
          password: '$2a$10$7F/fYXIkUhLPxFb0Y0kuX.tRjuVRXnC3Z7qK3XgvpyQXYP2N3UjAO', // "password" encriptado con bcrypt
          role: 'ADMIN'
        };
        
        if (credentials.email !== testUser.email) {
          return null;
        }
        
        // Verificar contraseña
        const isValid = await compare(credentials.password, testUser.password);
        
        if (!isValid) {
          return null;
        }
        
        // Si llegamos aquí, las credenciales son válidas
        return {
          id: testUser.id,
          name: testUser.name,
          email: testUser.email,
          role: testUser.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin',
    signOut: '/admin',
    error: '/admin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'supersecretkey123456789',
});
