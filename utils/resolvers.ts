export const LINKS = {
  PROFILE: {
    RESOLVE: (id: string) => `/profiles/${id}`,
  },
  AVATAR: {
    RESOLVE: (id: string, name?: string | null) =>
      name ? `/uploads/avatars/${id}/${name}` : "/avatar.png",
  },
  USERS: {
    RESOLVE: () => '/users'
  },
  PHOTO: {
    RESOLVE: () => '/photo'
  }
}


export const API_LINKS = {
  PROFILE: {
    RESOLVE: (id: string) => `/profiles/${id}`,
  }
}