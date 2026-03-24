FROM node:18

# Instruksi wajib dari checklist
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Port yang dipakai app kamu (sesuaikan jika beda)
EXPOSE 3000

CMD ["node", "index.js"]