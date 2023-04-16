import type { ILoginBody, ILoginResponse } from './types'
import axios, { type AxiosResponse } from 'axios'
import { stringify } from 'qs'

export const loginRequest = async (email: string, password: string): Promise<ILoginResponse> => {
  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL
  const body = {
    email: email,
    password: password
  }
  const { data }: AxiosResponse<ILoginResponse> = await axios.post(
    `${apiBaseUrl}/users/token/`,
    stringify(body),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  return data
}
