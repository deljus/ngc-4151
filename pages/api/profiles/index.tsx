import { getSession } from "next-auth/react"

import { prisma } from "@/db"
import { authConnect } from "@/utils/middlewares/common"

export default authConnect().get(async (req, res) => {
  const session = await getSession({ req })

  if (!session) return res.status(400)

  const { search, take, skip }: Query = req.query

  const data = await prisma.profile.findMany({
    where: {
      OR: [
        {
          lastName: {
            startsWith: String(search),
          },
        },
        {
          name: {
            startsWith: String(search),
          },
        },
      ],
      NOT: {
        id: String(session.profileId),
      },
    },
    select: {
      id: true,
      lastName: true,
      name: true,
      middleName: true,
      avatar: true,
    },
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
  })

  const nextSkip = data.length === Number(take) && skip ? Number(take) + Number(skip) : undefined

  return res.json({ data, nextSkip })
})

type Query = {
  search?: string
  take?: number
  skip?: number
}
