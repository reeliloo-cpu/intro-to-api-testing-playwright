import { test, expect } from "@playwright/test";
import { StatusCodes } from "http-status-codes";

let baseURL: string = "http://localhost:3000/users";

test.describe("User management API", () => {

 test('all users: should return empty array when no users', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });
  test("find user: should return a user by ID", async ({ request }) => {
    const createResponse = await request.post(`${baseURL}`, {
      data: { name: "John", email: "john@example.com" },
    });
    expect(createResponse.status()).toBe(StatusCodes.CREATED);
    const user = await createResponse.json();

    const response = await request.get(`${baseURL}/${user.id}`);
    expect(response.status()).toBe(StatusCodes.OK);
    const body = await response.json();
    expect(body.id).toBe(user.id);
  });

  test("find user: should return 404 if user not found", async ({
    request,
  }) => {
    const response = await request.get(`${baseURL}/99999`);
    expect(response.status()).toBe(StatusCodes.NOT_FOUND);
  });

  test("create user: should add a new user", async ({ request }) => {
    const response = await request.post(`${baseURL}`, {
      data: { name: "Jane", email: "jane@example.com" },
    });
    expect(response.status()).toBe(StatusCodes.CREATED);
    const body = await response.json();
    expect(body.id).toBeDefined();
  });

  test("delete user: should delete a user by ID", async ({ request }) => {
    const createResponse = await request.post(`${baseURL}`, {
      data: { name: "ToDelete", email: "delete@example.com" },
    });
    const user = await createResponse.json();

    const response = await request.delete(`${baseURL}/${user.id}`);
    expect(response.status()).toBe(StatusCodes.OK);
  });

  test("delete user: should return 404 if user not found", async ({
    request,
  }) => {
    const response = await request.delete(`${baseURL}/99999`);
    expect(response.status()).toBe(StatusCodes.NOT_FOUND);
  });
});
