FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends build-essential ca-certificates && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# These lines are now unnecessary:
# RUN rm -rf static/admin-app || true
# RUN mkdir -p static/admin-app
# COPY --from=node-builder /work/frontend/dist/ static/admin-app/

ENV PORT=10000
EXPOSE 10000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:10000", "--workers", "3"]
