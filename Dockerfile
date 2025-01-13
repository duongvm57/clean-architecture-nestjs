FROM public.ecr.aws/docker/library/node:18.20.5-alpine as builder

WORKDIR /home

COPY package*.json ./

COPY .husky .husky

RUN npm install

COPY . .
RUN npm run build

FROM public.ecr.aws/docker/library/node:18.20.5-alpine

WORKDIR /home

COPY --from=builder /home /home
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]