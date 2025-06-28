import { Client } from '~/client';
import { InviteLink } from '~/models';

export class InvitesService {
  constructor(private client: Client) {}

  async create(channelId: string): Promise<InviteLink> {
    const response = await this.client.api.post(`/invites/${channelId}`);
    return InviteLink.fromJSON(response.data);
  }

  async joinByCode(code: string): Promise<InviteLink> {
    const response = await this.client.api.post(`/invites/${code}/join`);
    return InviteLink.fromJSON(response.data);
  }
}
