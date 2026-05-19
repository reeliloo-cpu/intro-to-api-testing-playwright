import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
  const responseBody = await response.json()
  // Log the response status, body and headers
  console.log('response body:', responseBody)
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  expect(response.status()).toBe(200)
  // Check that id field value equals 1
  expect(responseBody.id).toBe(1)
  // Check that status field value is 'OPEN'
  expect(responseBody.status).toBe('OPEN')
})

// Negative scenario with invalid order id of 0
test('get order with incorrect id should receive code 400', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/11')
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

test('post order with correct data should receive code 200', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 10,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  const responseBody = await response.json()
  expect(response.status()).toBe(StatusCodes.OK)
  expect(responseBody.status).toBe('OPEN')
})

test('login test', async ({ request }) => {
  const requestBody = {
    username: 'asd',
    password: 'pw1212412',
  }

  const response = await request.post('https://backend.tallinn-learning.ee/login/student', {
    data: requestBody,
  })

  const responseBody = await response.text()
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

// HomeWork 10  Create a checklist with positive and negative test scenarios covering the following endpoints:
// PUT, DELETE, GET. The description of business rules could be taken from Swagger.

test('GET auth returns API key and login message with response= 200', async ({ request }) => {
  const queryParams = {
    username: 'test',
    password: 'test',
  }

  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/auth', {
    params: queryParams,
  })
  // Response check = 200
  expect(response.status()).toBe(StatusCodes.OK)
})

test('GET auth returns response= 500', async ({ request }) => {
  const queryParams = {
    username: '',
    password: '',
  }

  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/auth', {
    params: queryParams,
  })
  // Response check = 500
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

test('PUT update order and request=200', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'Rudolf',
    customerPhone: '555-555-811',
    comment: 'Reelis homework',
    id: 10,
  }

  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/10', {
    headers: {
      api_key: '1234567891234567',
    },
    data: requestBody,
  })
  // Response check = 200
  expect(response.status()).toBe(StatusCodes.OK)
})

test('PUT request with incorrect api key,response=401', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'Rudolf',
    customerPhone: '555-555-811',
    comment: 'Reelis homework',
    id: 10,
  }

  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/10', {
    headers: {
      api_key: '123456789',
    },
    data: requestBody,
  })
  // Response check = 410
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('DELETE request returns=204', async ({ request }) => {
  const apiKey = '1234567891234567'
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/10', {
    headers: {
      api_key: apiKey,
    },
  })
  // Response check = 204
  expect(response.status()).toBe(StatusCodes.NO_CONTENT)
})

test('DELETE request with incorrect api key,response=401', async ({ request }) => {
  const apiKey = ''
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/10', {
    headers: {
      api_key: apiKey,
    },
  })
  // Response check = 204
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
