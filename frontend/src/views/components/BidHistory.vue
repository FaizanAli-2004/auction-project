<!-- Displays the list of bids placed on an item -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h3 class="mb-0">Bid History</h3>
      
     <span class="total-count-badge">
    <span class="custom-semibold">Total Bids:   </span>
    {{ bids.length }}
  </span>
    </div>

    <!-- Message shown when no bids exist -->
    <div v-if="bids.length === 0" class="text-subtitle grey-text">
      No bids yet
    </div>

    <!-- List of bids -->
    <ul v-else class="list-group">
      <li
        v-for="(b, index) in bids"
        :key="index"
        class="list-group-item custom-list d-flex justify-content-between align-items-center">

        <!-- Bid amount and bidder info -->
        <div>
          <div class="fw-semibold">{{ b.amount }}</div>
          <div class="text-subtitle">
            <router-link class="gold-link" :to="'/users/' + b.user_id">
              {{ b.first_name }} {{ b.last_name }}
            </router-link>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: { bids: Array }
}
</script>

