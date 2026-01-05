import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty({ message: 'Title tidak boleh kosong' })
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty({ message: 'Project ID harus ada' })
    @IsUUID(4, { message: 'Project ID tidak valid' })
    projectId: string;
}
