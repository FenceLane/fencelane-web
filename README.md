#FenceLane

## Getting Started

### Enable SSL cert locally:

1. install [mkcert](https://github.com/FiloSottile/mkcert)

2. create cert folder in root:

   ```bash
   mkdir cert
   ```

3. install and trust certificate for `local.fencelane.com`:

   ```bash
   mkcert -install && mkcert -cert-file cert/development-cert.pem -key-file cert/development-key.pem "local.fencelane.com"
   ```

### First, run the development server:

```bash
yarn dev
```

Open [https://local.fencelane.com:3000](https://local.fencelane.com:3000) with your browser to see the result.
