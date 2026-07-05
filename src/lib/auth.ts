import { prisma } from './prisma';

export async function verifyAuth(token?: string) {
  // Mock authentication for development. 
  // Retorna el primer usuario administrador que exista en la base de datos
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });
  
  if (admin) {
    return admin;
  }

  // Fallback si no hay administradores
  const anyUser = await prisma.user.findFirst();
  return anyUser || { id: 'mock-user-id', name: 'Mock User', role: 'ADMIN' };
}
