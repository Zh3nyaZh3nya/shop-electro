<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApi } from "~/composables/useApi";
import { useDisplay } from "vuetify";
import debounce from 'lodash-es/debounce'

const router = useRouter()
const { mdAndUp } = useDisplay()

const search = ref('')
const results = ref<IProductCard[]>([])
const loading = ref(false)

const fetchSearchResults = async (query: string) => {
  if (!query.trim()) {
    results.value = []
    return
  }

  loading.value = true
  try {
    const { data, error } = await useApi(`/catalog/search?search=${encodeURIComponent(query)}`)
    if (!error.value) {
      results.value = data.value?.data || []
    } else {
      console.warn('Ошибка поиска:', error.value)
    }
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(fetchSearchResults, 300)

function submitSearch() {
  if (search.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(search.value)}`)
  }
}

watch(search, (val) => {
  debouncedSearch(val)
})
</script>

<template>
  <v-menu
      :close-on-content-click="false"
      :offset="10"
  >
    <template #activator="{ props }">
      <v-text-field
          v-model="search"
          v-bind="props"
          variant="outlined"
          class="text-field text-field-header"
          :hide-details="true"
          placeholder="Холодильник"
          :style="{ width: mdAndUp ? '240px' : '100%' }"
          rounded="lg"
          @keydown.enter="submitSearch"
      >
        <template #append-inner>
          <v-icon
              icon="mdi-magnify"
              color="grey"
              class="search-icon"
              @click="submitSearch"
          />
        </template>

      </v-text-field>
    </template>

    <v-card class="pa-4" min-width="350">
      <div class="d-flex align-center ga-2 text-body-1 text-grey mb-4">
        <p>Товары</p>
        <v-divider color="black"></v-divider>
      </div>
      <template v-if="loading">
        <v-overlay
            v-model="loading"
            class="align-center justify-center"
            contained
        >
          <v-progress-circular
              color="primary"
              size="32"
              indeterminate
          ></v-progress-circular>
        </v-overlay>
      </template>
      <template v-else-if="results.length">
        <div
            v-for="res in results"
            :key="res.id"
        >
          <nuxt-link
              :to="`/catalog/${res.category.value}/${res.subcategory.value}/${res.slug}`"
              class="d-flex align-center ga-3 link-hover"
          >
            <div>
              <v-img :src="res.preview_images[0]" width="50" height="50" />
            </div>
            <div class="d-flex flex-column">
              <p class="text-body-1">{{ res.title }}</p>
              <div v-if="!res.discount">
                <p class="text-body-1 font-weight-bold">{{ res?.price?.toLocaleString('ru-RU') }} ₸</p>
              </div>
              <div v-else class="d-flex align-center ga-2">
                <p class="text-body-1 font-weight-bold text-red">{{ Math.floor(res.price - (res.price / res.discount_percent)).toLocaleString('ru-RU') }} ₸</p>
                <div class="text-body-2 d-flex ga-2">
                  <p class="text-line">{{ res?.price?.toLocaleString('ru-RU') }} ₸</p>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </template>
      <template v-else>
        <div class="text-center">
          <p class="text-body-1 text-secondary font-weight-medium">Мы не нашли товаров по вашему запросу.</p>
          <p class="text-body-2 text-secondary">Попробуйте уточнить или использовать другие слова.</p>
        </div>
      </template>
    </v-card>
  </v-menu>

</template>

<style lang="scss">
.search-icon {
  transition: .3s;
  cursor: pointer;
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}
</style>