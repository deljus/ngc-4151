import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import * as React from "react"

export function usePermission(permission: number) {
  const router = useRouter()
  const { data: session } = useSession()

  React.useEffect(() => {
    if (session?.role && !Boolean(session.role & permission)) {
      router.push("/403")
    }
  }, [permission, router, session])
}
