FROM python:3.6.8-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8888

CMD ["gunicorn", "--bind", "0.0.0.0:8888", "--workers", "4", "server:app"]
