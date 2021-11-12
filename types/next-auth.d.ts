import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session extends NextAuth.Session {
        userId: string
        role: number
        profileId: string
    }
}