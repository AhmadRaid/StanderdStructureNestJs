import {
  Body,
  Controller,
  Get,
  Head,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateUploadConfig } from './config/upload.file.config';
import { uploadStorageFile } from './config/firebase.config';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtOrDeviceAuthGuard } from './common/guards/JwtOrDeviceAuthGuard';
import { JwtOrDeviceRequest } from './interfaces/JwtOrDeviceRequest';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Head()
  handleHeadRequest(): void {}
  @Get()
  getRoot(): string {
    return 'Welcome to the Screens Backend API!';
  }

  // @UseGuards(JwtOrDeviceAuthGuard)
  // @Get('increase-view')
  // increaseView(@Req() req: JwtOrDeviceRequest) {
  //   return this.appService.increaseViewCount(req);
  // }
}
