<script lang="ts">
import { getUserRecords, deleteRecordRequest } from '@/api'
import type { IRecordResponse } from '@/types'
import { SortingDirection } from '@/types'

interface IData {
  page: number
  pageSize: number
  records: IRecordResponse[]
  hasNextPage: boolean
  error: string
  searchInput: string
  columns: { label: string; field: string }[]
  sortConfig: Record<string, SortingDirection>
}

export default {
  data(): IData {
    return {
      page: 1,
      pageSize: 10,
      records: [],
      hasNextPage: false,
      error: '',
      searchInput: '',
      columns: [
        { label: '#', field: 'id' },
        { label: 'Operation Type', field: 'operation__type' },
        { label: 'Response', field: 'operation_response' },
        { label: 'Date', field: 'date' },
        { label: 'User Balance', field: 'user_balance' },
        { label: 'Amount', field: 'amount' },
        { label: 'Delete', field: '' }
      ],
      sortConfig: {
        id: SortingDirection.NO_SORT,
        operation__type: SortingDirection.NO_SORT,
        operation_response: SortingDirection.NO_SORT,
        date: SortingDirection.NO_SORT,
        user_balance: SortingDirection.NO_SORT,
        amount: SortingDirection.NO_SORT
      }
    }
  },
  async mounted() {
    await this.getData()
  },
  watch: {
    page() {
      this.getData()
    },
    searchInput() {
      this.getData()
    }
  },
  methods: {
    sortButtonClass(field: string) {
      return {
        btn: true,
        'btn-link': this.sortConfig[field] === SortingDirection.NO_SORT,
        'btn-success': this.sortConfig[field] === SortingDirection.ASC,
        'btn-danger': this.sortConfig[field] === SortingDirection.DESC
      }
    },
    async getData() {
      try {
        this.error = ''
        const { results: records, next } = await getUserRecords(
          localStorage.token || '',
          this.page,
          this.pageSize,
          this.searchInput,
          this.sortConfig
        )
        this.records = records
        this.hasNextPage = !!next
      } catch (error) {
        this.error = 'Invalid Page'
      }
    },
    async selectNextPage() {
      if (!this.hasNextPage) return
      this.page++
    },
    async selectPreviousPage() {
      if (this.page === 1) return
      this.page--
    },
    async getSortingFunction(field: string) {
      let newSortingField = SortingDirection.NO_SORT
      switch (this.sortConfig[field]) {
        case SortingDirection.NO_SORT:
          newSortingField = SortingDirection.ASC
          break
        case SortingDirection.ASC:
          newSortingField = SortingDirection.DESC
          break
        case SortingDirection.DESC:
          newSortingField = SortingDirection.NO_SORT
          break
        default:
          break
      }

      this.sortConfig[field] = newSortingField
      this.getData()
    },
    async deleteRecord(id: number) {
      await deleteRecordRequest(localStorage.token || '', id)
      await this.getData()
    }
  }
}
</script>
<template>
  <div class="container records-table-container">
    <table class="table table-striped records-table">
      <thead>
        <tr>
          <th v-for="column in columns" scope="col">
            {{ column.label }}
            <button
              @click.prevent="getSortingFunction(column.field)"
              type="button"
              :class="sortButtonClass(column.field)"
              class="sort-button"
              v-if="column.field"
            >
              <i class="bi bi-arrow-down-up"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <th scope="row">{{ record.id }}</th>
          <td>{{ record.operation.type }}</td>
          <td>{{ record.operation_response }}</td>
          <td>{{ new Date(record.date).toLocaleString('es-cl') }}</td>
          <td>{{ record.user_balance.toFixed(2) }}</td>
          <td>{{ record.amount }}</td>
          <td>
            <button @click.prevent="deleteRecord(record.id)" type="button" class="btn btn-danger">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="footer">
      <div class="search-input input-group mb-3">
        <input
          v-model="searchInput"
          type="text"
          class="form-control"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search input"
        />
      </div>
      <nav>
        <ul class="pagination">
          <li
            :class="{ disabled: page === 1, 'page-item': true }"
            @click.prevent="selectPreviousPage"
          >
            <a class="page-link" href="#" tabindex="-1">Previous</a>
          </li>
          <li class="page-input" aria-current="page">
            <input
              input
              v-model="page"
              type="number"
              class="form-control page-link"
              aria-label="Username"
              :disabled="!hasNextPage"
              min="1"
            />
          </li>

          <li
            :class="{ disabled: !hasNextPage, 'page-item': true }"
            @click.prevent="selectNextPage"
          >
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.records-table-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.page-input {
  width: 100px;
}
.footer {
  display: flex;
  width: 60%;
}
.search-input {
  margin-right: 32px;
}
.sort-button {
  width: 24px;
  padding: 2px;
  margin-left: 8px;
}
</style>
