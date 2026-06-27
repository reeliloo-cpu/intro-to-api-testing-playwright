import { APIResponse, expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { Product } from '../dto/productDto'

const BASE_URL = 'https://backend.tallinn-learning.ee/products'

const requestBody = {
  id: 900,
  name: 'Car',
  price: 1500,
  createdAt: '2026-03-22T17:36:30.857Z',
}

const header = {
  'X-API-Key': 'my-secret-api-key',
}
const wrongHeader = {
  'X-API-Key': 'my-key',
}

test('Return 401 code when api-key is incorrect', async ({ request }) => {
  const newBody = new Product('Car', 1500)

  const response = await request.post(BASE_URL, {
    headers: wrongHeader,
    data: newBody,
  })

  const statusCode = response.status()

  expect(statusCode).toBe(StatusCodes.UNAUTHORIZED)
})

test('Product creation - Return code 200', async ({ request }) => {
  const response = await request.post(BASE_URL, {
    headers: header,
    data: requestBody,
  })

  const statusCode = response.status()

  expect(statusCode).toBe(StatusCodes.OK)
})

test('Find order with correct ID - Status 200', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')

  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  const responseBody = await response.json()

  expect(response.status()).toBe(200)
  expect(responseBody.id).toBe(1)
  expect(responseBody.status).toBe('OPEN')
})

test('Request with invalid ID - Status -400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/11')

  expect(response.status()).toBe(400)
})
test('Login with incorrect credentials - Status code 401', async ({ request }) => {
  const requestBody = {
    userName: 'testUser',
    password: 'testPassword',
  }
  const response = await request.post('https://backend.tallinn-learning.ee/login/student', {
    data: requestBody,
  })

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('Create order with correct details - Status code 201', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.OK)
})

test('Find product what is not listed - Status code 400 ', async ({ request }) => {
  const productId = 9111
  const response: APIResponse = await request.get(BASE_URL + '/' + productId, {
    headers: header,
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('Request all products - Status code 200', async ({ request }) => {
  const response: APIResponse = await request.get(BASE_URL, {
    headers: header,
  })
  expect(response.status()).toBe(StatusCodes.OK)
})
