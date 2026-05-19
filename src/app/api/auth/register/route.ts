import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';

export async function POST(req: Request) {
  try {
    const { email, password, language, level, dailyMinutes } = await req.json();

    if (!email || !password || !language) {
      return NextResponse.json(
        { error: 'Email, password, and target language are required.' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        language,
        level: level || 'A1',
        dailyMinutes: dailyMinutes || 15,
      },
    });

    // TODO: In the background, or directly, trigger the LangGraph flow here to generate their Course plan
    // For now, we'll return successful auth token.

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        language: user.language,
        level: user.level,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
        { error: error.message || "Failed to register" }, 
        { status: 500 }
    );
  }
}
