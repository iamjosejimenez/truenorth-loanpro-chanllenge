interface ILoginBody {
  email: string
  password: string
}

interface ILoginResponse {
  token: string
}

enum OperationEnum {
  SUM = '+',
  MUL = 'x',
  DIV = '/',
  SUB = '-',
  RS = 'RS',
  SQRT = '√'
}

interface IOperationResponse {
  id: number
  operation_response: string
  date: string
  user_balance: number
  amount: number
}

export type { ILoginBody, ILoginResponse, IOperationResponse }

export { OperationEnum }
