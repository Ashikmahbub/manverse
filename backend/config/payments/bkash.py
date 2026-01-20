import requests
from decouple import config

def bkash_token():
    url = f"{config('BKASH_BASE_URL')}/checkout/token/grant"
    headers = {
        "username": config("BKASH_USERNAME"),
        "password": config("BKASH_PASSWORD"),
        "Content-Type": "application/json"
    }
    body = {
        "app_key": config("BKASH_APP_KEY"),
        "app_secret": config("BKASH_APP_SECRET")
    }
    return requests.post(url, json=body, headers=headers).json()
def create_bkash_payment(amount, invoice):
    token = bkash_token()
    url = f"{config('BKASH_BASE_URL')}/checkout/payment/create"
    headers = {
        "authorization": token['id_token'],
        "x-app-key": config("BKASH_APP_KEY"),
        "Content-Type": "application/json"
    }
    body = {
        "amount": str(amount),
        "currency": "BDT",
        "intent": "sale",
        "merchantInvoiceNumber": invoice
    }
    return requests.post(url, json=body, headers=headers).json()

def execute_bkash_payment(payment_id):
    token = bkash_token()
    url = f"{config('BKASH_BASE_URL')}/checkout/payment/execute/{payment_id}"
    headers = {
        "authorization": token['id_token'],
        "x-app-key": config("BKASH_APP_KEY")
    }
    return requests.post(url, headers=headers).json()
def query_bkash_payment(payment_id):
    token = bkash_token()
    url = f"{config('BKASH_BASE_URL')}/checkout/payment/query/{payment_id}"
    headers = {
        "authorization": token['id_token'],
        "x-app-key": config("BKASH_APP_KEY")
    }
    return requests.get(url, headers=headers).json()