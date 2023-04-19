<script lang="ts">
import CalculatorDigit from '@/components/CalculatorDigit.vue'
import CalculatorOperator from '@/components/CalculatorOperator.vue'
import { OperationEnum } from '@/types'
import { operationRequest, getCurrentBalanceRequest } from '@/api'
import { useAuthStore } from '@/stores/auth'

interface IData {
  displayValue: string
  currentOperator: OperationEnum | null
  operators: object[]
  userWriting: boolean
  userBalance: number
  operator2NumOperands: Record<OperationEnum, number>
  errors: string[]
  operands: string[]
}

export default {
  data(): IData {
    return {
      userBalance: 0,
      displayValue: '0',
      operands: [],
      currentOperator: null,
      userWriting: true,
      operators: [
        [{ sign: OperationEnum.SUM }, { sign: OperationEnum.SUB }, { sign: OperationEnum.MUL }],
        [{ sign: OperationEnum.DIV }, { sign: OperationEnum.RS }, { sign: OperationEnum.SQRT }]
      ],
      operator2NumOperands: {
        [OperationEnum.SUM]: 2,
        [OperationEnum.SUB]: 2,
        [OperationEnum.MUL]: 2,
        [OperationEnum.DIV]: 2,
        [OperationEnum.RS]: 0,
        [OperationEnum.SQRT]: 1
      },
      errors: []
    }
  },
  async mounted() {
    await this.getInitialData()
  },
  methods: {
    async getInitialData() {
      const authStore = useAuthStore()
      const token = authStore.getAuthToken()
      const userBalanceObject = await getCurrentBalanceRequest(token)
      const userBalance = userBalanceObject?.user_balance

      if (!userBalance) {
        return
      }
      this.userBalance = userBalance
    },
    onClickNumber(value: string) {
      if (this.userWriting) {
        if (this.displayValue == '0') {
          this.displayValue = value
          return
        }
        this.displayValue += value
      } else {
        this.userWriting = true
        this.displayValue = value
      }
    },
    checkValidOperation(): boolean {
      return (
        !!this.currentOperator &&
        this.operands.length === this.operator2NumOperands[this.currentOperator]
      )
    },
    async onClickOperator(operator: OperationEnum) {
      if (operator === OperationEnum.RS) {
        this.operands = []
        this.currentOperator = operator
        return this.executeOperation()
      }

      if (!this.userWriting) {
        this.currentOperator = operator
      } else {
        this.operands.push(this.displayValue)
      }
      this.userWriting = false

      let appliedOperator = false
      if (!this.currentOperator) {
        this.currentOperator = operator
        appliedOperator = true
      }
      if (this.checkValidOperation()) {
        await this.executeOperation()
        this.operands = [this.displayValue]
        if (!appliedOperator) {
          this.currentOperator = operator
        }
      } else {
        this.currentOperator = operator
      }
    },
    async executeOperation(): Promise<void> {
      if (!this.checkValidOperation()) return
      try {
        const authStore = useAuthStore()
        const token = authStore.getAuthToken()
        this.displayValue = 'loading...'
        const { operation_response: newDisplayValue, user_balance: newUserBalance } =
          await operationRequest(this.operands, this.currentOperator as OperationEnum, token)

        this.displayValue = newDisplayValue
        this.userBalance = newUserBalance
        this.errors = []
        this.currentOperator = null
      } catch (error: any) {
        this.displayValue = 'error'
        const errors = error.response.data
        this.errors = errors
      }
    },
    async onClickEqual() {
      if (!this.userWriting) return
      this.userWriting = false
      this.operands.push(this.displayValue)
      await this.executeOperation()
      this.operands = [this.displayValue]
    },
    clearDisplay() {
      this.displayValue = '0'
      this.currentOperator = null
      this.userWriting = true
      this.operands = []
    }
  },

  components: { CalculatorOperator, CalculatorDigit }
}
</script>
<template>
  <div class="container page-container">
    <div class="calculator-container">
      <div class="w-100 alert alert-info mt-3" role="alert">
        Balance: {{ userBalance ? `${userBalance.toFixed(2)}$` : 'Make your first operation!' }}
      </div>
      <div class="mt-3 calculator card">
        <input type="text" class="calculator-screen z-depth-1" v-model="displayValue" disabled />
        <div class="calculator-keys">
          <div class="calculator-body">
            <div v-for="operatorRow in operators" class="calculator-row">
              <CalculatorOperator
                v-for="operator in operatorRow"
                v-bind="operator"
                :on-click="onClickOperator"
              />
            </div>
            <div class="calculator-row">
              <CalculatorDigit digit="7" :on-click="onClickNumber" />
              <CalculatorDigit digit="8" :on-click="onClickNumber" />
              <CalculatorDigit digit="9" :on-click="onClickNumber" />
            </div>
            <div class="calculator-row">
              <CalculatorDigit digit="4" :on-click="onClickNumber" />
              <CalculatorDigit digit="5" :on-click="onClickNumber" />
              <CalculatorDigit digit="6" :on-click="onClickNumber" />
            </div>
            <div class="calculator-row">
              <CalculatorDigit digit="1" :on-click="onClickNumber" />
              <CalculatorDigit digit="2" :on-click="onClickNumber" />
              <CalculatorDigit digit="3" :on-click="onClickNumber" />
            </div>
            <div class="calculator-row">
              <CalculatorDigit digit="0" :on-click="onClickNumber" />
              <CalculatorDigit digit="AC" :on-click="clearDisplay" />
              <CalculatorDigit digit="=" :on-click="onClickEqual" />
            </div>
          </div>
        </div>
      </div>
      <div v-for="error in errors" class="w-100 alert alert-danger mt-3" role="alert">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
}
.calculator-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.calculator {
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 400px;
}

.calculator-screen {
  width: 100%;
  height: 80px;
  border: none;
  background-color: #252525;
  color: #fff;
  text-align: right;
  padding-right: 20px;
  padding-left: 10px;
  font-size: 3rem;
}
.calculator-operators {
  display: flex;
  justify-content: space-between;
}

.calculator-keys {
  padding: 8px;
}
.calculator-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calculator-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 5px 0;
}
</style>
