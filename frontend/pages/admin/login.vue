<script setup lang="ts">
import { useApi } from "~/composables/useApi";
import { useRouter } from "#vue-router";

const router = useRouter()

const formLogin = ref(null)
const rules = {
  required: (v: any) => !!v || 'Обязательно',
}
const errors = ref({
  login: '',
  password: ''
})
const bodyData = ref({
  login: '',
  password: '',
})

async function login() {
  const { valid } = await formLogin.value.validate()

  if(!valid) {
    return
  }

  errors.value = { login: '', password: '' }

  try {
    const { status, error: errorData } = await useApi('/admin/login', { method: 'POST', body: {...bodyData.value} })
    if(errorData.value) {
      const { data } = errorData?.value
      errors.value = data.data
    }

    if(status.value === 'success') {
      navigateTo('/admin')
    }
  } catch (e) {
    console.log(e)
  }
}

definePageMeta({
  layout: 'login',
})
</script>

<template>
  <v-main>
    <section class="h-100 d-flex justify-center align-center">
      <v-container class="d-flex justify-center">
        <v-card
          rounded="lg"
          class="pa-8 bg-admin-grey-dark-1 border-card"
          :max-width="500"
          width="100%"
        >
          <v-form
              ref="formLogin"
              @submit.prevent="login"
          >
            <div class="text-center mb-4">
              <h1 class="text-h6 mb-2">Shop Audio</h1>
              <p class="text-h5 font-weight-bold">Войдите в свой аккаунт</p>
            </div>
            <div>
              <div class="mb-2">
                <p class="text-body-2 mb-2">Адрес электронной почты<label class="text-admin-red text-body-1">*</label></p>
                <v-text-field
                    color="admin-primary"
                    v-model="bodyData.login"
                    variant="outlined"
                    rounded="lg"
                    class="text-field-admin"
                    :error-messages="errors.login"
                    :rules="[rules.required]"
                />

              </div>

              <div class="mb-2">
                <p class="text-body-2 mb-2">Пароль<label class="text-admin-red text-body-1">*</label></p>
                <v-text-field
                    color="admin-primary"
                    v-model="bodyData.password"
                    type="password"
                    variant="outlined"
                    rounded="lg"
                    class="text-field-admin"
                    :error-messages="errors.password"
                    :rules="[rules.required]"
                />
              </div>

              <v-btn
                color="admin-primary"
                rounded="lg"
                block
                class="mt-4 text-none text-white"
                type="submit"
                size="large"
              >
                Войти
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-container>
    </section>
  </v-main>
</template>

<style lang="scss">
</style>