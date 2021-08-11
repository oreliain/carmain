<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> {{ productName }} </q-toolbar-title>

        <div v-if="isAuthenticated">
          <q-btn round color="secondary">
            <q-avatar v-if="showDefaultPhoto" icon="person" rounded>
              <q-menu>
                <q-list>
                  <q-item clickable v-close-popup to="/user/profile">
                    <q-item-section>
                      {{ $t('main.My profile') }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="logout">
                    <q-item-section>{{ $t('main.Logout') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-avatar>
          </q-btn>
        </div>
        <div v-else>
          <q-btn @click="goToLogin">{{ $t('main.Login') }}</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import PackageInfo from '../../package.json';

export default class AppLayout extends Vue {
  get productName() {
    return PackageInfo.productName;
  }

  get isAuthenticated(): boolean {
    return this.$store.state.auth.isAuthenticated;
  }

  get currentUser() {
    return this.$store.state.user.currentUser;
  }

  get showDefaultPhoto(): boolean {
    return (
      !this.currentUser ||
      this.currentUser.profilePhoto === '' ||
      this.currentUser.profilePhoto === null ||
      this.currentUser.profilePhoto === undefined
    );
  }

  protected goToLogin() {
    void this.$router.push('/auth/login');
  }

  protected logout() {
    void this.$store.dispatch('auth/logoutUser');
  }
}
</script>
