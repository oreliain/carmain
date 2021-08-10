<template>
  <q-page class="bg-light window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form ref="logForm" class="q-gutter-md" @keydown.enter="onSubmit">
              <q-input
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
                :type="showPwd ? 'text' : 'password'"
                :error-message="errors.password"
                :error="!!errors.password"
                :label="$t('auth.Password')"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPwd ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPwd = !showPwd"
                  />
                </template>
              </q-input>
              <q-input
                v-if="isRegistration"
                autocomplete="new-password"
                v-model="passwordMatch"
                :type="showPwdMatch ? 'text' : 'password'"
                :error-message="errors.passwordMatch"
                :error="!!errors.passwordMatch"
                :label="$t('auth.Verify password')"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPwdMatch ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPwdMatch = !showPwdMatch"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              size="lg"
              class="full-width"
              :label="
                isRegistration ? $t('auth.Create account') : $t('auth.Login')
              "
              @click="onSubmit"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <router-link class="text-blue" :to="routeAuthentication">
              <span v-if="isRegistration">{{ $t('auth.Need to login?') }}</span>
              <span v-else>{{ $t('auth.Need to create an account?') }}</span>
            </router-link>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { QForm, QSpinnerGears } from 'quasar';
import firebase from 'firebase/app';
import UserCredential = firebase.auth.UserCredential;

export default class Auth extends Vue {
  public email = '';
  public password = '';
  public passwordMatch = '';
  public showPwd = false;
  public showPwdMatch = false;
  public errors: { email: string; password: string; passwordMatch: string } = {
    email: '',
    password: '',
    passwordMatch: '',
  };

  declare $refs: {
    logForm: QForm;
  };

  created() {
    this.$watch('email', (newValue: string) => {
      this.errors.email = this.requiredRule(newValue);
    });
    this.$watch('password', (newValue: string) => {
      this.errors.password = this.requiredRule(newValue);
    });
    this.$watch('passwordMatch', (newValue: string) => {
      this.errors.passwordMatch = this.requiredRule(newValue);
    });
  }

  get isRegistration() {
    return this.$route.name === 'Register';
  }

  get routeAuthentication() {
    return this.isRegistration ? '/auth/login' : '/auth/register';
  }

  protected requiredRule(val: string) {
    if (!val) {
      return this.$t('auth.This field is required');
    }
    return '';
  }

  protected validate() {
    return this.$refs.logForm
      .validate()
      .then((valid) => {
        if (!valid) {
          return false;
        }
        this.errors.email = this.requiredRule(this.email);
        this.errors.password = this.requiredRule(this.password);
        if (this.isRegistration) {
          this.errors.passwordMatch = this.requiredRule(this.passwordMatch);
          if (this.password !== this.passwordMatch) {
            this.errors.passwordMatch = this.$t(
              'auth.The passwords must be the same'
            );
          }
          return (
            !this.errors.email &&
            !this.errors.password &&
            !this.errors.passwordMatch
          );
        }
        return !this.errors.email && !this.errors.password;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  protected async onSubmit() {
    const valid = await this.validate();
    if (valid) {
      this.$q.loading.show({
        message: this.isRegistration
          ? this.$t('auth.Registering your account')
          : this.$t('auth.Authenticating your account'),
        spinner: QSpinnerGears,
      });
      try {
        if (this.isRegistration) {
          void (<UserCredential>await this.$store.dispatch(
            'auth/createNewUser',
            {
              email: this.email,
              password: this.password,
            }
          ));
        } else {
          void (<UserCredential>await this.$store.dispatch('auth/loginUser', {
            email: this.email,
            password: this.password,
          }));
        }
        void (await this.$router.push({ path: '/user' }));
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            this.errors.email = this.$t(
              'auth.Unable to found an account for this email'
            );
            break;
          case 'auth/wrong-password':
            this.errors.password = this.$t('auth.The password is incorrect');
            break;
          case 'auth/invalid-email':
            this.errors.email = this.$t('auth.The email is invalid');
            break;
          case 'auth/user-disabled':
            this.errors.email = this.$t(
              'auth.User has been disabled. Please, contact the support'
            );
            break;
          default:
            console.error(error);
            this.$q.notify({
              message: this.$t('errors.An error as occured: {message}', error),
              color: 'negative',
            });
            break;
        }
      } finally {
        this.$q.loading.hide();
      }
    } else {
      console.log('Form is not valid');
    }
  }
}
</script>
