// app/root.tsx
import tailwindCSS from "~/styles/tailwind.css";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { AppBar } from './components/AppBar';
import { ContextProvider } from "./contexts/ContextProvider";

import stylesUrl from "~/styles/globals.css";
import walletstylesUrl from "@solana/wallet-adapter-react-ui/styles.css";


// app/root.tsx
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindCSS },
    { rel: 'stylesheet', href: stylesUrl },
    { rel: 'stylesheet', href: walletstylesUrl },];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <Meta />
        <Links />
      </head>
      <body>
        <ContextProvider>
          <div className="flex flex-col h-screen">
            <AppBar />
            <Outlet />
          </div>
        </ContextProvider>
        {/* <Outlet /> */}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

