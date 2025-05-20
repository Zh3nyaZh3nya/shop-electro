<script setup lang="ts">
const contacts: { icon: string, title: string, desc: string }[] = [
  {
    icon: 'mdi-file-alert',
    title: 'Юридическая информация',
    desc: `<p>ТОО Хайер Мидл Эйжа</p><p>БИН 230542354657</p>`
  },
  {
    icon: 'mdi-phone',
    title: 'Телефон',
    desc: `<a href="tel:87079169250" class="text-primary">8 707 916 92 50</a>`
  },
  {
    icon: 'mdi-email',
    title: 'Написать нам',
    desc: `<p>E-mail: <a href="mailto:evgeniq.golovkin@gmail.com" class="text-primary">evgeniq.golovkin@gmail.com</a></p>`
  },
]

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Сервис и поддержка',
    href: '/',
    disabled: true,
  }
]
</script>

<template>
  <v-main>
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section>
      <v-container max-width="1300px">
        <h1 class="text-h4 font-weight-bold mb-6 text-secondary text-center">Контакты</h1>

        <v-row justify="center">
          <v-col
              v-for="item in contacts"
              :key="item.icon"
              cols="12"
              sm="4"
              class="d-flex justify-center"
          >
            <v-card
                class="d-flex align-start flex-column v-card-not-shadow pa-4"
                color="grey-light-4"
                max-width="380"
                width="100%"
                rounded="lg"
            >
              <div class="pa-3 bg-white rounded-lg mb-3">
                <v-icon :icon="item.icon" color="primary"/>
              </div>
              <p class="text-h6 font-weight-medium text-secondary mb-4">{{ item.title }}</p>
              <div v-html="item.desc" class="text-body-1 text-secondary lh-normal"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-main>
</template>

<style scoped lang="scss">

</style>