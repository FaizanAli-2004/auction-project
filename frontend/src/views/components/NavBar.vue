  <!-- Top navigation bar with active link highlighting and auth-based links -->
<template>
  <nav class="navbar " id="custom-nav">
    <div class="container">
      
  <a class="navbar-brand section-title d-flex align-items-center gap-2"
   href="#"
   @click.prevent="go('/')">

  <img
    src="@/assets/brand_logo.png"
    alt="Watch Auctionary logo"
    id="brand-logo"
  />

  <span>CHRONO BID</span>
</a>

 <!-- Navigation links -->
      <div class="d-flex align-items-center gap-3">
        <a class="nav-link" href="#" :class="{ activeLink: $route.path === '/' }" @click.prevent="go('/')">Home</a>
<a class="nav-link" href="#" :class="{ activeLink: $route.path === '/profile' }" @click.prevent="go('/profile')">Profile</a>

<!-- Links shown when user is NOT logged in -->
<template v-if="!isLoggedIn">
  <a class="nav-link" href="#" :class="{ activeLink: $route.path === '/signin' }" @click.prevent="go('/signin')">SignIn</a>

  <a class="nav-link" href="#" :class="{ activeLink: $route.path === '/signup' }" @click.prevent="go('/signup')">Signup</a>
</template>

<!-- Links shown when user IS logged in -->
<template v-else>
  <a class="nav-link" href="#" :class="{ activeLink: $route.path === '/create' }" @click.prevent="go('/create')">Create</a>
  <button class="nav-link" @click="handleLogout">SignOut</button>
</template>

      </div>
    </div>
  </nav>
</template>


<script>
import { userService } from "@/services/user.service"

export default {
  data() {
    return {
      isLoggedIn: false
    }
  },

  mounted() {
    this.checkLogin()
  },

  watch: {
    // Re-check login state whenever the route changes
    $route() {
      this.checkLogin()
    }
  },

  methods: {
 go(path) {
    // If user clicks the SAME page, hard refresh
    if (this.$route.path === path) {
      window.location.reload()
      return
    }
    // Otherwise normal navigation
    this.$router.push(path)
  },
  
     // Check authentication status using stored session token
    checkLogin() {
      const token = localStorage.getItem("session_token")
      this.isLoggedIn = token ? true : false
    },

      // Log out user, clear local session, and redirect to signin
    handleLogout() {
      this.error = ""

      userService.signOut()
        .then(() => {
          this.isLoggedIn = false
          this.$router.push("/signin")
        })
        .catch(() => {
          localStorage.removeItem("user_id")
          localStorage.removeItem("session_token")
          this.isLoggedIn = false
          this.$router.push("/")
        })
    }
  }
}
</script>

<style scoped>
/*navbar look */
.navbar#custom-nav {
  background: rgba(11, 12, 15, 0.9);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
  padding-top: 1.2rem;     
  padding-bottom: 1.0rem;
}

.navbar-brand {
  color: var(--text);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
}

.nav-link {
  color: var(--muted);
  text-decoration: none;
  font-size: 1.1rem;
}

.nav-link.router-link-active,
.nav-link:hover {
  color: var(--text);
  text-decoration: underline;
}

.navbar-brand:hover,.navbar-brand:focus {
  color: var(--text);
  
}

/* Active link underline styling */
.nav-link.activeLink {
  color: var(--text) !important;
  text-decoration: underline !important;
  text-underline-offset: 4px !important;
}


#brand-logo {
  height: 48px;       
  width: auto;
   object-fit: contain; 
}

</style>

