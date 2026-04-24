import os
import requests
import logging

from app.config import settings

from .base import AIPlatform


logger = logging.getLogger(__name__)

class YandexGPT(AIPlatform):
    def __init__(self, api_key: str, catalog_id: str):
        self.api_key = api_key
        self.catalog_id = catalog_id
        self.url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Api-Key {self.api_key}",
        }
    def chat(self, prompt: str) -> str:
        payload = {
            "modelUri": f"gpt://{self.catalog_id}/yandexgpt-lite",
            "completionOptions": {
                "stream": False,
                "temperature": 0.6,
                "maxTokens": "2000",
            },
            "messages": [
                {"role": "system", "text": prompt},
                {"role": "user", "text": prompt},
            ],
        }
        try:
            response = requests.post(self.url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            return data["result"]["alternatives"][0]["message"]["text"]
        except requests.RequestException as e:
            logger.error(f"Ошибка при запросе к YandexGPT: {e}")
            raise

print(settings.CATALOG_ID, settings.YANDEX_GPT_API)
ai_platform = YandexGPT(api_key=settings.YANDEX_GPT_API, catalog_id=settings.CATALOG_ID)
text = ai_platform.chat("Подбодри меня на русском языке, пожалуйста!")   
print(text)     