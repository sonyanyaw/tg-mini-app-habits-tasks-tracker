import httpx
from .base import AIPlatform


class Gemini(AIPlatform):
    def __init__(self, worker_url: str):
        self.worker_url = worker_url
    def chat(self, prompt: str) -> str:
        payload = {
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }

        with httpx.Client(timeout=30.0) as client:
            response = client.post(self.worker_url, json=payload)
            response.raise_for_status()
            data = response.json()

        return data["candidates"][0]["content"]["parts"][0]["text"]

