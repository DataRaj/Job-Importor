import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { GlobalGateway } from 'src/common/global.gateway';

@Processor('notification')
@Injectable()
export class NotificationConsumer extends WorkerHost {
  constructor(private  readonly globalGateway:GlobalGateway) {
    super();
  }

  async process(payload: Job<any>): Promise<any> {
    const {targetUserId,statusUserId,status,statusUserName}=payload.data 
    this.globalGateway.emitToUsers([targetUserId],'user-status',{
      userId:statusUserId,
      username: statusUserName,
      status
    })
  }
}
