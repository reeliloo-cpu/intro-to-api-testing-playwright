import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API - empty state', () => {
    test('all users: should return empty array when no users', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.text();
        expect(responseBody).toBe('[]');
    });
});