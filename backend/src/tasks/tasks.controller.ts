import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Request() req: any, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(req.user.userId, createTaskDto);
    }

    // Get tasks for a specific project
    // Bisa lewat Query Param atau Param
    // Sesuai plan: GET /projects/:projectId/tasks itu ada di ProjectsController sebenarnya,
    // tapi lebih rapi jika endpoint '/tasks' support filter projectId lewat query.
    // ATAU kita buat route khusus di sini.
    // Mari ikuti Plan: GET /projects/:projectId/tasks disarankan di plan,
    // tapi karena kita di TasksController, lebih RESTful jika GET /tasks?projectId=...
    // User Plan says: GET /projects/:projectId/tasks
    // Mari kita support query param di sini saja untuk kemudahan: GET /tasks?projectId=UUID
    @Get()
    findAll(@Request() req: any, @Query('projectId') projectId: string) {
        return this.tasksService.findAll(req.user.userId, projectId);
    }

    @Patch(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.tasksService.update(req.user.userId, id, updateTaskDto);
    }

    @Patch(':id/move')
    move(
        @Request() req: any,
        @Param('id') id: string,
        @Body() moveTaskDto: MoveTaskDto,
    ) {
        return this.tasksService.move(req.user.userId, id, moveTaskDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.tasksService.remove(req.user.userId, id);
    }
}
