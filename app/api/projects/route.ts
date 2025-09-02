import { NextRequest, NextResponse } from 'next/server';
import * as idb from '@/lib/idb';
import { Project } from '@/lib/types';

export async function GET() {
  try {
    const projects = await idb.getProjects();
    const sections = await idb.getSections();
    const clips = await idb.getClips();

    // Reconstruct projects with their sections and clips
    const reconstructedProjects = projects.map((project) => ({
      ...project,
      sections: sections.filter((s) => s.projectId === project.id),
      clips: clips.filter((c) => c.projectId === project.id),
    }));

    return NextResponse.json(reconstructedProjects);
  } catch (error) {
    console.error('Failed to get projects:', error);
    return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, bpm, key } = body;

    const now = Date.now();
    const projectId = crypto.randomUUID();
    const project: Project = {
      id: projectId,
      title: title || 'Untitled Project',
      bpm: bpm || 120,
      key: key || 'C',
      createdAt: now,
      updatedAt: now,
      sections: [
        {
          id: crypto.randomUUID(),
          projectId: projectId,
          name: 'verse',
          text: '',
        },
        {
          id: crypto.randomUUID(),
          projectId: projectId,
          name: 'chorus',
          text: '',
        },
      ],
      clips: [],
    };

    await idb.addProject(project);
    project.sections.forEach((section) => idb.addSection(section));

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const now = Date.now();
    const updatedProject = { ...updates, updatedAt: now };

    await idb.updateProject(id, updatedProject);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await idb.deleteProject(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
