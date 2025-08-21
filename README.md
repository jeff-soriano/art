This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Be sure to use node v18.20.0 as that was the version used to develop this repo. If you have `nvm` installed, you can simply use `nvm install` followed by `nvm use` to get the correct version

Run `npm install`, then run `npm run dev` to start the dev server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also go [here](https://art-six-ashen.vercel.app) to view the latest version hosted on Vercel

## Testing

To run tests, run `npm run test`

## Notes and thoughts

Given the short time frame of this project, and my own limited time as a father of two young kiddos, I decided to use technologies I was familiar with. Namely, Next JS as the React framework, Tailwind CSS for styling, and Jest for testing. For global state management, since this was a simpler project I stored everything within a Provider instead of using something like Redux. For tests, I decided to add simple tests for the core components, such as when the api returns a success vs failure

## Cool stuff

This app uses an infinite scroll, will use system preference for dark mode/light mode, and has accessibility features such as a live region for search results
