<script setup lang="ts">
import Nav from "@/components/Nav/Nav.vue";
import Header from "@/components/Header/Header.vue";
</script>

<template>
  <transition name="index" appear>
    <div id="Index">
      <Nav></Nav>
      <div class="rightCon">
        <Header></Header>
        <router-view></router-view>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@keyframes indexShow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.index-enter-active {
  animation: indexShow 1s;
}

.index-leave-active {
  animation: indexShow 1s reverse;
}

#Index {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .rightCon {
    width: 100%;
    height: 100vh;
    background-color: #f0f2f5;
  }
}
</style>