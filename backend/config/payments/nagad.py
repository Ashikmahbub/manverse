import requests

def nagad_payment(amount, order_id):
    payload = {
        "amount": amount,
        "orderId": order_id,
        "currency": "BDT"
    }
    response = requests.post(
        "https://sandbox.mynagad.com/api/checkout",
        json=payload
    )
    return response.json()
