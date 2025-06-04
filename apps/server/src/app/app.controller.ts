import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index() {
    return {
      environment: process.env.NODE_ENV,
      message: 'Welcome to the server!',
      version: process.env.npm_package_version,
    };
  }
}
