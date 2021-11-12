type Profile = import('@prisma/client').Profile;

type FormGroupTypes = {
    id: string;
    field: keyof Profile;
    label: string;
    component: "Input",
    "type": "text" | "number",
    "rules": any[]
}

type ServerSession = {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    expires: string;
    userId?: string;
} & Session

type HTTPError = {
    message: string;
}

type ValueOf<T> = T[keyof T];

type ProfileFields = {
    dateOfBirth?: string;
} & Profile;