import { I18nContext, I18nService } from 'nestjs-i18n';

export class ResponseModel<T> {
  readonly data: T;

  readonly code: number;

  readonly message: string;

  readonly status: string = 'success';

  error?: any;

  static i18n: I18nService;
  constructor(
    code: number,
    data: T = null,
    message,
    status = 'success',
    error = null,
  ) {
    this.code = code;
    this.data = data;
    this.message = message;
    this.status = status;
    if (message === 'VALIDATION_FAILED') {
      this.error = error;
    }
  }

  //static message with the translate message i18n.t('test.HELLO', { lang: 'ar' });
  static async success(
    code: number,
    data: any = null,
    message: string,
    status: string = 'success',
  ): Promise<ResponseModel<any>> {
    const translatedMessage = await ResponseModel.i18n.t(`common.${message}`, {
      lang: I18nContext.current().lang,
    });
    console.log('translatedMessage ', translatedMessage);
    return new ResponseModel(code, data, translatedMessage, status);
  }
}
