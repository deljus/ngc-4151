import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import * as React from "react"

import { LINKS } from "@/utils/resolvers"

export default function Index() {
  const router = useRouter()
  const { data: session } = useSession()

  React.useEffect(() => {
    if (session?.profileId) {
      router.push(LINKS.PROFILE.RESOLVE(session.profileId))
    }
  }, [router, session?.profileId])

  return null
}
