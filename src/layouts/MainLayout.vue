<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Carmain </q-toolbar-title>

        <div>
          <q-btn v-if="isAuthenticated" @click="logout">{{
            $t('main.Logout')
          }}</q-btn>
          <q-btn v-else @click="goToLogin">{{ $t('main.Login') }}</q-btn>
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

export default class MainLayout extends Vue {
  get isAuthenticated() {
    return this.$store.state.auth.isAuthenticated;
  }

  protected goToLogin() {
    void this.$router.push('/auth/login');
  }

  protected logout() {
    void this.$store.dispatch('auth/logoutUser');
  }
}
</script>
