import { APIRequestContext } from 'playwright-core'
import { Login } from '../dto/login-dto'
import { baseUrl, loginEndpoint, ordersEndpoint } from '../tests/auth.spec'
import { StatusCodes } from 'http-status-codes'
import { expect } from '@playwright/test'
import { OrderSchema } from '../contracts/order-contracts'



export async function fetchJwt(request: APIRequestContext, login: Login): Promise<string> {
    const authResponse = await request.post(baseUrl + loginEndpoint, {
        data: login,
    })
    if (authResponse.status() !== StatusCodes.OK) {
        throw new Error(`Authorization failed. Status: ${authResponse.status()}`)
    }
    return await authResponse.text()
}

export async function createOrder(request: APIRequestContext, jwt: string): Promise<number> {
    const response = await request.post(baseUrl + ordersEndpoint, {
        data:
            {
                "status": "OPEN",
                "courierId": 0,
                "customerName": "jana",
                "customerPhone": "09868757",
                "comment": "hello",
                "id": 0
            },
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    })
    expect(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    // lets verify response for schema
    OrderSchema.parse(responseBody)
    return responseBody.id
}