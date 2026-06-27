/**
 * Data Transfer Object for the Order entity (used by /test-orders).
 */
export class OrderDto {
  id: number
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string

  constructor(
    id: number,
    status: string,
    courierId: number,
    customerName: string,
    customerPhone: string,
    comment: string,
  ) {
    this.id = id
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
  }
}
