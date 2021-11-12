import fs from 'fs';
import multer from "multer"

import { prisma } from "@/db"
import { authConnect } from "@/utils/middlewares/common"

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const {profileId} = req.query;
      const dir = `./public/uploads/photos/${profileId}/`

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir,  { recursive: true });
      }

      cb(null, dir)
    },
    filename: async (req, file, cb) => {
      const {profileId} = req.query;
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const fileName = `${uniqueSuffix}-${file.originalname}`
      await prisma.profile.update({
        data: {
          avatar: fileName,
        },
        where: {
          id: profileId
        },
      })
      cb(null, fileName)
    },
  }),
})

export default authConnect()
  .use(upload.single("theAvatarFile"))
  .post((req, res) => {
    res.status(200).json({ data: "success" })
  })

export const config = {
  api: {
    bodyParser: false,
  },
}
