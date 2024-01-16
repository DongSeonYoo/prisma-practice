# express-ts-prisma template for me

**base on prisma - postgres**

## start

```shell
git clone https://github.com/DongSeonYoo/express-prisma-template.git

npm install

prisma init

npx prisma db pull # You need to create dotenv

npm run dev
```

## .env

```shell
PORT=

DATABASE_URL=postgresql://janedoe:mypassword@localhost:5432/mydb
```

## structure

```shell
/src
├── app.ts
├── configs
│   └── env.ts
├── middlewares
│   └── error-handling.ts
├── routes
│   ├── index.ts
│   └── test.ts
├── server.ts       # entry point
└── utils
    ├── async-wrap.ts
    ├── constants
    │   └── validate-message.ts
    ├── custom-error.ts
    ├── http-status.ts
    ├── response-entity.ts
    └── validater.ts
```
