import asyncio
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List
import os
import json

# Инициализация приложения
app = FastAPI()

# Пути
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")
TESTS_DIR = os.path.join(BASE_DIR, "tests")
os.makedirs(TESTS_DIR, exist_ok=True)

# Настройка шаблонов и статики
templates = Jinja2Templates(directory=TEMPLATES_DIR)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/tests", StaticFiles(directory="tests"), name="tests")

# Модели
class Question(BaseModel):
    question: str
    answers: List[str]

class Test(BaseModel):
    name: str
    questions: List[Question]

# Страница с формой
@app.get("/make_test", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("make_test.html", {"request": request})

# Сохранение теста
@app.post("/save_test/")
async def save_test(test: Test):
    """Сохраняет тест, заменяя старый JSON на новый."""
    # Удаляем все старые файлы тестов, чтобы оставался только один JSON
    for fname in os.listdir(TESTS_DIR):
        if fname.endswith(".json"):
            try:
                os.remove(os.path.join(TESTS_DIR, fname))
            except OSError:
                pass

    file_path = os.path.join(TESTS_DIR, "test.json")

    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(test.dict(), f, ensure_ascii=False, indent=2)
        return {"message": "Тест сохранён", "file": os.path.basename(file_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/test", response_class=HTMLResponse)
def take_test(request: Request):
    return templates.TemplateResponse("take_test.html", {"request": request})

@app.get("/usdt_payment", response_class=HTMLResponse)
async def usdt_payment_page(request: Request, user_id: int):
    return templates.TemplateResponse("usdt_payment_form_rebuilt.html", {
        "request": request,
        "user_id": user_id,
        }
    )

async def app_runner():
    import uvicorn
    config = uvicorn.Config("app:app", host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    asyncio.run(app_runner())

