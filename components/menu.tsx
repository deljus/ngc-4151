import {
  AcademicCapIcon,
  CubeTransparentIcon,
  FolderOpenIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/outline"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import * as React from "react"

import { Link } from "@/components/lib"
import { Permission } from "@/components/permission"
import { PERMISSION } from "@/utils/const"
import { LINKS } from "@/utils/resolvers"

export const menuItems = [
  {
    id: "menu-2",
    title: "Пользователи",
    href: LINKS.USERS.RESOLVE(),
    icon: UsersIcon,
  },
  {
    id: "menu-3",
    title: "Мои фото",
    href: LINKS.PHOTO.RESOLVE(),
    icon: FolderOpenIcon,
  },
  {
    id: "menu-4",
    title: "Дерево",
    href: "/tree",
    icon: CubeTransparentIcon,
  },

  {
    id: "menu-5",
    title: "Доступные пользователи",
    href: "/",
    icon: AcademicCapIcon,
    permission: PERMISSION.CREATE_PROFILES | PERMISSION.EDIT_PROFILES | PERMISSION.DELETE_PROFILES,
  },
]

export function Menu() {
  const { asPath } = useRouter()
  const { data: session } = useSession()

  console.log(asPath)

  return (
    <ul className="menu flex flex-col p-4 pt-2 compact">
      <li>
        <Link
          href={`/profiles/${session?.profileId}`}
          className={`capitalize ${session?.profileId && asPath.includes(session.profileId) ? "active" : ""}`}
        >
          <UserIcon className="h-4 w-4 mr-2" />
          Главное
        </Link>
      </li>
      {menuItems.map(({ title, id, icon, href, permission }) => (
        <Permission key={id} permission={permission}>
          <li>
            <Link href={href} className={`capitalize ${asPath === href ? "active" : ""}`}>
              {React.createElement(icon, { className: "h-4 w-4 mr-2" })}
              {title}
            </Link>
          </li>
        </Permission>
      ))}
    </ul>
  )
}
