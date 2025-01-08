import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AcceptLanguageResolver, HeaderResolver, I18nModule, I18nService, QueryResolver } from 'nestjs-i18n';
import { ResponseModel } from './common/classes/response.model';

import { firebaseAdminInit } from './config/firebase.config';

import { AppImports } from './config/app-imports.config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: AppImports,
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'FIREBASE_ADMIN_INIT',
      useFactory: () => {
        firebaseAdminInit();
      },
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {
  constructor(private readonly i18n: I18nService) {
    ResponseModel.i18n = this.i18n;
  }
}
