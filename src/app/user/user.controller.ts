import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddressDto } from './dto/create-address.dto';
import { Address } from 'cluster';
import { AuthRequest } from 'src/interfaces/AuthRequest';
import { JwtAuthGuard } from 'src/common/guards/jwtAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateUploadConfig } from 'src/config/upload.file.config';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getUsers')
  @UseGuards(JwtAuthGuard)
  async getAllUser(@Req() req: AuthRequest) {
    console.log('888888888898989');
    
    if(!req || req.user.role !== 'admin'){
      throw new UnauthorizedException('Permission Denied !!')
    }
    return this.userService.getAllUsers();
  }

  @Get('profile')
  async getProfileData(@Req() req: AuthRequest) {
    return this.userService.getProfileData(req.user._id);
  }

  @UseInterceptors(FileInterceptor('image', generateUploadConfig('users')))
  @Patch('profile')
  async updateProfileData(
    @Req() req: AuthRequest,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateData: UpdateProfileDto,
  ) {
    return this.userService.updateProfileData(req.user._id, image, updateData);
  }


}
