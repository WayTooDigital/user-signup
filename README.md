# User Signup

### The idea of this package is to simplify and re-use the user authentication flow with a Solana wallet and a backend project using Express (NodeJs).

This package requires MongoDB .

1. Install the package in your ongoing project
   ```bash
   $ yarn add https://github.com/WayTooDigital/user-signup
   ```
   Now you will see that your `package.json` file has a new record:
   ```json
   "user-signup": "https://github.com/WayTooDigital/user-signup"
   ```
2. Edit the file with router definitions (commonly app.js) and add this lines
   ```js
   import { router as userRouter } from "user-signup";
   ...
   app.use("/", userRouter);
   ```
3. You will have to have several variables defined into your .env file which indicates DB connections and a secret for JWT.
   ```bash
   DB_PROTOCOL=
   DB_HOST=
   DB_USER=
   DB_PASS=
   DB_NAME=
   
   JWT_SECRET=
   ```

## Available endpoints

Once you've installed and configured this package into your ongoing project, your API should be able to receive these requests:

### POST `/users`

Store new users into the database.<br>
Receives two `body` parameters:
- message: Should be a generic message containing the wallet address and the Nonce, for example: 
   ```
   This request will not trigger a blockchain transaction or cost any gas fees.\nYour authentication status will be reset after 15 days.\n\nWallet address: ${walletAddress}\n\nNonce: ${nonce}
   ```
- signedMessage: it's the signed message with the Solana wallet.

This endpoint will return a JWT.

### POST `/nonces`

Temporary register a wallet address and associate it with a new nonce (numeric random code).<br>
Receives one `body` parameter:
- walletAddress

## Middleware

The `authMiddleware` will validate if the requests contains the JWT in the `Authorization` key of the header. If the validation pass, the user ID will be stored in the variable `res.locals.user_id`, in order to be accesed by your application whenever you need to.
In your project, you will need to add this lines:
   ```js
   import { authMiddleware } from "user-signup";
   ...
   app.use(authMiddleware);
   ```