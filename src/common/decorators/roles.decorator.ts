import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '../enum/adminRole.enum';

export const Roles = (...roles: AdminRole[]) => SetMetadata('roles', roles);
