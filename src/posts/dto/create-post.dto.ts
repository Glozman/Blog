import { IsIn, IsNumber, IsString, Length } from 'class-validator';
import { STATUS_POST } from '../constants/constants';

export class CreatePostDto {
  @IsString()
  @Length(1, 32)
  readonly title: string;
  @IsString()
  @Length(1, 200)
  readonly content: string;
  @IsIn([
    STATUS_POST.DRAFTED,
    STATUS_POST.PUBLISHED,
    STATUS_POST.WAITING_FOR_REVIEW,
  ])
  readonly status: string;
  @IsNumber()
  readonly userId: number;
}
