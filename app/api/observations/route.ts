import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../lib/prisma';
import { authOptions } from '../../lib/auth';
import { ObservationType, ObservationCategory, ObservationSeverity } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, category, severity, description, locations, photos } = body;

    // Validate required fields
    if (!title || !type || !category || !severity || !description || !locations || !Array.isArray(locations)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate locations
    if (locations.length === 0) {
      return NextResponse.json(
        { error: 'At least one location must be selected' },
        { status: 400 }
      );
    }

    // Validate enum values
    if (!Object.values(ObservationType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid observation type' },
        { status: 400 }
      );
    }

    if (!Object.values(ObservationCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid observation category' },
        { status: 400 }
      );
    }

    if (!Object.values(ObservationSeverity).includes(severity)) {
      return NextResponse.json(
        { error: 'Invalid observation severity' },
        { status: 400 }
      );
    }

    // Create the observation
    const observation = await prisma.observation.create({
      data: {
        title,
        type,
        category,
        severity,
        description,
        locations: locations.join(', '), // Store locations as a comma-separated string
        user: {
          connect: {
            id: session.user.id,
          },
        },
        photos: {
          create: photos.map((photo: { url: string }) => ({
            url: photo.url,
          })),
        },
      },
      include: {
        user: true,
        photos: true,
      },
    });

    return NextResponse.json(observation);
  } catch (error) {
    console.error('Error creating observation:', error);
    return NextResponse.json(
      { error: 'Failed to create observation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const observations = await prisma.observation.findMany({
      include: {
        user: true,
        photos: true,
        actions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(observations);
  } catch (error) {
    console.error('Error fetching observations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch observations' },
      { status: 500 }
    );
  }
} 