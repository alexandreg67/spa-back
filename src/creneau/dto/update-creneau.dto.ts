import { PartialType } from '@nestjs/swagger';
import { CreateCreneauDto } from './create-creneau.dto';

export class UpdateCreneauDto extends PartialType(CreateCreneauDto) {}
