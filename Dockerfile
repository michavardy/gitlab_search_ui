# Build the React frontend
FROM node:14 as frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY src/ ./src
RUN npm run build

##---##

# Install and build Python dependencies using Poetry
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
WORKDIR /app/backend
COPY fast/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY fast/ ./

##---##

# Serve React Frontend and API
COPY --from=frontend-build /app/frontend/build /app/frontend/build
COPY backend/static /app/static
COPY .env ./

EXPOSE 80
CMD ["bin", "bash"]
#CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "--workers", "4", "${MODULE_NAME}:${VARIABLE_NAME}"]




