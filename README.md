<a href="https://next-saas-stripe-starter.vercel.app">
  <img alt="SaaS Starter" src="public/social-card.png"/>
  <h1 align="center">Nuxt 3 - SaaS Stripe Starter</h1>
</a>

<p align="center">
  Build and deploy your Nuxt SaaS within minutes !
</p>

## Introduction

Nuxt SaaS Stareter is a **open source boilerplate** and will help you to create your own SaaS website with Nuxt.js. It is built with Nuxt 3, Nuxt UI and Nuxt Content. It is a perfect starting point for your next project.

This template is inspired by:

- [Next SaaS Stripe Starter](https://github.com/mickasmt/next-saas-stripe-starter) - GitHub repository

[The documentation](https://nuxt-saas-stripe-starter.vercel.app) is your go-to resource for configuring and using the starter effectively.

Let's get started and happy coding!

## Installation

- You can start a fresh new project by cloning the repository from GitHub. Run the following command in your terminal

```bash
git clone https://github.com/zxml7777777/fork-nuxt-SaaS-starter
```

- Or, deploy with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdevstack-be%2Fnuxt-saas-stripe-starter)

### Steps

- Install dependencies using pnpm:

```sh
pnpm install
```

- Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

- Start the development server:

```sh
pnpm run dev
```

> [!NOTE]  
> Let's check the [configuration](https://nuxt-saas-stripe-starter.vercel.app/docs/getting-started/authentification) part for update all environment variables before use `pnpm run dev`

## Roadmap

- [ ] Add user Roles
- [ ] Add Admin panel
- [ ] Implement Docs search bar
- [ ] Add a blog

## Tech Stack + Features

### Stack

- [Nuxt 3](https://nuxt.com) - The Intuitive Vue Framework
- [Prisma ORM](https://prisma.io) - Next-generation ORM for Node.js & TypeScript | PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, MongoDB and CockroachDB
- [Sidebase Nuxt Auth](https://sidebase.io/nuxt-auth) - Effortlessly connect your Nuxt 3 application with Google, Github, Azure and countless others.
- [Stripe](https://stripe.com) - Online payment processing for internet businesses

### UI

- [Nuxt UI / TailwindCSS](https://ui.nuxt.com/) – A UI Library for Modern Web Apps
- [Nuxt Image](https://image.nuxt.com/) – Optimized Images for your Nuxt Apps
- [Nuxt Headless UI](https://nuxt.com/modules/headlessui) – Headless UI integration for Nuxt. Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.
- [Pinia Nuxt](https://nuxt.com/modules/pinia) – The Vue Store that you will enjoy using
- [Nuxt Content](https://content.nuxt.com/) – Create a powerful data layer for your application. Use Vue components in Markdown with the MDC syntax.
- [Nuxt OG Image](https://nuxt.com/modules/og-image) – Generate OG Images with Vue templates in Nuxt.

### SEO & Internationalization

- [Nuxt i18n](https://i18n.nuxtjs.org/) – Internationalization for your Nuxt application
- [Nuxt Site Config](https://nuxt.com/modules/site-config) – Unified site configuration for Nuxt with automatic sitemap.xml and robots.txt generation
  - Automatically generates SEO-friendly robots.txt with customizable rules
  - Creates comprehensive sitemap.xml with multi-language support
  - Optimizes for search engines with proper metadata
  - Handles development vs production environment differences

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Resend](https://resend.com/) – A powerful email framework for streamlined email development
- [Neon](https://neon.tech/) – Serverless Postgres with autoscaling, branching, bottomless storage and generous free tier.

### Hooks and Utilities

- `nFormatter` – Format numbers with suffixes like `1.2k` or `1.2M`
- `withoutTrailingSlash` - Remove trailing slashes from URLs
- `hasTrailingSlash` - Check if a URL has a trailing slash

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### Miscellaneous

- [Vercel Analytics](https://vercel.com/analytics) – Track unique visitors, pageviews, and more in a privacy-friendly way

## SEO Configuration

This starter comes with pre-configured SEO settings using the `nuxt-site-config` module:

### Features

- **Automatic robots.txt Generation**: Customized rules for search engines
- **Dynamic Sitemap Generation**: Complete with multi-language support
- **Development Protection**: Prevents indexing of development environments
- **Custom URL Priorities**: Optimized importance levels for different pages

### Configuration

The SEO configuration is located in `nuxt.config.ts` under the `site` property:

```js
site: {
  url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  name: '您的SaaS应用名称',
  description: '专业的SaaS解决方案，满足您的所有需求',
  
  // robots.txt configuration
  robots: {
    enabled: true,
    disableDevRobots: true,
    i18n: true,
    sitemap: true,
    // ... custom rules
  },
  
  // sitemap configuration
  sitemap: {
    enabled: true,
    autoLastmod: true,
    // ... custom settings
  }
}
```

## Author

Created by [@devstack-be](https://www.devstack.be) in 2024, released under the [MIT license](https://github.com/zxml7777777/fork-nuxt-SaaS-starter/blob/main/LICENSE.md).

## Credits

This project was inspired by [Next SaaS Stripe Starter](https://github.com/mickasmt/next-saas-stripe-starter)

This project was also inspired by shadcn's [Taxonomy](https://github.com/shadcn-ui/taxonomy), Steven Tey's [Precedent](https://github.com/steven-tey/precedent), and Antonio Erdeljac's [Next 13 AI SaaS](https://github.com/AntonioErdeljac/next13-ai-saas).

- Shadcn ([@shadcn](https://twitter.com/shadcn))
- Steven Tey ([@steventey](https://twitter.com/steventey))
- Antonio Erdeljac ([@YTCodeAntonio](https://twitter.com/AntonioErdeljac))
