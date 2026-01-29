<!-- Signup page for creating a new user account -->
<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-6">
      <div class="card custom-card">
        <div class="card-header">
          <h4 class="mb-0 section-title">Create Account</h4>
          <div class="text-subtitle">Join luxury watch auctions</div>
        </div>

        <div class="card-body">
          <!-- Signup form -->
          <form @submit.prevent="handleSubmit">
            <label class="form-label">First name</label>
            <input class="form-control mb-2" v-model="first_name" />
            <div class="text-danger small" v-show="submitted && !first_name">First name required</div>

            <label class="form-label mt-3">Last name</label>
            <input class="form-control mb-2" v-model="last_name" />
            <div class="text-danger small" v-show="submitted && !last_name">Last name required</div>

            <label class="form-label mt-3">Email</label>
            <input class="form-control mb-2" v-model="email" />
            <div class="text-danger small" v-show="submitted && !email">Email is required</div>

            <label class="form-label mt-3">Password</label>
            <input class="form-control mb-2" type="password" v-model="password" />
            <div class="text-danger small" v-show="submitted && !password">Password required</div>

            <label class="form-label mt-3">Confirm password</label>
            <input class="form-control mb-2" type="password" v-model="confirmPassword"/>
            <div class="text-danger small" v-show="submitted && password !== confirmPassword">Passwords do not match</div>

            <button class="btn btn-primary w-100 mt-3" type="submit">
              Create Account
            </button>

            <div v-if="error" class="alert error-alert mt-3 mb-0">
              {{ error }}
            </div>
          </form>

         <!-- Link to sign-in page -->
          <div class="text-center mt-3 text-subtitle">
            Already have an account?
            <router-link to="/signin" class="gold-link fw-semibold">
              Sign in
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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      submitted: false,
      error: ""
    }
  },

  methods: {
     // Handles signup form submission and redirects on success
    handleSubmit() {
      this.submitted = true
      this.error = ""

      if (!(this.first_name && this.last_name && this.email && this.password)) return
      if (this.password !== this.confirmPassword) { this.error = "Passwords do not match"
 return
}

      userService.signUp({
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password
      })
        .then(() => {
          this.$router.push("/signin")
        })
        .catch((err) => {
          this.error = err
        })
    }
  }
}
</script>
