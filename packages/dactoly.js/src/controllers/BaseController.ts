import { DactolyClient } from '~/dactoly';

export class BaseController {
  constructor(protected client: DactolyClient) {}
}
