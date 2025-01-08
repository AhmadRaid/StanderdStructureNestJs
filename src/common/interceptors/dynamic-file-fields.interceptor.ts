// // dynamic-file-fields.interceptor.ts
// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { MulterField, FileFieldsInterceptor } from '@nestjs/platform-express';
// import { Observable } from 'rxjs';
// import { generateUploadConfig } from '../../config/upload.file.config';

// @Injectable()
// export class DynamicFileFieldsInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const req = context.switchToHttp().getRequest();
//     const combinations = req.body.combinations;

//     // Generate the dynamic field configuration
//     const combinationFields: MulterField[] = combinations.map((_, index) => ({
//       name: `combinations[${index}][colorImages]`,
//       maxCount: 5, // Adjust max count as needed
//     }));

//     const fields: MulterField[] = [
//       { name: 'images', maxCount: 5 },
//       ...combinationFields,
//     ];

//     const fileFieldsInterceptor = FileFieldsInterceptor(fields, generateUploadConfig('products'));
//     return fileFieldsInterceptor(context, next);
//   }
// }
