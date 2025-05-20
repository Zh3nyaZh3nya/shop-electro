<script setup lang="ts">
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
      <v-container>
        <h1 class="text-h4 font-weight-bold mb-4 text-secondary">Гарантия</h1>
        <p class="text-h6 font-weight-regular lh-normal text-secondary mb-4">Мы даем гарантию от одного года до 12 лет — точный срок обслуживания зависит от категории товара и от места покупки.</p>

        <h2 class="text-h5 font-weight-bold mb-4 text-secondary">Гарантия на технику</h2>
        <p class="text-h6 font-weight-regular lh-normal text-secondary mb-2">Вы можете приобрести технику в официальном интернет-магазине и фирменных магазинах SHOP-AUDIO, а также в магазинах наших партнеров.</p>
        <p class="text-h6 font-weight-regular lh-normal text-secondary">На товары, приобретенные в официальном интернет-магазине SHOP-AUDIO и фирменных магазинах SHOP-AUDIO, распространяются расширенные сроки гарантии. На товары, приобретенные в розничных сетях партнеров, распространяются стандартные сроки гарантии.</p>
      </v-container>
    </section>
  </v-main>
</template>

<style scoped lang="scss">

</style>