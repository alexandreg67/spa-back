import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => {
  console.log('Le décorateur @Roles est utilisé avec les rôles:', roles);
  return SetMetadata(ROLES_KEY, roles);
};
