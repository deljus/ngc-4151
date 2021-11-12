import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import type { RequestHandler } from "next-connect"
import withJoi from "next-joi"

export const auth: RequestHandler<NextApiRequest, NextApiResponse> = async (req, res, next) => {
  const session = await getSession({ req })
  if (session) {
    return next()
  }
  res.status(401).end()
}

export const validate = withJoi({
  onValidationError: (_, res) => {
    return res.status(400).end()
  },
})
