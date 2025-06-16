// client-factory.ts

import { DactolyClient } from '~/dactoly';

let globalClient: DactolyClient;

export function getGlobalClient(): DactolyClient {
  if (!globalClient) {
    throw new Error('Global DactolyClient is not set. Please call setGlobalClient first.');
  }

  return globalClient;
}

export function setGlobalClient(client: DactolyClient): void {
  globalClient = client;
}
