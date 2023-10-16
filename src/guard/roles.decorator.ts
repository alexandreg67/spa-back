import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Comparer avec src/guard/roles.decorator.ts
export const Roles = (...roles: string[]) => {
  console.log('Le décorateur @Roles est utilisé avec les rôles:', roles);
  // Retournes un objet avec la clé "roles" et la valeur "roles"
  return SetMetadata(ROLES_KEY, roles);
};
