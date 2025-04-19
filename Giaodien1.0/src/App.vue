<script setup>
import { useAuthStore } from "./store/authStore";
import { useRouter, RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="app-container">
    <Header />
    <nav>
    </nav>
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
  padding: 20px;
}
nav {
  display: flex;
  gap: 10px;
}
button {
  background: red;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
