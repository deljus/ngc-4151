import "@/styles/globals.css"

import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import * as React from "react"
import { QueryClient, QueryClientProvider } from "react-query"

import { Layout } from "@/components/layout"

const queryClient = new QueryClient()

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
  )
}
