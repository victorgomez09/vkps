import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { DeploymentRequestDto } from './deployment.dto';
import { DeploymentService } from './deployment.service';

@WebSocketGateway({
  namespace: 'deployments',
  cors: { origin: ['http://localhost:4200'] },
})
export class DeploymentGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private deploymentService: DeploymentService) {}

  @SubscribeMessage('createDeployment')
  async handleCreateDeployment(
    socket: Socket,
    deploymentData: DeploymentRequestDto,
  ) {
    this.deploymentService.create(deploymentData);
  }
}
