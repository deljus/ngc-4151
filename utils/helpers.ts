type FormData = {
    [key: string]: string | undefined
}

export function formToReq<T>(data: FormData) {
    return  Object.keys(data).reduce((acc, key) => {
        return ({...acc, [key]: data[key] ? data[key] : null});
    }, {})
}