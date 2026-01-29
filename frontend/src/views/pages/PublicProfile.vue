  <!-- Public user profile page showing seller info and auction history -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="section-title mb-1">User Profile</h1>
        <div class="text-subtitle">Public seller information</div>
      </div>
    </div>

    <div v-if="error" class="alert error-alert">{{ error }}</div>
    <div v-if="loading" class="grey-text">Loading...</div>

    <div v-if="profile && !loading">
      <!-- Top user info card -->
      <div class="card custom-card mb-3">
        <div class="card-body">
          <div class="fw-semibold" style="font-size: 1.25rem;">
            {{ profile.first_name }} {{ profile.last_name }}
          </div>
          <span v-if="profile" class="fw-semibold">
               User Id: <span class="fw-semibold">{{ profile.user_id }}</span>
                </span> 
          <div class="text-subtitle">
            Public profile view
          </div>
        </div>
      </div>

      <div class="row g-3">
        <!-- Selling -->
        <div class="col-6">
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

        <!-- Auctions Ended -->
        <div class="col-6">
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

         <!--Bidding On -->
        <div class="col-12">
          <div class="card custom-card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <b>Bidding ON</b>
            </div>

            <div class="card-body">
             <div class="text-subtitle">
                Bidding activity is not shown on public profiles because of privacy reasons.
              </div>
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

  // Loads public profile data and hides private bidding info
  mounted() {
    const userId = this.$route.params.id

    this.loading = true
    this.error = ""

    userService.getProfile(userId)
      .then((profile) => {
        profile.bidding_on = []
        this.profile = profile
        this.loading = false
      })
      .catch((err) => {
        this.error = err
        this.loading = false
      })
  }
}
</script>
