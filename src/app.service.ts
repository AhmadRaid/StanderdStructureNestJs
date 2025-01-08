import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor() {}

  // async increaseViewCount(req: any) {
  //   const now = new Date();
  //   const currentMonth = now.getMonth();
  //   const currentYear = now.getFullYear();
  //   const userId = req.user?._id;
  //   const deviceId = req.deviceId;
  //   let existingVisitor;

  //   if (userId) {
  //     existingVisitor = await this.visitorModel.findOne({
  //       userId,
  //       visitDate: {
  //         $gte: new Date(currentYear, currentMonth, 1),
  //         $lt: new Date(currentYear, currentMonth + 1, 1),
  //       },
  //     });
  //   } else if (deviceId) {
  //     existingVisitor = await this.visitorModel.findOne({
  //       deviceId,
  //       visitDate: {
  //         $gte: new Date(currentYear, currentMonth, 1),
  //         $lt: new Date(currentYear, currentMonth + 1, 1),
  //       },
  //     });
  //   }

  //   if (existingVisitor) {
  //     return null;
  //   }

  //   const visitor = new this.visitorModel({
  //     visitDate: new Date(),
  //     userId: userId || null,
  //     deviceId: deviceId || null,
  //   });

  //   return visitor.save();
  // }
}
