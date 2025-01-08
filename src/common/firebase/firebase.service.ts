import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  async subscribeToTopic(token: string, topic: string) {
    try {
      await admin.messaging().subscribeToTopic(token, topic);
      return { message: `Subscribed to topic: ${topic}` };
    } catch (error) {
      throw new Error(`Error subscribing to topic: ${error.message}`);
    }
  }

  async subscribeToMultipleTopics(token: string, topics: string[]) {
    const promises = topics.map((topic) =>
      admin.messaging().subscribeToTopic(token, topic),
    );
    try {
      await Promise.all(promises);
      return { message: `Subscribed to multiple topics: ${topics.join(', ')}` };
    } catch (error) {
      throw new Error(`Error subscribing to multiple topics: ${error.message}`);
    }
  }

  async subscribeMultipleDevicesToTopic(tokens: string[], topic: string) {
    try {
      await admin.messaging().subscribeToTopic(tokens, topic);
      return { message: `Multiple devices subscribed to topic: ${topic}` };
    } catch (error) {
      throw new Error(
        `Error subscribing multiple devices to topic: ${error.message}`,
      );
    }
  }
}
