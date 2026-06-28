import { expect, test } from '@playwright/test'
import { Login } from '../dto/login-dto'
import { createOrder, fetchJwt } from '../helpers/api-helper'

let loginDto: Login
export const baseUrl = 'https://backend.tallinn-learning.ee'
export const loginEndpoint = '/login/student'
export const ordersEndpoint = '/orders'

test.describe.serial('Authorization flow', () => {
  test.beforeAll(() => {
    loginDto = new Login(process.env['DL_USERNAME']!, process.env['DL_PASSWORD']!)
  })

  test('should login and receive authorization token', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)
    expect(token).toBeDefined()
  })

  test('should create order', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)
    await createOrder(request, token)
    const orderId = await createOrder(request, token)
    expect(orderId).toBeDefined()
  })

  test('should not login with invalid credentials', async ({ request }) => {
    const invalidLoginDto = {
      username: 'Bad-user',
      password: 'Bad-password',
    }

    const response = await request.post(baseUrl + loginEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      data: invalidLoginDto,
    })

    expect(response.status()).toBe(401)
  })

  test('should get orders with authorization token', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)

    const response = await request.get(baseUrl + ordersEndpoint, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.status()).toBe(200)
    const orders = await response.json()
    console.log('Orders:', JSON.stringify(orders, null, 2))
    expect(orders).toBeTruthy()
  })
})

test('should not get orders without authorization token', async ({ request }) => {
  const response = await request.get(baseUrl + ordersEndpoint, {
    headers: {
      accept: '*/*',
    },
  })

  expect(response.status()).toBe(401)
})
