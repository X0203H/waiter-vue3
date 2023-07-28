<script setup lang="ts">
import '../public/css/base.css'
import {useCounter} from "@/store"

const store = useCounter()
store.echFun()
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss" scoped>

</style>
