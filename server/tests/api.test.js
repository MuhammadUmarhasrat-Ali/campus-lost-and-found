import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/User.js';

let mongoServer;
let studentToken;
let studentUser;
let adminToken;
let createdItemId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create an admin
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Super Admin',
      email: 'admin_test@campus.edu',
      studentId: 'TEST-ADM',
      department: 'Security',
      academicYear: 'Staff',
      password: 'AdminPassword123!',
      confirmPassword: 'AdminPassword123!',
    });

  // Promote to admin directly in DB for testing
  await User.updateOne({ email: 'admin_test@campus.edu' }, { role: 'admin' });
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin_test@campus.edu',
      password: 'AdminPassword123!',
    });
  adminToken = adminLogin.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Campus Lost & Found Backend APIs', () => {
  it('GET /api/health returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/register successfully registers a new student', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'student_test@campus.edu',
        studentId: 'CS2025999',
        department: 'Computer Science',
        academicYear: 'Year 2',
        phone: '9876543210',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('student_test@campus.edu');
    expect(res.body.data.token).toBeDefined();

    studentToken = res.body.data.token;
    studentUser = res.body.data.user;
  });

  it('POST /api/auth/register rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Student',
        email: 'student_test@campus.edu',
        studentId: 'CS2025888',
        department: 'Civil',
        academicYear: 'Year 1',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login logs in student with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student_test@campus.edu',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('GET /api/auth/me returns profile of logged in student', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('student_test@campus.edu');
  });

  it('POST /api/items creates a lost item report', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${studentToken}`)
      .field('title', 'Blue Hydro Flask Bottle')
      .field('description', 'Left my Hydro Flask on the 3rd floor library desk')
      .field('category', 'Water Bottles')
      .field('type', 'lost')
      .field('location', 'Library Floor 3')
      .field('eventDate', new Date().toISOString())
      .field('eventTime', '2:00 PM');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item.title).toBe('Blue Hydro Flask Bottle');
    expect(res.body.data.item.status).toBe('active');

    createdItemId = res.body.data.item._id;
  });

  it('GET /api/items returns items with pagination and search', async () => {
    const res = await request(app)
      .get('/api/items')
      .query({ search: 'Hydro', category: 'Water Bottles' });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.pagination.totalItems).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/items/stats returns aggregate metrics', async () => {
    const res = await request(app).get('/api/items/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.totalLost).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/items/:id returns specific item details', async () => {
    const res = await request(app).get(`/api/items/${createdItemId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.item._id).toBe(createdItemId);
  });

  it('PATCH /api/items/:id/status updates status to claimed', async () => {
    const res = await request(app)
      .patch(`/api/items/${createdItemId}/status`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'claimed' });

    expect(res.status).toBe(200);
    expect(res.body.data.item.status).toBe('claimed');
  });

  it('POST /api/contact-requests creates a new claim request', async () => {
    // Admin sends a contact request on student's item
    const res = await request(app)
      .post('/api/contact-requests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        itemId: createdItemId,
        message: 'Hello, this is campus admin inquiring about the Hydro Flask bottle.',
        phone: '1234567890',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/contact-requests returns aggregated contact requests with joined details', async () => {
    const res = await request(app)
      .get('/api/contact-requests')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const firstRequest = res.body[0];
    expect(firstRequest).toHaveProperty('item_details');
    expect(firstRequest).toHaveProperty('sender_details');
    expect(firstRequest).toHaveProperty('recipient_details');
    expect(firstRequest.sender_details).not.toHaveProperty('passwordHash');
    expect(firstRequest.recipient_details).not.toHaveProperty('passwordHash');
    expect(firstRequest.item_details).toHaveProperty('title');
    expect(firstRequest.sender_details).toHaveProperty('name');
    expect(firstRequest.recipient_details).toHaveProperty('name');
  });

  it('GET /api/admin/dashboard is blocked for non-admin students', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/dashboard succeeds for administrators', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stats.totalUsers).toBeGreaterThanOrEqual(2);
  });
});
