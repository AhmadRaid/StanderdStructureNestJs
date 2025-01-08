import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { AddressDto } from './dto/create-address.dto';
import * as bcrypt from 'bcrypt';
import { uploadStorageFile } from 'src/config/firebase.config';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>,
      ) { }


    async findUserByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async getProfileData(userId:string){
        return await this.userModel.findOne({_id:new Types.ObjectId(userId)}).select('fullName email userName phoneNumber image')
    }

    
    async updateProfileData(
      userId: string,
      image: any,
      updateData: UpdateProfileDto
    ) {
      try {
        // Handle image upload if image is provided
        if (image) {
          const fileName = `${image.originalname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const firebaseImageUrl = await uploadStorageFile(
            fileName,
            'user',
            image.mimetype,
            image.path
          );
    
          updateData.image = firebaseImageUrl;
        }
    
        if (updateData.email) {
          const userExist = await this.userModel.findOne({ email: updateData.email });
          if (userExist && !userExist._id.equals(new Types.ObjectId(userId))) {
            throw new BadRequestException('EMAIL_EXIST');
          }
        }
    
        const user = await this.userModel.findByIdAndUpdate(
          new Types.ObjectId(userId),
          { $set: updateData },
          { new: true, select: 'fullName email userName phoneNumber image' }
        );
    
        if (!user) {
          throw new NotFoundException('USER.NOT_FOUND');
        }
    
        return user;
      } catch (error) {
        console.error('Error updating profile:', error);
        // Re-throw specific errors to ensure proper response handling
        if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
        }
        throw new BadRequestException('Failed to update profile');
      }
    }
    
      

    
}
