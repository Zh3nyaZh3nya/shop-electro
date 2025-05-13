<script setup lang="ts">

const banner: IBanner[] = [
  {
    id: 1,
    title: 'Телевизоры',
    slug: '',
    video: '/video-banner-televizory.webm',
  }
]
const isInstallment = ref<boolean>(false)
const isDiscount = ref<boolean>(false)
const isCount = ref<boolean>(false)
const prices = [79990, 2200990]
const rangePrice = ref<number[]>([...prices])

const rawFromPrice = ref<number>(prices[0])
const rawToPrice = ref<number>(prices[1])

function formatNumberWithSpaces(val: number): string {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function parseNumber(val: string): number {
  return parseInt(val.replace(/\s/g, ''), 10) || 0
}

const formattedFromPrice = computed(() => formatNumberWithSpaces(rawFromPrice.value))
const formattedToPrice = computed(() => formatNumberWithSpaces(rawToPrice.value))

function onTypeFrom(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = parseNumber(input.value)

  // если пусто или 0 → ставим дефолтный минимум
  if (!raw) {
    rawFromPrice.value = prices[0]
    input.value = formatNumberWithSpaces(prices[0])
    return
  }

  if (raw <= rawToPrice.value) {
    rawFromPrice.value = raw
    input.value = formatNumberWithSpaces(raw)
  } else {
    input.value = formatNumberWithSpaces(rawFromPrice.value)
  }
}

function onTypeTo(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = parseNumber(input.value)

  // если пусто или 0 → ставим дефолтный максимум
  if (!raw) {
    rawToPrice.value = prices[1]
    input.value = formatNumberWithSpaces(prices[1])
    return
  }

  if (raw >= rawFromPrice.value) {
    rawToPrice.value = raw
    input.value = formatNumberWithSpaces(raw)
  } else {
    input.value = formatNumberWithSpaces(rawToPrice.value)
  }
}

watchEffect(() => {
  rangePrice.value = [rawFromPrice.value, rawToPrice.value]
})

watch(rangePrice, (val) => {
  rawFromPrice.value = val[0]
  rawToPrice.value = val[1]
})
</script>

<template>
  <!--  <v-overlay-->
  <!--      :model-value=""-->
  <!--      class="align-center justify-center"-->
  <!--  >-->
  <!--    <v-progress-circular-->
  <!--        color="admin-primary"-->
  <!--        size="64"-->
  <!--        indeterminate-->
  <!--    ></v-progress-circular>-->
  <!--  </v-overlay>-->
  <section v-if="$route.params.category === 'televizory'">
    <UIBanner :slides="banner" />
  </section>
  <section class="position-relative d-flex">
    <div>
      <v-navigation-drawer class="position-relative filters" style="height: 100%; top: 0" width="300" color="grey-light-4">
        <v-container>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-tune-variant" size="20" />
              <p class="text-body-1 font-weight-medium">Фильтры</p>
            </div>
            <div>
              <v-btn
                  variant="text"
                  class="px-0"
                  min-width="0"
                  color="primary"
              >
                Сбросить
              </v-btn>
            </div>
          </div>

          <div class="d-flex align-center justify-space-between">
            <p class="text-body-1 font-weight-medium">В наличии</p>
            <v-switch
                v-model="isCount"
                :hide-details="true"
                color="primary"
                class="switch"
            />
          </div>

          <v-divider style="background: #afbbc680" class="mb-1"></v-divider>

          <div class="d-flex align-center justify-space-between">
            <p class="text-body-1 font-weight-medium">Товары по акции</p>
            <v-switch
                v-model="isDiscount"
                :hide-details="true"
                color="primary"
                class="switch"
            />
          </div>

          <v-divider style="background: #afbbc680" class="mb-1"></v-divider>

          <div class="d-flex flex-column mt-2">
            <p class="text-body-1 font-weight-medium">Специальные предложения</p>
            <v-checkbox
                v-model="isInstallment"
                :hide-details="true"
                color="primary"
                class="checkbox link-hover"
            >
              <template #input>
                <div
                    class="checkbox-input"
                    :class="{ 'checkbox-input--checked': isInstallment }"
                    @click.stop="isInstallment = !isInstallment"
                >
                  <v-icon
                      icon="mdi-check"
                      class="checkbox-input-icon"
                      size="17px"
                  />
                </div>
              </template>
              <template #label>
                <span
                    @click.stop="isInstallment = !isInstallment"
                    class="link-hover text-body-2"
                >
                  Рассрочка
                </span>
              </template>
            </v-checkbox>
          </div>

          <v-divider style="background: #afbbc680" class="mb-1"></v-divider>

          <div class="d-flex flex-column my-2">
            <p class="text-body-1 font-weight-medium mb-2">Цена, ₸</p>
            <div class="d-flex align-center ga-2">
              <v-text-field
                  variant="outlined"
                  :hide-details="true"
                  class="text-field text-body-2"
                  rounded="lg"
                  v-model="formattedFromPrice"
                  @input="onTypeFrom"
              >
                <template #prepend-inner>
                  <span class="text-body-2 text-grey">от</span>
                </template>
              </v-text-field>
              <v-text-field
                  variant="outlined"
                  :hide-details="true"
                  class="text-field text-body-2"
                  rounded="lg"
                  v-model="formattedToPrice"
                  @input="onTypeTo"
              >
                <template #prepend-inner>
                  <span class="text-body-2 text-grey">до</span>
                </template>
              </v-text-field>
            </div>

            <v-range-slider
                v-model="rangePrice"
                :min="prices[0]"
                :max="prices[1]"
                :step="50000"
                hide-details
                color="primary"
                class="slider-range"
            >

            </v-range-slider>
          </div>

          <v-divider style="background: #afbbc680" class="mb-1"></v-divider>

        </v-container>
      </v-navigation-drawer>
    </div>
    <div>
      123
    </div>
  </section>
</template>

<style lang="scss">
.filters {
  .switch {
    .v-selection-control__input {
      height: 25px;
      width: 25px;
      transform: translateX(-7px);
      &::before {
        background: none;
      }
    }
    .v-switch__track {
      height: 22px;
      width: 38px;
    }
    .v-switch__thumb {
      background: white !important;
      height: 16px;
      width: 16px;
      box-shadow: 0 3px 4px rgba(76,76,76,.06),0 3px 8px rgba(76,76,76,.15) !important;
    }
    .v-selection-control--dirty .v-selection-control__input {
      transform: translateX(7px);
    }

  }

  .checkbox {
    .v-selection-control__wrapper {
      --v-selection-control-size: 20px;
      margin-right: 8px;
    }
    &-input {
      background: #fcfcfc;
      border: 1px solid #d7dde3;
      border-radius: 2px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      transition: all .2s;
      position: relative;
      &:hover {
        border: 1px solid rgb(var(--v-theme-primary));
      }
      &--checked {
        border: 1px solid rgb(var(--v-theme-primary));
        .checkbox-input-icon {
          opacity: 1;
        }
      }
      &-icon {
        position: absolute;
        opacity: 0;
        transition: all .2s;
      }
    }
  }

  .text-field {
    .v-input__control {
      height: 44px;
    }
    .v-field__input {
      font-size: 14px;
      font-weight: 400;
    }
    .v-field__overlay {
      background: white;
    }
    .v-field__outline {
      --v-field-border-opacity: 1;
    }
    .v-field--variant-outlined .v-field__outline__start, .v-field--variant-outlined .v-field__outline__notch::before, .v-field--variant-outlined .v-field__outline__notch::after, .v-field--variant-outlined .v-field__outline__end {
      border: 1px solid #d7dde3;
    }
    .v-field__outline__start {
      border-right: none !important;
    }
    .v-field__outline__end {
      border-left: none !important;
    }
    .v-field__prepend-inner {
      z-index: 1;
    }
  }

  .slider-range {
    .v-slider-track__background {
      background: rgb(var(--v-theme-grey)) !important;
    }
    .v-slider-track, .v-slider-track__background {
      height: 2px;
    }
    .v-slider-thumb__surface {
      --v-slider-thumb-size: 16px;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        background: white;
        width: 11px;
        height: 11px;
        border-radius: 50px;
      }
    }
  }
}
</style>