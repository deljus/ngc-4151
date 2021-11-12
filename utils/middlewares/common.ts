import { NextApiRequest, NextApiResponse } from "next"
import nextConnect, { Options } from "next-connect"

import { auth } from "@/utils/middlewares/lib"

export function authConnect(options: Options<NextApiRequest, NextApiResponse> = {}) {
  return nextConnect({
    // onError(error, req, res) {
    //   res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
    // },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
    },
    ...options,
  }).use(auth)
}

