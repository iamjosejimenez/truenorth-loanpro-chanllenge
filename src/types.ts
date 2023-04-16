interface ILoginBody {
  email: string
  password: string
}

interface ILoginResponse {
  token: string
}

export type { ILoginBody, ILoginResponse }
