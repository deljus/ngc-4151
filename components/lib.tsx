import NextLink, { LinkProps as NextLinkProps } from "next/link"
import * as React from "react"

export function Link({ children, className, ...rest }: LinkProps) {
  return (
    <NextLink passHref {...rest}>
      <a className={className}>{children}</a>
    </NextLink>
  )
}

type LinkProps = {
  children: React.ReactNode
  className?: string
} & NextLinkProps

export function Error({ onRefetch }: ErrorProps) {
  return (
    <div className="w-full h-full flex items-start justify-center pt-10 lg:pt-20">
      <div className="alert alert-error">
        <div className="flex-1">
          😩 <label>Что то пошло не так!</label>
        </div>
        {onRefetch ? (
          <div className="ml-4 flex-none">
            <button className="btn btn-sm btn-ghost" onClick={onRefetch}>Попробовать снова</button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

type ErrorProps = {
  onRefetch?: () => void
}
