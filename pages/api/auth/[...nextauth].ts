import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE CLIENT VARIABLES NOT FOUND")
}

if(typeof process.env.NEXTAUTH_URL !== 'string') {
  throw new Error("SET NEXTAUTH_URL VARIABLE")
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
  ],
  callbacks: {
    // @ts-ignore
    session: async ({ session, user }) => {
      const profile = await prisma.profile.findUnique({
        where: {
          userId: user.id
        }
      })
      return {...session, userId: user.id, role: user.role, profileId: profile?.id};
    },
  },
  events: {
    createUser: async ({user}) => {
      await prisma.profile.create({
        data: {
          userId: user.id
        }
      })
    }
  }
})