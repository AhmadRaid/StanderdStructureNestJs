import { Request } from 'express';
import { Lang } from 'src/common/enum/lang.enum';

export interface JwtOrDeviceRequest extends Request {
  headers: {
    authorization?: string;
    'accept-language'?: Lang;
    // Add other header properties as needed
  } & Request['headers'];
  user: {
    _id?: string
  };
  lang: string
  deviceId: string
}