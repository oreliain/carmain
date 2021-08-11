<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> {{ productName }} </q-toolbar-title>
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

export default class BasicLayout extends Vue {
  get productName() {
    return PackageInfo.productName;
  }
}
</script>
