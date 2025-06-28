/* eslint-disable perfectionist/sort-classes */
import axios, { AxiosInstance } from 'axios';
import { io } from 'socket.io-client';

import { DactolySocket } from '~/events';
import { ChannelService, FriendshipService, MessageService, UserService } from '~/services';
import { ChannelReadStatusService } from '~/services/ChannelReadStatusService';
import { InvitesService } from '~/services/InvitesService';

interface ClientOptions {
  baseUrl?: string;
  token: string;
}

export class Client {
  static instance: Client;

  public api: AxiosInstance;
  public ws: DactolySocket;

  public options: ClientOptions;

  public channels: ChannelService;
  public messages: MessageService;
  public friendships: FriendshipService;
  public users: UserService;
  public readStatus: ChannelReadStatusService;
  public invites: InvitesService;

  constructor(options: ClientOptions) {
    if (!options.baseUrl) {
      options.baseUrl = 'http://localhost:8080';
    }

    this.options = options;

    this.api = axios.create({
      baseURL: options.baseUrl,
      headers: {
        Authorization: `Bearer ${options.token}`,
        'Content-Type': 'application/json',
      },
    });

    this.ws = io(this.options.baseUrl, {
      auth: { token: options.token },
      autoConnect: false,
      transports: ['websocket'],
    });

    this.channels = new ChannelService(this);
    this.messages = new MessageService(this);
    this.friendships = new FriendshipService(this);
    this.users = new UserService(this);
    this.readStatus = new ChannelReadStatusService(this);
    this.invites = new InvitesService(this);

    Client.instance = this;
  }
}
