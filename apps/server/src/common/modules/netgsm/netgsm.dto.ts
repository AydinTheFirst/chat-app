import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

class TemplateMessage {
  @IsObject()
  context: Record<string, string>;

  @IsString()
  template: string;
}

export class SendSmsDto {
  @Type(() => Object)
  @ValidateNested()
  message: string | TemplateMessage;

  @IsString({ each: true })
  to: string | string[];
}
