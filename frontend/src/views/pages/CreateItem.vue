<!-- Template for creating a new auction item (watch listing) -->
<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-7">
      <div class="card custom-card">
        <div class="card-header">
          <h4 class="mb-0 section-title">List a Watch</h4>
          <div class="text-subtitle">Create a new auction listing</div>
        </div>

        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <label class="form-label">Name</label>
            <input class="form-control mb-2" v-model="name" placeholder="e.g., Rolex Submariner 124060" />
            <div class="text-danger small" v-show="submitted && !name">Name required</div>

            <label class="form-label mt-3">Description</label>
            <textarea class="form-control mb-2" v-model="description" rows="3"
              placeholder="Condition, year, box/papers, service history..."></textarea>
            <div class="text-danger small" v-show="submitted && !description">Description required</div>

            <label class="form-label mt-3">Starting bid</label>
            <input class="form-control mb-2" type="number" v-model="starting_bid" />
            <div class="text-danger small" v-show="submitted && !starting_bid">Starting bid required</div>

            <label class="form-label mt-3">End Date & Time</label>
            <input class="form-control mb-2" type="datetime-local" v-model="endDateTime" />
            <div class="text-danger small" v-show="submitted && !endDateTime">
              End date and time is required
            </div>

            <button class="btn btn-primary w-100 mt-3" type="submit">
              Create Auction
            </button>

            <div v-if="error" class="alert error-alert mt-3 mb-0">
              {{ error }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<!--
  Create Item page logic: Handles form validation
   Converts date to unix timestamp
   Calls backend to create auction
-->
<script>
import { coreService } from "@/services/core.service"

export default {
  data() {
    return {
      name: "",
      description: "",
      starting_bid: "",
      endDateTime: "",
      submitted: false,
      error: ""
    }
  },

  methods: {
    // Handles form validation and sends create-item request to the backend
    handleSubmit() {
      this.submitted = true
      this.error = ""

      if (!(this.name && this.description && this.starting_bid && this.endDateTime)) return

     const endDateUnix = Math.floor(
    new Date(this.endDateTime).getTime() / 1000
)

      const token = localStorage.getItem("session_token")

      coreService.createItem({
        name: this.name,
        description: this.description,
        starting_bid: Number(this.starting_bid),
        end_date: endDateUnix  
      }, token)
        .then((resJson) => {
          this.$router.push("/item/" + resJson.item_id)
        })
        .catch((err) => {
          this.error = err
        })
    }
  }
}
</script>
