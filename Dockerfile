##---STAGE 1---##
FROM node:14 as frontend-build
RUN mkdir app
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY src/ ./src
COPY tailwind*.js ./
COPY public/ ./public
#RUN npm run build-css
RUN npm run build
#RUN cp dist/css/* build/static/css/

##---STAGE 2---##

# Install and build Python dependencies
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9 as backend-build
COPY .env ./
COPY --from=frontend-build /app/frontend/build ./frontend/build  
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY backend/ ./

EXPOSE 80
#CMD ["bin", "bash"]
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "--workers", "4", "backend.main:start"]




