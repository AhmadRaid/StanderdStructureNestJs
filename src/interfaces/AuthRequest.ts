import { Request } from 'express';
import { Lang } from 'src/common/enum/lang.enum';

export interface AuthRequest extends Request {
  headers: {
    authorization?: string;
    'accept-language'?: Lang;
    // Add other header properties as needed
  } & Request['headers'];
  user: {
    _id?: string,
    role:string
  };
  lang: string
}