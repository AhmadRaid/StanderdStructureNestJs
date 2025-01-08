// src/app-imports.ts
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './database.config';
import { TranslationConfig } from './translation.config';
import { AuthModule } from '../app/auth/auth.module';
import { UserModule } from '../app/user/user.module';

// import { GoogleMapModule } from 'src/app/google-map/google-map.module';

export const AppImports = [
  ScheduleModule.forRoot(),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/',
  }),
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  // ThrottlerModule.forRoot([{
  //   ttl: 60000,
  //   limit: 10,
  // }]),
  DatabaseConfig,
  TranslationConfig,
  AuthModule,
  UserModule,
];