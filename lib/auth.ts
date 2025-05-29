import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  name: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Extract token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check for token in cookies
  const tokenCookie = request.cookies.get('token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

// Get user from request
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

// Demo credentials
export const DEMO_CREDENTIALS = {
  student: {
    email: process.env.DEMO_STUDENT_EMAIL || 'student@campusconnect.edu',
    password: process.env.DEMO_STUDENT_PASSWORD || 'student123',
    name: 'John Student',
    role: 'student' as const,
    department: 'Computer Science',
    studentId: 'CS2024001'
  },
  faculty: {
    email: process.env.DEMO_FACULTY_EMAIL || 'faculty@campusconnect.edu',
    password: process.env.DEMO_FACULTY_PASSWORD || 'faculty123',
    name: 'Dr. Jane Faculty',
    role: 'faculty' as const,
    department: 'Computer Science',
    facultyId: 'FAC2024001'
  },
  admin: {
    email: process.env.DEMO_ADMIN_EMAIL || 'admin@campusconnect.edu',
    password: process.env.DEMO_ADMIN_PASSWORD || 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    department: 'Administration'
  }
};

// Check if email is a demo account
export function isDemoAccount(email: string): boolean {
  return Object.values(DEMO_CREDENTIALS).some(cred => cred.email === email);
}

// Get demo account by email
export function getDemoAccount(email: string) {
  return Object.values(DEMO_CREDENTIALS).find(cred => cred.email === email);
}
