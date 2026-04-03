# backend/config/orders/sslcommerz.py
import requests
from django.conf import settings

class SSLCommerz:
    SANDBOX = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
    LIVE    = "https://securepay.sslcommerz.com/gwprocess/v4/api.php"

    def __init__(self):
        self.store_id  = settings.SSLCOMMERZ_STORE_ID
        self.store_pwd = settings.SSLCOMMERZ_STORE_PASSWORD
        self.is_live   = settings.SSLCOMMERZ_IS_LIVE
        self.url       = self.LIVE if self.is_live else self.SANDBOX

    def initiate(self, payload):
        payload["store_id"]     = self.store_id
        payload["store_passwd"] = self.store_pwd
        payload["currency"]     = "BDT"
        payload["emi_option"]   = 0
        resp = requests.post(self.url, data=payload, timeout=30)
        return resp.json()

    def validate(self, val_id):
        url = (
            "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
            if not self.is_live else
            "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
        )
        resp = requests.get(url, params={
            "val_id":       val_id,
            "store_id":     self.store_id,
            "store_passwd": self.store_pwd,
            "format":       "json",
        }, timeout=30)
        return resp.json()