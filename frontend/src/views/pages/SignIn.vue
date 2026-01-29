 <!-- Sign-in page for existing users -->
<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-5">
      <div class="card custom-card">
        <div class="card-header">
          <h4 class="mb-0 section-title">Signin</h4>
          <div class="text-subtitle">Access your watch bidding account</div>
        </div>

        <div class="card-body">
           <!-- Login form -->
          <form @submit.prevent="handleSubmit">
            <label class="form-label">Email</label>
            <input class="form-control mb-2" type="email" v-model="email" />
            <div class="text-danger small" v-show="submitted && !email">Email is required</div>

            <label class="form-label mt-3">Password</label>
            <input class="form-control mb-2" type="password" v-model="password" />
            <div class="text-danger small" v-show="submitted && !password">Password is required</div>

            <button class="btn btn-primary w-100 mt-3" type="submit">Login</button>

            <div v-if="error" class="alert error-alert mt-3 mb-0">
              {{ error }}
            </div>
          </form>

           <!-- Link to signup page -->
          <div class="text-center mt-3 text-subtitle">
            Don’t have an account?
            <router-link to="/signup" class="gold-link fw-semibold">
              Sign up now
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/user.service"

export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      error: ""
    }
  },

  methods: {
    // Handles login form submission and redirects on success
    handleSubmit() {
      this.submitted = true
      this.error = ""

      if (!(this.email && this.password)) return

      userService.signIn(this.email, this.password)
        .then(() => {
           localStorage.setItem("user_email", this.email) 
          this.$router.push("/")
        })
        .catch((err) => {
          this.error = err
        })
    }
  }
}
</script>

