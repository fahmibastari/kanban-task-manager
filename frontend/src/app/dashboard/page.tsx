'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import KanbanBoard from '@/components/KanbanBoard';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Project {
    id: string;
    name: string;
}

export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data);
            if (data.length > 0 && !selectedProject) {
                setSelectedProject(data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/projects', { name: newProjectName });
            setProjects((prev) => [...prev, data]);
            setSelectedProject(data.id);
            setIsDialogOpen(false);
            setNewProjectName('');
        } catch (error) {
            console.error('Failed to create project', error);
        }
    };

    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editName, setEditName] = useState('');
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleDeleteProject = async () => {
        if (!selectedProject) return;
        if (!confirm('Are you sure you want to delete this project? All tasks will be lost.')) return;

        try {
            await api.delete(`/projects/${selectedProject}`);
            setProjects((prev) => prev.filter(p => p.id !== selectedProject));
            setSelectedProject(null);
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

    const openEditDialog = () => {
        const proj = projects.find(p => p.id === selectedProject);
        if (proj) {
            setEditingProject(proj);
            setEditName(proj.name);
            setIsEditOpen(true);
        }
    };

    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;
        try {
            const { data } = await api.patch(`/projects/${editingProject.id}`, { name: editName });
            setProjects(prev => prev.map(p => p.id === editingProject.id ? data : p));
            setIsEditOpen(false);
        } catch (error) {
            console.error('Failed to update project', error);
        }
    };

    if (authLoading) return <div className="p-8">Loading session...</div>;
    if (!user) return <div className="p-8">Access Denied</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Task Manager</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Label className="text-lg font-medium">Project:</Label>
                        {projects.length > 0 ? (
                            <>
                                <Select
                                    value={selectedProject || ''}
                                    onValueChange={setSelectedProject}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select Project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedProject && (
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={openEditDialog}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={handleDeleteProject}>
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">No projects yet.</p>
                        )}
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    <Input
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Project</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateProject} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">Save Changes</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {selectedProject ? (
                    <KanbanBoard projectId={selectedProject} />
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        Please select or create a project to view tasks.
                    </div>
                )}
            </main>
        </div>
    );
}
