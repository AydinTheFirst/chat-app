import 'reflect-metadata';

import { Client } from '~/client';

describe('Client', () => {
  it('should create a client instance', () => {
    const client = new Client({});
    expect(client).toBeInstanceOf(Client);
  });

  it('should have a default base URL', () => {
    const client = new Client({});
    expect(client.options.baseUrl).toBe('http://localhost:3000');
  });

  it('should allow setting a custom base URL', () => {
    const customUrl = 'http://example.com';
    const client = new Client({ baseUrl: customUrl });
    expect(client.options.baseUrl).toBe(customUrl);
  });
});
