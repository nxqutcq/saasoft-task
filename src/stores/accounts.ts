import { defineStore } from 'pinia'

export type Account = {
  label: string
  labelArray: { text: string }[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
  errors?: { [key: string]: string }
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount() {
      this.accounts.push({
        label: '',
        labelArray: [],
        type: 'Локальная',
        login: '',
        password: '',
        errors: {}
      })
    },
    removeAccount(index: number) {
      this.accounts.splice(index, 1)
    },
    updateAccount(index: number, account: Account) {
      this.accounts[index] = account
    },
    loadAccounts() {
      const data = localStorage.getItem('accounts')
      if (data) {
        this.accounts = JSON.parse(data)
      }
    },
    saveAccounts() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
  },
})
