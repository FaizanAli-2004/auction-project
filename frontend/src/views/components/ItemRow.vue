 <!-- Single auction item row used in search results -->
<template>
  <div class="card custom-card mb-2">
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <div class="custom-semibold">
          <router-link class="custom-semibold" :to="'/item/' + item.item_id">
            {{ item.name }}
          </router-link>
        </div>

        <!-- Seller name, current bid, and time left -->
        <div class="text-subtitle mt-1">
          By
          <router-link class="link-gold" :to="'/users/' + item.creator_id">
            {{ item.first_name }} {{ item.last_name }}
          </router-link>

          <span class="ms-2 total-count-badge ">
            <span class="custom-semibold ">Current Bid:</span>
            {{ item.current_bid ?? "N/A" }}
          </span>

          <span class="ms-2 total-count-badge">
            <span class="custom-semibold">Time Left:</span>
            {{ timeLeftText }}
          </span>
        </div>
      </div>

      <!-- Link to full item details page -->
      <router-link class="btn btn-secondary" :to="'/item/' + item.item_id">
        View
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  // Item data and pre formatted time-left text from parent
  props: {
    item: Object,
    timeLeftText: String
  }
}
</script>
