import {
  OperationEnum,
  SortingDirection,
  type ILoginBody,
  type ILoginResponse,
  type IRecordResponse,
  type IUserBalance,
  type IPagination
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
): Promise<IRecordResponse> => {
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
  const { data }: AxiosResponse<IRecordResponse> = await axios.post(
    `${API_BASE_URL}/records/`,
    body,
    { headers: { Authorization: `Token ${token}` } }
  )

  return data
}

export const getCurrentBalanceRequest = async (token: string): Promise<IUserBalance> => {
  const { data }: AxiosResponse<IUserBalance> = await axios.get(`${API_BASE_URL}/users/balance/`, {
    headers: { Authorization: `Token ${token}` }
  })

  return data
}

export const getUserRecords = async (
  token: string,
  page: number,
  pageSize: number,
  searchInput: string,
  sortConfig: Record<string, SortingDirection>
): Promise<IPagination<IRecordResponse>> => {
  let queryParams = `page=${page}&page_size=${pageSize}`

  if (searchInput) {
    queryParams += `&search=${searchInput}`
  }

  const ordering = []
  for (const [field, sortDirection] of Object.entries(sortConfig)) {
    if (sortDirection === SortingDirection.ASC) {
      ordering.push(field)
    }
    if (sortDirection === SortingDirection.DESC) {
      ordering.push(`-${field}`)
    }
  }

  if (ordering.length) {
    queryParams += `&ordering=${ordering.join(',')}`
  }

  const { data }: AxiosResponse<IPagination<IRecordResponse>> = await axios.get(
    `${API_BASE_URL}/records/?${queryParams}`,
    {
      headers: { Authorization: `Token ${token}` }
    }
  )

  return data
}
