import {
  OperationEnum,
  type ILoginBody,
  type ILoginResponse,
  type IOperationResponse
} from './types'
import axios, { type AxiosResponse } from 'axios'
import { stringify } from 'qs'

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL
export const loginRequest = async (email: string, password: string): Promise<ILoginResponse> => {
  const body: ILoginBody = {
    email: email,
    password: password
  }
  const { data }: AxiosResponse<ILoginResponse> = await axios.post(
    `${API_BASE_URL}/users/token/`,
    stringify(body),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  return data
}

export const operationRequest = async (
  values: string[],
  operator: OperationEnum,
  token: string
): Promise<IOperationResponse> => {
  const operator2OperationType = {
    [OperationEnum.SUM]: 'ADDITION',
    [OperationEnum.SUB]: 'SUBTRACTION',
    [OperationEnum.MUL]: 'MULTIPLICATION',
    [OperationEnum.DIV]: 'DIVISION',
    [OperationEnum.SQRT]: 'SQUARE_ROOT',
    [OperationEnum.RS]: 'RANDOM_STRING'
  }
  const body = {
    operation_type: operator2OperationType[operator],
    operation_input: values
  }
  const { data }: AxiosResponse<IOperationResponse> = await axios.post(
    `${API_BASE_URL}/records/`,
    body,
    { headers: { Authorization: `Token ${token}` } }
  )

  return data
}
