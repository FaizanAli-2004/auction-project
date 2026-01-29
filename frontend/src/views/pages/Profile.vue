<!-- Profile page: shows the signed-in user's details plus lists for selling, bidding on, and ended auctions -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="section-title mb-1">Profile</h1>
        <div class="text-subtitle">Manage your auctions and bids</div>
      </div>
    </div>

    <div v-if="error" class="alert error-alert">{{ error }}</div>
    <div v-if="loading" class="grey-text">Loading...</div>

    <div v-if="profile && !loading">
      <!-- Top profile info card -->
      <div class="card custom-card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-semibold" style="font-size: 1.25rem;">
              {{ profile.first_name }} {{ profile.last_name }}
            </div>
            <span v-if="profile" class="fw-semibold">
               User Id: <span class="fw-semibold">{{ profile.user_id }}</span>
                </span>
            <div class="fw-semibold">
  Email: {{ myEmail }}
</div>
              
            <div class="text-subtitle">
              Signed-in account
            </div>
          </div>

          <router-link class="btn btn-secondary" :to="'/users/' + profile.user_id">
            Your Profile as Public view
          </router-link>
        </div>
      </div>

      
      <div class="row g-3">
        <!-- Selling -->
        <div class="col-4">
          <div class="card custom-card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <b>Selling</b>
              <span class="total-count-badge">{{ profile.selling.length }}</span>
            </div>

            <div class="card-body">
              <div v-if="profile.selling.length === 0" class="grey-text">
                No active listings
              </div>

              <ul class="list-group" v-else>
                <li
                  class="list-group-item custom-list d-flex justify-content-between align-items-center"
                  v-for="(i, index) in profile.selling"
                  :key="index"
                >
                  <div class="me-2">
                    <div class="fw-semibold">{{ i.name }}</div>
                    <div class="text-subtitle">Auction active</div>
                  </div>

                  <router-link class="btn btn-secondary btn-sm" :to="'/item/' + i.item_id">
                    View
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bidding On -->
        <div class="col-4">
          <div class="card custom-card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <b>Bidding On</b>
              <span class="total-count-badge">{{ profile.bidding_on.length }}</span>
            </div>

            <div class="card-body">
              <div v-if="profile.bidding_on.length === 0" class="grey-text">
                You haven’t bid on anything yet
              </div>

              <ul class="list-group" v-else>
                <li
                  class="list-group-item custom-list d-flex justify-content-between align-items-center"
                  v-for="(i, index) in profile.bidding_on"
                  :key="index"
                >
                  <div class="me-2">
                    <div class="fw-semibold">{{ i.name }}</div>
                    <div class="text-subtitle">You placed a bid  {{ bidStatus(i) }} </div>
                  </div>

                  <router-link class="btn btn-secondary btn-sm" :to="'/item/' + i.item_id">
                    View
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Auctions Ended -->
        <div class="col-4">
          <div class="card custom-card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <b>Auctions Ended</b>
              <span class="total-count-badge">{{ profile.auctions_ended.length }}</span>
            </div>

            <div class="card-body">
              <div v-if="profile.auctions_ended.length === 0" class="grey-text">
                No ended auctions
              </div>

              <ul class="list-group" v-else>
                <li
                  class="list-group-item custom-list d-flex justify-content-between align-items-center"
                  v-for="(i, index) in profile.auctions_ended"
                  :key="index"
                >
                  <div class="me-2">
                    <div class="fw-semibold">{{ i.name }}</div>
                    <div class="text-subtitle">Bidding closed</div>
                  </div>

                  <router-link class="btn btn-secondary btn-sm" :to="'/item/' + i.item_id">
                    View
                  </router-link>
                </li>
              </ul>
            </div>
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
      profile: null,
      loading: true,
      error: ""
    }
  },

  methods: {
  bidStatus(item) {
    const now = Math.floor(Date.now() / 1000)
    return item.end_date <= now
      ? "• Auction ended"
      : "• Auction active"
  }
},

  mounted() {
    // Fetch logged-in user's profile
    const userId = localStorage.getItem("user_id")

    this.loading = true
    this.error = ""

    userService.getProfile(userId)
      .then((profile) => {
        this.profile = profile
        this.loading = false
      })
      .catch((err) => {
        this.error = err
        this.loading = false
      })
  },
  
  // Gets the logged-in user's email from localStorage
  computed: {
  myEmail() {
    return localStorage.getItem("user_email") || ""
  }
}

}
</script>


