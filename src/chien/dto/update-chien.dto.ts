import { PartialType } from '@nestjs/swagger';
import { CreateChienDto } from './create-chien.dto';

export class UpdateChienDto extends PartialType(CreateChienDto) {}
