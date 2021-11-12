import multer from "multer"
import { getSession } from "next-auth/react"

import { prisma } from "@/db"
import { authConnect } from "@/utils/middlewares/common"

const upload = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            const session = await getSession({ req })
            cb(null, `./public/uploads/photo/${session?.userId}/`)
        },
        filename: async (req, file, cb) => {
            const session = await getSession({ req })
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
            const fileName = `${file.originalname}-${uniqueSuffix}`
            prisma.profile.update({
                data: {
                    avatar: fileName,
                },
                where: {
                    userId: session?.userId,
                },
            })
            cb(null, fileName)
        },
    }),
})

export default authConnect()
    .use(upload.single("theFile"))
    .post((req, res) => {
        res.status(200).json({ data: "success" })
    })

export const config = {
    api: {
        bodyParser: false,
    },
}
