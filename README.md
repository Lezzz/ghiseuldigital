# Ghișeul Digital

Built with Prisma/Postgres, Express, React, Node (PERN stack).

Test it out here: [https://ghd-client.fly.dev/](https://ghd-client.fly.dev/)

## How it works

- 🐝 [Wasp](https://wasp-lang.dev) - allows you to build full-stack apps with 10x less boilerplate
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - CSS that's easy to work with
- 🤖 [OpenAI](https://openai.com/) - GPT-3.5 turbo API
- 💸 [Stripe](https://stripe.com/) - for payments
- 📧 [SendGrid](https://sendgrid.com/) - for email

[Wasp](https://wasp-lang.dev) as the full-stack framework allows you to describe your app’s core features in the `main.wasp` config file in the root directory. Then it builds and glues these features into a React-Express-Prisma app for you so that you can focus on writing the client and server-side logic instead of configuring. For example, I did not have to use any third-party libraries for Google Authentication. I just wrote a couple lines of code in the config file stating that I want to use Google Auth, and Wasp configures it for me. Check out the comments `main.wasp` file for more.

[Stripe](https://stripe.com/) makes the payment functionality super easy. I just used their `Subscription` feature. After the user pays, their `hasPaid` and `datePaid` fields are updated in the database via the webhook found in the `src/server/webhooks.ts` file. 

[Wasp's integrated Jobs](https://wasp-lang.dev/docs/language/features#jobs) feature is used to run a cron job every week to send an newsletter email. I used [SendGrid](https://sendgrid.com/) for the email service.

If you have any other questions, feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/valentinlazureanu/) or in the [Wasp Discord server](https://discord.gg/rzdnErX).
