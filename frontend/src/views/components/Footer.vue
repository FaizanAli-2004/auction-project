<!-- footer showing copyright notice, tagline, social media  -->
<template>
  <footer class="footer mt-auto">
    <div class="container d-flex justify-content-between align-items-center">
   
       <div class="text-subtitle mb-0 custom-semibold">
        © {{ year }} CHRONO BID
      </div>

      <div class="text-subtitle grey-text custom-semibold">
        CHRONO BID • Secure bidding
      </div>

      <div class="d-flex gap-3 ">
        <a href="#" class="social-icon custom-semibold" aria-label="Instagram">
          <i class="bi bi-instagram"></i>
        </a>
        <a href="#" class="social-icon custom-semibold" aria-label="Twitter">
          <i class="bi bi-twitter-x"></i>
        </a>
        <a href="#" class="social-icon custom-semibold" aria-label="Facebook">
          <i class="bi bi-facebook"></i>
        </a>
      </div>

    </div>
  </footer>
</template>

<script> export default { computed: { year() { return new Date().getFullYear() } } } </script>

<style scoped>
  .footer{
  border-top: 1px solid var(--border);
  background: rgba(11, 12, 15, 0.9);
  backdrop-filter: blur(8px);
   padding-top: 1.4rem;
  padding-bottom: 1.4rem;
  }
  .social-icon {
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.social-icon:hover {
  color: var(--gold) !important;
 
}
</style>