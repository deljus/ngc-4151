import { ChevronDownIcon } from "@heroicons/react/outline"
import * as React from "react"
import { useMutation, useQuery } from "react-query"
import { debounce } from "ts-debounce"

import { api } from "@/utils/api"

const prepareString = ({ lastName, name, middleName }: SearchProfile) =>
  `${lastName} ${name} ${middleName}`

export const SearchSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(
  (
    { queryKey, value, url, searchParams = {}, defaultValue, placeholder, name, onChange, ...rest },
    ref
  ) => {
    const { mutate, data } = useMutation<SearchProfile[], HTTPError, string>(
      queryKey,
      (search) => api.get(url, { searchParams: { search, ...searchParams } }).json(),
      {}
    )
    const [selectedValue, setValue] = React.useState(defaultValue)

    React.useEffect(() => {
      mutate("")
    }, [mutate])

    React.useEffect(() => {
      if (onChange && selectedValue) {
        onChange({
          target: {
            type: "change",
            name,
            value: selectedValue.id,
          },
        })
      }
    }, [selectedValue, onChange, name])

    const searchFn = debounce(mutate, 300)

    return (
      <div className="dropdown" ref={ref}>
        <div tabIndex={0} className="input input-bordered flex justify-between items-center">
          <span>
            {(selectedValue && prepareString(selectedValue)) || (
              <span className="opacity-50">{placeholder}</span>
            )}
          </span>
          <ChevronDownIcon className="w-4 h-4" />
        </div>
        <ul
          tabIndex={0}
          className="p-2 w-full shadow menu dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <input
              className="input input-bordered"
              placeholder="Поиск..."
              onChange={(e) => searchFn(e.target.value)}
            />
          </li>
          {data
            ? data.map((value) => (
                <li key={`${queryKey}-${value.id}`} onClick={() => setValue(value)}>
                  <a>{prepareString(value)}</a>
                </li>
              ))
            : "Ничего не найдено"}
        </ul>
      </div>
    )
  }
)

type ChangeHandler = (event: { target: any; type?: any }) => Promise<void | boolean>

type SearchProfile = {
  id: string
  lastName: string
  name: string
  middleName: string
}

type SearchSelectProps = {
  placeholder: string
  queryKey: string
  defaultValue: SearchProfile | null
  value?: string
  url: string
  searchParams?: {
    [key: string]: string | number
  }
  name: string
  onChange: ChangeHandler
  onBlur: ChangeHandler
}
