import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty({ message: 'Nama/Title project tidak boleh kosong' })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
