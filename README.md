# Checklist for GET /test-orders/auth

| Scenario name                                              | Test data                               |
|------------------------------------------------------------|-----------------------------------------|
| GET auth returns API key and response=200 | username= test<br> password= test       |
| GET auth returns response=500                              | username= '1Test'<br> password= '1Test' |

# Checklist for PUT /test-orders/{id}

| Scenario name                                  | Test data                                                                                                |
|------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| PUT update order and request=200               | orderId = 10 <br>Customer name = Rudolf</br><br>Phone=555-555-811</br><br>Comment = Reelis homework</br> |
| PUT update with incorrect api key,response=401 | incorrect api key                                                                                        |

# Checklist for DELETE /test-orders/{id}

| Scenario name                                    | Test data     |
|--------------------------------------------------|---------------|
| DELETE request returns=204                       | orderId = 10  |
| DELETE request with incorrect api key,response=401 | api_key = ' ' |