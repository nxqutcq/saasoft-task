<template>
  <div class="accounts-form">
    <header class="header">
      <h2>Управление учетными записями</h2>
      <el-button type="primary" @click="handleAddAccount">+</el-button>
    </header>
    <div class="items-wrapper">
      <div
        v-for="(account, index) in accountsStore.accounts"
        :key="index"
        class="account-item"
      >
        <div>
          <label>Метки</label>
          <div class="form-group">
            <el-input
              v-model="account.label"
              @blur="onLabelBlur(account, index)"
              :class="{ 'input-error': account.errors?.label }"
              placeholder="Введите метки через ;"
            />
          </div>
        </div>
        <div>
          <label>Тип записи</label>
          <div class="form-group">
            <el-select
              v-model="account.type"
              @change="onTypeChange(account, index)"
              placeholder="Выберите тип"
            >
              <el-option label="LDAP" value="LDAP" />
              <el-option label="Локальная" value="Локальная" />
            </el-select>
          </div>
        </div>
        <div>
          <div class="form-group">
            <label>Логин</label>
            <el-input
              v-model="account.login"
              @blur="onLoginBlur(account, index)"
              :class="{ 'input-error': account.errors?.login }"
              placeholder="Введите логин"
            />
          </div>
        </div>
        <div>
          <div class="form-group" v-if="account.type === 'Локальная'">
            <label>Пароль</label>
            <el-input
              v-model="account.password"
              @blur="onPasswordBlur(account, index)"
              :class="{ 'input-error': account.errors?.password }"
              type="password"
              placeholder="Введите пароль"
            />
          </div>
        </div>
        <el-button type="danger" @click="handleRemoveAccount(index)"
          >Удалить</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { watch } from 'vue'
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
        account.password = ''
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
  margin: 0 auto;
  width: 100%;
}

.header {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
}

.form-group {
  margin-bottom: 1rem;
  min-width: 200px;
}

.input-error {
  border: 1px solid red;
  border-radius: 4px;
}

.account-item {
  gap: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
