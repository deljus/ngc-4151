import {XIcon} from "@heroicons/react/outline";
import {Profile} from "@prisma/client";
import {useRouter} from "next/router";
import * as React from "react";
import {useForm} from "react-hook-form";
import InputMask from "react-input-mask";
import {useMutation, useQuery, useQueryClient} from "react-query";

import {FormControl} from "@/components/form-groups";
import {SearchSelect} from "@/pages-lib/search-select";
import {api} from "@/utils/api";
import {FETCH_ONCE, GENDER, QUERY_KEYS} from "@/utils/const";
import {formToReq} from "@/utils/helpers";

const prepareDefaultValue = (profile?: Profile) => (field: keyof Profile) => {
    if (profile && profile[field]) {
        if (typeof profile[field] !== "number") {
            return String(profile[field])
        }
        return Number(profile[field])
    }
}

export default function EditProfileView() {
    const queryClient = useQueryClient()
    const {data:profile} = useQuery<Profile, HTTPError>(
        QUERY_KEYS.PROFILE_QUERY,
        () => api.get("profile").json(),
        {
            initialData: () => queryClient.getQueryData(QUERY_KEYS.PROFILE_QUERY),
            ...FETCH_ONCE
        }
    )

    const router = useRouter();
    const { register, handleSubmit } = useForm()


    const { mutate } = useMutation<unknown, HTTPError, Profile, Profile>(
        QUERY_KEYS.PROFILE_MUTATION,
        (json) => api.post("profile", { json }).json(),
        {
            onMutate: async (data) => {
                await queryClient.cancelQueries(QUERY_KEYS.PROFILE_QUERY)
                const previousTodos = queryClient.getQueryData(QUERY_KEYS.PROFILE_QUERY)
                queryClient.setQueryData(QUERY_KEYS.PROFILE_QUERY, { ...data })
                return data
            },
            onError: (err, newTodo, context) => {
                queryClient.setQueryData(QUERY_KEYS.PROFILE_QUERY, context)
            },
            onSettled: () => {
                queryClient.invalidateQueries(QUERY_KEYS.PROFILE_QUERY)
            },
        }
    )

    const onSubmit = (data: Profile) => {
        // @ts-ignore
        mutate(formToReq(data))
        router.back()
    }

    const defaultValue = prepareDefaultValue(profile)

    return (
        <div className="p-2 lg:p-10">
            <div className="flex items-center justify-between mb-4">
                <h1>Редактировать профиль</h1>
                <button
                    className="btn btn-outline btn-circle btn-sm"
                    onClick={() => router.push('/profile')}
                >
                    <XIcon className="h-4 w-4" />
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
                    <FormControl label="Фамилия">
                        <input
                            className="input input-bordered"
                            {...register("lastName")}
                            defaultValue={defaultValue("lastName")}
                        />
                    </FormControl>
                    <FormControl label="Имя">
                        <input
                            className="input input-bordered"
                            {...register("name")}
                            defaultValue={defaultValue("name")}
                        />
                    </FormControl>
                    <FormControl label="Отчество">
                        <input
                            className="input input-bordered"
                            {...register("middleName")}
                            defaultValue={defaultValue("middleName")}
                        />
                    </FormControl>
                    <FormControl label="Дата рождения">
                        <InputMask
                            className="input input-bordered"
                            mask="99/99/9999"
                            placeholder="dd/mm/yyyy"
                        />
                    </FormControl>
                    <FormControl label="Пол">
                        <select
                            className="select select-bordered w-full max-w-xs"
                            defaultValue={defaultValue("gender")}
                        >
                            <option value={GENDER.MAN}>♂️</option>
                            <option value={GENDER.WOMEN}>♀ </option>
                        </select>
                    </FormControl>
                    <FormControl label="Телефон">
                        <InputMask
                            className="input input-bordered"
                            mask="+7 (999) 999-9999"
                            placeholder="+7 (XXX) XXX-XXXX"
                            defaultValue={defaultValue("phone")}
                            {...register("phone")}
                        />
                    </FormControl>
                    <FormControl label="Супруг(а)">
                        <SearchSelect
                            queryKey="spouse"
                            url="profile/all"
                            defaultValue={profile?.spouse}
                            {...register("spouseId")}
                            placeholder="Выберите супруга..."
                        />
                    </FormControl>
                    <FormControl label="Отец">
                        <SearchSelect
                            queryKey="father"
                            url="profile/all"
                            searchParams={{ gender: GENDER.MAN }}
                            defaultValue={profile?.father}
                            {...register("fatherId")}
                            placeholder="Отец..."
                        />
                    </FormControl>
                    <FormControl label="Мать">
                        <SearchSelect
                            queryKey="mother"
                            url="profile/all"
                            searchParams={{ gender: GENDER.WOMEN }}
                            defaultValue={profile?.mother}
                            {...register("motherId")}
                            placeholder="Мать..."
                        />
                    </FormControl>

                    <FormControl label="Место жительства" className="md:col-span-2 lg:col-span-3">
                        <input className="input input-bordered" {...register("address")} defaultValue={defaultValue('address')} />
                    </FormControl>
                    <FormControl label="О себе" className="md:col-span-2 lg:col-span-3">
            <textarea
                className="textarea h-24 textarea-bordered"
                placeholder="О себе..."
                defaultValue={defaultValue('about')}
                {...register("about")}
            />
                    </FormControl>
                    <FormControl label="Место работы" className="md:col-span-2 lg:col-span-3">
            <textarea
                className="textarea h-24 textarea-bordered"
                placeholder="Место работы..."
                defaultValue={defaultValue('placeOfWork')}
                {...register("placeOfWork")}
            />
                    </FormControl>
                </div>

                <button type="submit" className="btn btn-primary">
                    Применить
                </button>
            </form>
        </div>
    )
}