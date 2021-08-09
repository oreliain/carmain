<template>
  <q-page
    class="bg-light window-height window-width row justify-center items-center"
  >
    <div class="column">
      <div class="row justify-center">
        <h5 class="text-h5 text-white q-my-md">Carmain</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form ref="logForm" class="q-gutter-md">
              <q-input
                clearable
                v-model="email"
                type="email"
                :error="!!errors.email"
                :error-message="errors.email"
                :label="$t('auth.Email')"
                autocomplete="email"
              />
              <q-input
                autocomplete="current-password"
                v-model="password"
                type="password"
                :error-message="errors.password"
                :error="!!errors.password"
                :label="$t('auth.Password')"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              size="lg"
              class="full-width"
              :label="$t('auth.Login')"
              @click="onSubmit"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              {{ $t('auth.Not registered?') }}&nbsp;<router-link
                to="/auth/register"
                >{{ $t('auth.Create an account') }}</router-link
              >
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { QForm } from 'quasar';
import firebase from 'firebase/app';

export default class Auth extends Vue {
  public email = '';
  public password = '';
  public errors: { email: string; password: string } = {
    email: '',
    password: '',
  };

  declare $refs: {
    logForm: QForm;
  };

  protected requiredRule(val: string) {
    return !!val || this.$t('auth.This field is required');
  }

  protected async onSubmit() {
    const valid = await this.$refs.logForm.validate();
    if (valid) {
      try {
        const result = await this.$store.dispatch('auth/loginUser', {
          email: this.email,
          password: this.password,
        });
      } catch (error: any) {
        if (error instanceof Error) {
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              this.errors.email = this.$t("auth.This field is mistaken");
              this.errors.password = this.$t("auth.This field is mistaken");
              break;
            case 'auth/invalid-email':
              this.errors.email = this.$t('auth.The email is invalid');
              break;
            case 'auth/user-disabled':
              break;
          }
        }
      }
    } else {
      console.log('Form is not valid');
    }
  }
}
</script>
