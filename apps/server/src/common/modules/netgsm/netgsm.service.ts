import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import fs from 'fs/promises';

import { SendSmsDto } from './netgsm.dto';

@Injectable()
export class NetgsmService implements OnModuleInit {
  private readonly logger = new Logger(NetgsmService.name);

  private netgsm = axios.create({
    baseURL: 'https://api.netgsm.com.tr',
  });

  private netgsmConf = {
    appkey: 'xxx',
    password: process.env.NETGSM_PASSWORD,
    usercode: process.env.NETGSM_USERCODE,
  };

  private templateDir = process.cwd() + '/src/templates/sms';
  private templates = new Map<string, string>();

  async loadTemplates() {
    const files = await fs.readdir(this.templateDir);

    for (const file of files) {
      const template = await fs.readFile(this.templateDir + '/' + file, {
        encoding: 'utf-8',
      });

      const templateName = file.split('.')[0];

      const templateContent = template.replace(/\r\n/g, '\n');

      this.templates.set(templateName, templateContent);
    }

    this.logger.debug(`Loaded ${this.templates.size} SMS templates`);
  }

  async onModuleInit() {
    this.logger.debug('Initializing NetgsmService...');
    await this.loadTemplates();
  }

  async send(dto: SendSmsDto) {
    let message = '';

    if (typeof dto.message === 'string') {
      message = dto.message;
    } else {
      message = this.templates.get(dto.message.template) || '';
      for (const [key, value] of Object.entries(dto.message.context)) {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    }

    const to = Array.isArray(dto.to) ? dto.to : [dto.to];

    const res = await this.netgsm.post('/sms/send/get', null, {
      params: {
        ...this.netgsmConf,
        dil: 'TR',
        gsmno: to.join(','),
        message,
        msgheader: process.env.NETGSM_USERCODE,
      },
    });

    this.logger.debug(
      `SMS sent to ${to.join(', ')} with message: "${message}" - Response: ${JSON.stringify(res.data)}`,
    );

    return res.data;
  }
}
