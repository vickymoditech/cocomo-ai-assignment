import * as fal from "@fal-ai/serverless-client";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { basename, resolve } from "path";
import { promises as fs } from 'fs'; // Using fs promises to handle async/await

// Set up the FAL client
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
});

type falResponse = {
  images: {
    url: string;
  }[];
}

export async function GET(): Promise<NextResponse> {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { title, dueDate }: { title: string; dueDate: Date } = await request.json();
    if (!title || title.trim() === '' || !dueDate) {
      return NextResponse.json({ error: 'title and dueDate are required' }, { status: 400 });
    }

    const todoCreate: any = {
      title,
      dueDate,
    }

    const imagePath = await fetchImage(title);
    if (imagePath) todoCreate.imageUrl = imagePath

    const todo = await prisma.todo.create({
      data: todoCreate,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to create a new todo:", error);
    return NextResponse.json({ error: 'Error creating todo' }, { status: 500 });
  }
}

// fetch an image using FAL AI
const fetchImage = async (title: string): Promise<null | string> => {
  const { images }: falResponse = await fal.subscribe("fal-ai/flux/dev", {
    input: {
      prompt: `generate an image of ${title}`,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });

  if (!images || images.length === 0) {
    // If no image is generated, die silently and return null
    return null;
  }

  // Download the image save it to the server
  const imageUrl = images[0].url;
  const savePath = resolve('public/images/');

  // Download the image and save it to the specified path
  return await downloadImage(imageUrl, savePath);

}

// Download an image from a URL and save it to the specified path
const downloadImage = async (url: string, savePath: string): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }

  // Convert the response body to a buffer
  const buffer = await response.arrayBuffer();

  // Extract the original file name from the URL
  const imageName = basename(url);
  const filePath = resolve(savePath, imageName);

  // Write the buffer to the file using the original image name
  await fs.writeFile(filePath, Buffer.from(buffer));

  console.log(`Image saved to ${filePath}`);

  return imageName;
}