# Boilerplate SvelteKit et AdonisJS

## Configuration de Pre-commit

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
pre-commit install
pre-commit run --show-diff-on-failure --color=always --all-files
```


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# AdonisJS Slim Starter Kit

This repo contains the smallest possible AdonisJS application with the framework core and the Japa test runner. You can clone this repo to start from a clean state and configure new packages as needed.

## What's included

- TypeScript setup with commands to run the development server using `ts-node + swc` and create a production build.
- ESLint and Prettier setup extending the [AdonisJS tooling config](https://github.com/adonisjs/tooling-config) presets.
- Ace command line framework
- Everything else you get with the core of AdonisJS.

## Usage

By executing the following command, you can create a new app using the `slim` starter kit. The command will perform the following steps.

- Download the repo
- Install dependencies
- Copy `.env.example` to `.env`
- Set the app key using the `node ace generate:key` command.

```sh
npm init adonisjs@latest hello-world -- -K=slim
```


# boilerplate_next_adonis_traefik
# sveltekit-adonis



#commande à faire
``
yarn add @radix-ui/react-popover -W
``
``
node ace migration:run
``
