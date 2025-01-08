import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('subscribe/single-topic')
  async subscribeToTopic(
    @Body('token') token: string,
    @Body('topic') topic: string,
  ) {
    return this.firebaseService.subscribeToTopic(token, topic);
  }

  @Post('subscribe/multiple-topics')
  async subscribeToMultipleTopics(
    @Body('token') token: string,
    @Body('topics') topics: string[],
  ) {
    return this.firebaseService.subscribeToMultipleTopics(token, topics);
  }

  @Post('subscribe/devices-to-topic')
  async subscribeMultipleDevicesToTopic(
    @Body('tokens') tokens: string[],
    @Body('topic') topic: string,
  ) {
    return this.firebaseService.subscribeMultipleDevicesToTopic(tokens, topic);
  }
}
