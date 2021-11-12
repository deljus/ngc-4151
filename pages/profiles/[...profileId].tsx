import { PencilIcon } from "@heroicons/react/outline"
import { Profile } from "@prisma/client"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import * as React from "react"
import { useQuery } from "react-query"

import { FormControl } from "@/components/form-groups"
import { Error } from "@/components/lib"
import { Loader } from "@/components/loader"
import { Permission } from "@/components/permission"
import { UserAvatar } from "@/pages-lib/user-avatar"
import { api } from "@/utils/api"
import { FETCH_ONCE, GENDER, PERMISSION, QUERY_KEYS } from "@/utils/const"

export default function ProfilePage() {
  const router = useRouter()
  const {
    data: profile,
    refetch,
    isLoading,
    isError,
  } = useQuery<Profile, HTTPError>(
    QUERY_KEYS.PROFILE_QUERY,
    () => api.get(`profiles/${router.query.profileId}`).json(),
    FETCH_ONCE,
  )

  console.log(router.query, profile)

  const { data: session } = useSession()

  if (isLoading) return <Loader />

  if (isError) return <Error onRefetch={refetch} />

  const fullness = fullnessProfile(profile) * 100;

  return (
    <div className="p-2 lg:p-10">
      <h1 className="mb-4">Профиль</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 gap-4">
          <UserAvatar profile={profile} onSuccess={refetch} isLoadingProfile={isLoading} />

          <div className="grid-flow-row shadow stats w-full">
            <div className="stat">
              <div className="stat-title">Заполненность</div>
              <div className="stat-value">
                {`${fullness} %`}
              </div>
              <div className="stat-desc">
                <progress className="progress progress-accent" value={String(fullness)} max="100" />
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">New Users</div>
              <div className="stat-value">4,200</div>
              <div className="stat-desc text-success">↗︎ 400 (22%)</div>
            </div>
            <div className="stat">
              <div className="stat-title">New Registers</div>
              <div className="stat-value">1,200</div>
              <div className="stat-desc text-error">↘︎ 90 (14%)</div>
            </div>
          </div>
        </div>

        <div className="card shadow compact bg-base-100 p-2 lg:p-10 md:col-span-2">
          <div className="flex items-center justify-between">
            <h1 className="mb-2">Основная информация</h1>

            <Permission
              permission={PERMISSION.EDIT_PROFILES}
              disabled={profile?.userId === session?.userId}
            >
              <button
                className="btn btn-outline btn-circle btn-sm"
                onClick={() => router.push(`/profile/edit/${profile?.id}`)}
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </Permission>
          </div>

          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Фамилия">{profile?.lastName}</Field>
            <Field label="Имя">{profile?.name}</Field>
            <Field label="Отчество">{profile?.middleName}</Field>
            <Field label="Пол">{profile?.gender === GENDER.MAN ? "♂️" : "♀️"}</Field>
            <Field label="Телефон">{profile?.phone}</Field>
            <Field label="Дата рождения">{profile?.dateOfBirth}</Field>
            <Field label="Адрес" className="md:col-span-2">
              {profile?.address}
            </Field>
            <Field label="Место работы" className="md:col-span-2">
              {profile?.placeOfWork}
            </Field>
            <Field label="О себе" className="md:col-span-2">
              {profile?.about}
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  children,
  className,
  label,
}: {
  className?: string
  children: React.ReactNode
  label: string
}) {
  return (
    <FormControl label={label} className={className}>
      <span className="px-1">{children || "-"}</span>
    </FormControl>
  )
}

function fullnessProfile(profile?: Profile) {
  if(!profile) return 0;
  const allKeys = Object.keys(profile) as Array<keyof Profile>;
  const fullnessKeys = allKeys.filter(key => profile[key]);
  return fullnessKeys.length / allKeys.length
}
