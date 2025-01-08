import {
  I18nModule,
  HeaderResolver,
  AcceptLanguageResolver,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

export const TranslationConfig = I18nModule.forRoot({
    fallbackLanguage: 'ar',
    loaderOptions: {
      path: path.join(__dirname, '../i18n/'),
      watch: true,  
    },
  resolvers: [
    AcceptLanguageResolver,
    { use: HeaderResolver, options: ['x-lang'] },
  ],
});