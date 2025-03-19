<template>
  <div class="accounts-form">
    <header class="header">
      <h2>Учетные записи</h2>
      <el-button type="primary" @click="handleAddAccount">+</el-button>
    </header>
    <table class="accounts-table">
      <thead>
        <tr>
          <th>Метки</th>
          <th>Тип записи</th>
          <th>Логин</th>
          <th>Пароль</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accountsStore.accounts" :key="index">
          <td>
            <el-input
              v-model="account.label"
              @blur="onLabelBlur(account, index)"
              :class="{ 'input-error': account.errors?.label }"
              placeholder="Введите метки через ;"
            />
          </td>
          <td>
            <el-select
              v-model="account.type"
              @change="onTypeChange(account, index)"
              placeholder="Выберите тип"
            >
              <el-option label="LDAP" value="LDAP" />
              <el-option label="Локальная" value="Локальная" />
            </el-select>
          </td>
          <td :colspan="account.type === 'LDAP' ? 2 : 1">
            <el-input
              v-model="account.login"
              @blur="onLoginBlur(account, index)"
              :class="{ 'input-error': account.errors?.login }"
              placeholder="Введите логин"
            />
          </td>
          <td v-if="account.type === 'Локальная'">
            <el-input
              v-model="account.password"
              @blur="onPasswordBlur(account, index)"
              :class="{ 'input-error': account.errors?.password }"
              type="password"
              placeholder="Введите пароль"
            />
          </td>
          <td>
            <el-button type="danger" @click="handleRemoveAccount(index)"
              >Удалить</el-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAccountsStore, type Account } from '../stores/accounts'

export default defineComponent({
  setup() {
    const accountsStore = useAccountsStore()

    accountsStore.loadAccounts()

    watch(
      () => accountsStore.accounts,
      () => {
        accountsStore.saveAccounts()
      },
      { deep: true }
    )

    const handleAddAccount = () => {
      accountsStore.addAccount()
    }

    const onLabelBlur = (account: Account, index: number) => {
      if (account.label && account.label.length > 50) {
        account.errors = { ...account.errors, label: 'Максимум 50 символов' }
      } else {
        if (account.errors) delete account.errors.label
      }
      account.labelArray = account.label
        ? account.label
            .split(';')
            .map((item) => ({ text: item.trim() }))
            .filter((item) => item.text)
        : []
    }

    const onLoginBlur = (account: Account, index: number) => {
      if (!account.login) {
        account.errors = { ...account.errors, login: 'Логин обязателен' }
      } else if (account.login.length > 100) {
        account.errors = { ...account.errors, login: 'Максимум 100 символов' }
      } else {
        if (account.errors) delete account.errors.login
      }
    }

    const onPasswordBlur = (account: Account, index: number) => {
      if (account.type === 'Локальная') {
        if (!account.password) {
          account.errors = { ...account.errors, password: 'Пароль обязателен' }
        } else if (account.password.length > 100) {
          account.errors = {
            ...account.errors,
            password: 'Максимум 100 символов',
          }
        } else {
          if (account.errors) delete account.errors.password
        }
      }
    }

    const onTypeChange = (account: Account, index: number) => {
      if (account.type === 'LDAP') {
        account.password = null
        if (account.errors) delete account.errors.password
      }
    }

    const handleRemoveAccount = (index: number) => {
      accountsStore.removeAccount(index)
      ElMessage({ message: 'Учетная запись удалена', type: 'info' })
    }

    return {
      accountsStore,
      handleAddAccount,
      onLabelBlur,
      onLoginBlur,
      onPasswordBlur,
      onTypeChange,
      handleRemoveAccount,
    }
  },
})
</script>

<style scoped>
.accounts-form {
  width: 100%;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.accounts-table th,
.accounts-table td {
  text-align: left;
  padding-block: 0.5rem;
  padding-inline: 0.5rem;
}

.input-error {
  border: 1px solid red;
  border-radius: 4px;
}
</style>
