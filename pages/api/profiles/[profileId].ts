import Joi from "joi";
import { getSession } from "next-auth/react"

import { prisma } from "@/db"
import { authConnect } from "@/utils/middlewares/common"
import {validate} from "@/utils/middlewares/lib";

const schema = Joi.object({
  profileId: Joi.string().required(),
});

export default authConnect()
  .get(validate({query:schema}), async (req, res) => {

    const profile = await prisma.profile.findFirst({
      where: {
        id: req.query.profileId as string,
      },
      include: {
        spouse: true,
        father: true,
        mother: true,
        formerSpouses: true,
      },
    })

    return res.json(profile)
  })
  .post(async (req, res) => {
    const { userId } = (await getSession({ req })) as ServerSession

    const profile = await prisma.profile.upsert({
      where: {
        userId,
      },
      update: {
        ...req.body,
      },
      create: {
        userId,
        ...req.body,
      },
    })

    return res.json(profile)
  })