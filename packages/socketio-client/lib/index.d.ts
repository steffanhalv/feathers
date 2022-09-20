import { SocketService } from '@feathersjs/transport-commons/client';
import { Socket } from 'socket.io-client';
import { TransportConnection } from '@feathersjs/feathers';
export { SocketService };
declare module '@feathersjs/feathers/lib/declarations' {
    interface FeathersApplication<Services, Settings> {
        /**
         * The Socket.io client instance. Usually does not need
         * to be accessed directly.
         */
        io?: Socket;
    }
}
export default function socketioClient<Services = any>(connection: Socket, options?: any): TransportConnection<Services>;
