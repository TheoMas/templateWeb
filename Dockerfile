FROM node:22

WORKDIR /app

COPY api/package*.json ./
RUN npm install --production

COPY api/ ./

CMD ["npm", "start"]
CMD ["npm", "start"]