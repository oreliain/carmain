<template>
  <q-input
    class="full-width"
    :model-value="innerInput"
    @update:model-value="onInput"
    dense
  >
    <template #prepend>
      <q-select
        v-model="innerCountry"
        :options="options"
        :loading="loading"
        input-debounce="0"
        @virtual-scroll="onScroll"
        @filter="filterFn"
        item-aligned
        filled
        dense
        :use-input="selectFocus"
        :hide-selected="selectFocus"
        input-style="width: 4em"
        @focus="selectFocus = true"
        @blur="selectFocus = false"
      >
        <template v-slot:selected>
          <div class="flex flex-center no-wrap">
            <q-img
              style="margin-right: 0.5em"
              width="32px"
              :src="require(`country-flag-icons/3x2/${innerCountry.code}.svg`)"
            />
            <span> +{{ getPhoneCode(innerCountry.code) }} </span>
          </div>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-img
                :src="require(`country-flag-icons/3x2/${scope.opt.code}.svg`)"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>+{{ scope.opt.phoneCode }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </template>
  </q-input>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  getCountries,
  getPhoneCode,
  AsYouType,
  parsePhoneNumberFromString,
  parsePhoneNumber,
} from 'libphonenumber-js';
const COUNTRY_LIST = getCountries().sort((a, b) => {
  const aCode = parseInt(getPhoneCode(a));
  const bCode = parseInt(getPhoneCode(b));
  if (aCode === bCode) return 0;
  else if (aCode < bCode) return -1;
  return 1;
});
const PAGE_SIZE = 50;
const LAST_PAGE = Math.ceil(COUNTRY_LIST.length / PAGE_SIZE);

class QPhoneInputProps {
  readonly modelValue: string;
}

@Options({})
export default class QPhoneInput extends Vue.with(QPhoneInputProps) {
  public innerInput = '';
  public innerCountry = { code: 'FR', phoneCode: '+33' };
  public loading = false;
  public nextPage = 2;
  public filterValue = '';
  public selectFocus = false;

  created() {
    this.$watch(
      'value',
      (newValue) => {
        let displayPhoneNb = '';
        let country = {
          code: 'FR',
          phoneCode: '+33',
        };
        if (newValue) {
          const parsedValue = this.parseValue(newValue);
          if (parsedValue) {
            country = {
              code: parsedValue.country,
              phoneCode: parsedValue.countryCallingCode,
            };
            displayPhoneNb = parsedValue.formatNational();
          }
        }
        this.innerInput = displayPhoneNb;
        this.innerCountry = country;
      },
      { immediate: true }
    );
  }

  get options() {
    return COUNTRY_LIST.map((countryCode) => {
      return {
        code: countryCode,
        phoneCode: getPhoneCode(countryCode),
      };
    })
      .slice(0, PAGE_SIZE * (this.nextPage - 1))
      .filter((item) => {
        return (
          this.filterValue && item.phoneCode && item.phoneCode.includes(this.filterValue)
        );
      });
  }

  get finalValue() {
    try {
      const phoneNumber = parsePhoneNumber(
        this.innerInput,
        this.innerCountry.code
      );
      if (phoneNumber) {
        return phoneNumber.number;
      } else {
        throw new Error(
          'Unable to compute the final phone number',
          this.innerInput,
          this.innerCountry
        );
      }
    } catch (error) {
      return this.modelValue;
    }
  }

  protected parseValue(internationPhone) {
    if (internationPhone) {
      return parsePhoneNumberFromString(internationPhone);
    }
    return null;
  }

  protected getPhoneCode(countryCode: string) {
    return getPhoneCode(countryCode);
  }

  protected formatValue(value: string, country: string) {
    const realValue = value ? value : '';
    const result = new AsYouType(country).input(realValue);
    return result;
  }

  protected onInput(newValue) {
    this.innerInput = this.formatValue(newValue, this.innerCountry.code);
    this.$emit('update:modelValue', this.finalValue);
  }

  protected filterFn(val, update, abort) {
    if (val.length < 1) {
      abort();
      return;
    }

    update(() => {
      this.filterValue = val;
    });
  }

  protected onScroll({ to, ref }) {
    const lastIndex = this.options.length - 1;
    if (
      this.loading !== true &&
      this.nextPage < LAST_PAGE &&
      to === lastIndex
    ) {
      this.loading = true;
      this.nextPage++;
      this.$nextTick(() => {
        ref.refresh();
        this.loading = false;
      });
    }
  }
}
</script>
