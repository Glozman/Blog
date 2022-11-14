import { IsIn, IsOptional, IsString } from 'class-validator';
import { SORT_TYPE } from '../constants/constants';

export class PaginationDto {
  @IsString()
  @IsOptional()
  readonly page: string;
  @IsString()
  @IsOptional()
  @IsIn([SORT_TYPE.ASC, SORT_TYPE.DESC])
  readonly sort: string;
  @IsString()
  @IsOptional()
  readonly userId: string;
}
