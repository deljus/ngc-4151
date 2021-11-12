import { PencilIcon, RefreshIcon } from "@heroicons/react/outline"
import Image from "next/image"
import * as React from "react"
import { useMutation } from "react-query"

import { api } from "@/utils/api"
import { PERMISSION } from "@/utils/const"
import { Permission } from "@/components/permission"
import { useSession } from "next-auth/react"

export function UserAvatar({ profile, onSuccess, isLoadingProfile }: UserAvatarProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const { data: session } = useSession()
  const { mutateAsync, isLoading } = useMutation<unknown, unknown, FormData>(
    ["image-profile", profile?.id],
    (formData) =>
      api
        .post("uploads/avatar", {
          body: formData,
          searchParams: profile?.id ? { profileId: profile?.id } : undefined,
        })
        .json(),
    {
      onSuccess,
    }
  )

  const onClickHandler = (event: React.MouseEvent) => {
    event.preventDefault()
    fileInputRef.current?.click()
  }

  const onChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    if (!event.target.files?.length) {
      return
    }

    const formData = new FormData()
    formData.append(event.target.name, event.target.files[0])
    await mutateAsync(formData)
    formRef.current?.reset()
  }

  return (
    <div className="card shadow compact bg-base-100 relative">
      <form className="absolute top-2 right-2 z-20" ref={formRef}>
        <input
          accept=".jpg, .jpeg, .png"
          multiple={false}
          onChange={onChangeHandler}
          ref={fileInputRef}
          name="theAvatarFile"
          style={{ display: "none" }}
          type="file"
        />
        <Permission
          permission={PERMISSION.EDIT_PROFILES}
          disabled={profile?.userId === session?.userId}
        >
          <button
            className={`btn btn-outline btn-circle btn-sm ${isLoading ? "animate-pulse" : ""}`}
            onClick={onClickHandler}
            disabled={isLoading}
          >
            {isLoading ? <RefreshIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
          </button>
        </Permission>
      </form>
      <figure className="aspect-w-16 aspect-h-9">
        <Image
          src={
            (profile?.avatar && `/uploads/avatars/${profile.id}/${profile?.avatar}`) ||
            "/avatar.png"
          }
          priority
          alt="аватар"
          layout="fill"
          objectFit="cover"
        />
      </figure>
    </div>
  )
}

type UserAvatarProps = {
  profile?: Profile
  isLoadingProfile?: boolean
  onSuccess?: () => void
}
