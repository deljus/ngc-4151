import { ViewGridIcon, ViewListIcon } from "@heroicons/react/outline"
import { debounce } from "debounce"
import Image from "next/image"
import * as React from "react"
import { useInfiniteQuery } from "react-query"

import { Error, Link } from "@/components/lib"
import { api } from "@/utils/api"
import { QUERY_KEYS } from "@/utils/const"
import { LINKS } from "@/utils/resolvers"

const TAKE = 12;

export default function UsersPage() {
  const [search, setSearch] = React.useState('')
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isError,
    isLoading,
  } = useInfiniteQuery<ProfileResponse>(
    [QUERY_KEYS.PROFILES_QUERY, search],
    ({ pageParam = 0 }) =>
      api
        .get("profiles", {
          searchParams: {
            take: TAKE,
            skip: pageParam,
            search,
          },
        })
        .json(),
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
    }
  )

  const handleChange = debounce(({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(target.value);
  }, 500)

  const [isList, setListView] = React.useState(false)

  if (isError) return <Error onRefetch={refetch} />

  return (
    <div className="p-4 lg:p-10">
      <h1>Пользователи</h1>

      <div className="py-10 flex flex-row space-x-4">
        <div className="form-control flex-1">
          <input type="text" placeholder="Найти..." className="input shadow" onChange={handleChange} />
        </div>
        <div className="form-control">
          <button className="btn btn-primary" onClick={() => setListView(!isList)}>
            {isList ? <ViewListIcon className="w-4 h-4" /> : <ViewGridIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${isList ? "" : "md:grid-col-2 lg:grid-cols-3"}`}>
        {data
          ? data.pages.map((page) =>
              page.data.map(({ avatar, id, lastName, name }) => (
                <Link
                  key={`user-${id}`}
                  className={`card ${isList ? "flex flex-row" : ""} bordered`}
                  href={LINKS.PROFILE.RESOLVE(id)}
                >
                  {isList ? (
                    <div className="avatar">
                      <div className="rounded-full w-32 h-18">
                        <Image
                          src={LINKS.AVATAR.RESOLVE(id, avatar)}
                          priority
                          alt="аватар"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <figure className="aspect-w-16 aspect-h-9">
                      <Image
                        src={LINKS.AVATAR.RESOLVE(id, avatar)}
                        priority
                        alt="аватар"
                        layout="fill"
                        objectFit="cover"
                      />
                    </figure>
                  )}

                  <div className="card-body">
                    <h2 className="card-title">{`${lastName} ${name}`}</h2>
                  </div>
                </Link>
              ))
            )
          : null}
      </div>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <span>Загружаем...</span>
        ) : hasNextPage ? (
          <button className="btn btn-outline" onClick={() => fetchNextPage()}>
            Загрузить
          </button>
        ) : null}
      </div>
    </div>
  )
}

type Profile = {
  id: string
  lastName: string | null
  name: string | null
  middleName: string | null
  avatar: string | null
}

type ProfileResponse = {
  data: Profile[]
  nextSkip: number
}
