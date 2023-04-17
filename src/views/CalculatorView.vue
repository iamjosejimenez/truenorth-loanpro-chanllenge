<script lang="ts">
import CalculatorDigit from '@/components/CalculatorDigit.vue'
import CalculatorOperator from '@/components/CalculatorOperator.vue'
import { OperationEnum } from '@/types'
import { operationRequest } from '@/api'

interface IData {
  displayValue: string
  previousResult: string
  currentOperator: OperationEnum | null
  operators: object[]
  userWriting: boolean
  userBalance: number
  operator2NumOperands: Record<OperationEnum, number>
}

export default {
  data(): IData {
    return {
      userBalance: 0,
      displayValue: '0',
      previousResult: '',
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
      }
    }
  },
  methods: {
    onClickNumber(value: string) {
      if (this.userWriting) {
        if (this.displayValue == '0') {
          this.displayValue = value
          return
        }
        this.displayValue += value
      } else {
        this.userWriting = true
        this.previousResult = this.displayValue
        this.displayValue = value
      }
    },
    async onClickOperator(operator: OperationEnum) {
      this.userWriting = false

      if (!this.currentOperator) {
        this.currentOperator = operator
      }

      const operands: string[] = []
      if (operands.length < this.operator2NumOperands[operator]) {
        operands.push(this.displayValue)

        if (this.previousResult) {
          operands.push(this.previousResult)
        }

        if (operands.length < this.operator2NumOperands[operator]) {
          return
        }
      }

      const { operation_response: newDisplayValue, user_balance: newUserBalance } =
        await operationRequest(
          operands.reverse(),
          this.currentOperator as OperationEnum,
          localStorage.token || ''
        )

      this.displayValue = newDisplayValue
      this.userBalance = newUserBalance
      this.currentOperator = operator
    },
    async onClickEqual() {
      if (!this.currentOperator) {
        return
      }

      await this.onClickOperator(this.currentOperator)
      this.currentOperator = null
      this.previousResult = ''
    },
    clearDisplay() {
      this.displayValue = '0'
      this.previousResult = ''
      this.currentOperator = null
      this.userWriting = true
    }
  },

  components: { CalculatorOperator, CalculatorDigit }
}
</script>
<template>
  <div class="alert alert-success" role="alert">Current User Balance: {{ userBalance }}</div>
  <div class="calculator-container">
    <div class="calculator card">
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
  </div>
</template>

<style scoped>
.calculator-container {
  display: flex;
  justify-content: center;
}
.calculator {
  margin-top: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
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