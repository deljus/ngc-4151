import { signIn, signOut,useSession } from "next-auth/react"
import * as React from "react"

import { Menu } from "@/components/menu"
import { ThemeDropdown } from "@/components/theme-dropdown"

export function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession()

  React.useEffect(() => {
    if (status === "unauthenticated") {
      signIn().then()
    }
  }, [status]);

  if(status !== "authenticated") {
    return null;
  }

  return (
    <div className="drawer drawer-mobile h-full">
      <input id="main-menu" type="checkbox" className="drawer-toggle" />
      <main className="flex h-screen flex-col flex-grow block bg-base-100 text-base-content drawer-content">
        <div
          id="nav"
          className="inset-x-0 top-0 z-50 w-full transition duration-200 ease-in-out border-b border-base-200 bg-base-100 text-base-content sticky"
        >
          <div className="mx-auto space-x-1 navbar max-w-none">
            <div className="flex-none">
              <label
                htmlFor="main-menu"
                className="btn btn-square btn-ghost drawer-button lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex items-center flex-none lg:hidden"></div>
            <a
              href="https://github.com/saadeghi/daisyui/blob/master/CHANGELOG.md"
              target="_blank"
              rel="nofollow noreferrer"
              className="font-mono text-xs opacity-50 lg:hidden"
            >
              <span className="hidden lg:inline xl:ml-2">
                {process.env.NEXT_PUBLIC_PROJECT_NAME}
              </span>
            </a>
            <div className="flex-1"></div>

            <ThemeDropdown />
            <button className="btn" onClick={() => signOut()}>Выйти</button>

          </div>
        </div>
        <div className="w-full h-full">
          {children}
        </div>
      </main>
      <div className="drawer-side">
        <label htmlFor="main-menu" className="drawer-overlay"></label>
        <aside className="flex flex-col justify-start border-r border-base-200 bg-base-100 text-base-content w-80">
          <div className="sticky inset-x-0 top-0 z-50 hidden w-full py-1 transition duration-200 ease-in-out border-b lg:block border-base-200 bg-base-100">
            <div className="mx-auto space-x-1 navbar max-w-none">
              <div className="flex items-center flex-none"></div>
              <a
                href="https://github.com/saadeghi/daisyui/blob/master/CHANGELOG.md"
                target="_blank"
                rel="nofollow noreferrer"
                className="font-mono text-xs opacity-50"
              >
                <span className="hidden lg:inline xl:ml-2">
                  {process.env.NEXT_PUBLIC_PROJECT_NAME}
                </span>
              </a>
            </div>
          </div>
          <div>
            <Menu />
          </div>
        </aside>
      </div>
    </div>
  )
}

type LayoutProps = {
  children: React.ReactNode
}
