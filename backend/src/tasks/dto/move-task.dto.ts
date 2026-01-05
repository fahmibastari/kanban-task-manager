import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class MoveTaskDto {
    @IsOptional()
    @IsString()
    status?: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    newOrder: number;
}
