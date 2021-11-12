import { useSession } from "next-auth/react"
import * as React from "react"

export function Permission({ children, permission, disabled }: PermissionProps) {
  const { data: session } = useSession()

  if(disabled || typeof permission === 'undefined') return <>{children}</>

  return session && (session.role & permission) ? <>{children}</> : null
}

type PermissionProps = {
  children?: React.ReactNode
  permission?: number
  disabled?: boolean
}
