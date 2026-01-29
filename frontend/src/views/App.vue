<!--
  Root layout component for the application.
  Defines the common page structure shared across all routes.
-->

<template>
  <div class="page-wrap d-flex flex-column">
    <NavBar />
    <main class="container py-4 flex-fill">
    <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

export default {
  name: "App",
  components: { NavBar , Footer}
}
</script>
