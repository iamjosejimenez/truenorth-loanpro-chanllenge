interface ILoginBody {
  email: string
  password: string
}

interface ILoginResponse {
  token: string
}

interface IUserBalance {
  user_balance: number
}

interface IOperation {
  type: string
}

interface IRecordResponse extends IUserBalance {
  id: number
  operation_response: string
  date: string
  amount: number
  operation: IOperation
}

interface IPagination<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type { ILoginBody, ILoginResponse, IRecordResponse, IPagination, IUserBalance }

enum OperationEnum {
  SUM = '+',
  MUL = 'x',
  DIV = '/',
  SUB = '-',
  RS = 'RS',
  SQRT = '√'
}

enum SortingDirection {
  ASC,
  DESC,
  NO_SORT
}

export { OperationEnum, SortingDirection }
