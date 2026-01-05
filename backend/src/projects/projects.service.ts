import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createProjectDto: CreateProjectDto) {
        return this.prisma.project.create({
            data: {
                ...createProjectDto,
                ownerId: userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.project.findMany({
            where: { ownerId: userId },
        });
    }

    async findOne(userId: string, id: string) {
        const project = await this.prisma.project.findFirst({
            where: { id, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found or you do not have permission');
        }

        return project;
    }

    async update(userId: string, id: string, updateProjectDto: UpdateProjectDto) {
        await this.findOne(userId, id);

        return this.prisma.project.update({
            where: { id },
            data: updateProjectDto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);

        return this.prisma.project.delete({
            where: { id },
        });
    }
}
