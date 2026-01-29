<!-- Home page: search, filter, and browse auction items with pagination  -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="section-title mb-1">Auctions</h1>
        <div class="text-subtitle">Browse and bid on luxury watches</div>
      </div>
      <span class="total-count-badge"><span class="custom-semibold">Results:</span> {{ items.length }}</span>
    </div>

    <!-- Search and filter card -->
    <div class="card custom-card mb-3">
      <div class="card-body">
        <form class="row g-3 align-items-end" @submit.prevent="handleSearch">
          <div class="col-5">
            <label class="form-label">Search</label>
            <input class="form-control" v-model="q" type="text" placeholder="e.g., Omega" />
          </div>

          <!-- Status filter -->
          <div class="col-3">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="status">
              <option value="ALL">All</option>
              <option value="OPEN">Open</option>
              <option value="BID">Bid-On</option>
              <option value="ARCHIVE">Archive</option>
            </select>
          </div>

          <!-- Page size selector -->
          <div class="col-2">
            <label class="form-label">Limit</label>
            <select class="form-select" v-model="limit">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>

          <div class="col-2">
            <button class="btn btn-primary w-100" type="submit">Search</button>
          </div>

        </form>
      </div>
    </div>

    <div v-if="error" class="alert error-alert">{{ error }}</div>
    <div v-if="loading" class="grey-text">Loading...</div>

      <!-- Search results list -->
    <div v-if="!loading">
      <div v-if="items.length === 0" class="custom-semibold">
        No items found
      </div>

      <!-- Render each auction item -->
      <ItemRow
  v-for="item in items"
  :key="item.item_id"
  :item="item"
  :timeLeftText="timeLeft(item.end_date)"
/>

      <!-- Pagination controls -->
      <PaginationControls
  :offset="offset"
  :disableNext="disableNext"
  @prev="prevPage"
  @next="nextPage"
/>

    </div>
  </div>
</template>


<script>
import { coreService } from "@/services/core.service"
import ItemRow from "@/views/components/ItemRow.vue"
import PaginationControls from "@/views/components/PaginationControls.vue"

export default {
  components: {
    ItemRow,
    PaginationControls
  },

  data() {
    return {
      items: [],
      q: "",
      status: "",
      limit: 20,
      offset: 0,
      submitted: false, 
      error: "",
      loading: true
    }
  },

  // Loads the first page of items when the page opens
  mounted() {
    this.fetchItems()
  },

  methods: {
      // Build query string for /search using current filters + pagination
     buildQuery() {
  let query = "?"

  if (this.q) { query += "q=" + encodeURIComponent(this.q) + "&" }

  if (this.status && this.status !== "ALL") {query += "status=" + this.status + "&"}

  query += "limit=" + this.limit + "&offset=" + this.offset
  return query
},

     // Fetches items from the backend based on current filters + pagination state
    fetchItems() {
      this.loading = true
      this.error = ""

      const queryParams = this.buildQuery()

      coreService.searchItems(queryParams)
        .then((items) => {
          this.items = items
          this.loading = false

           // Refresh current_bid for each item by fetching full item details
          items.forEach((item, index) => {
            coreService.getSingleItem(item.item_id)
              .then((fullItem) => {
                this.items[index].current_bid = fullItem.current_bid
              })
              .catch(() => {})
          })
        })
        .catch((err) => {
          this.error = err
          this.loading = false
        })
    },

    // Applies search filters (q/status), resets to page 1, then reloads results
     handleSearch() {
  this.submitted = true
  this.offset = 0
  this.fetchItems()
},

    nextPage() {
      this.offset += this.limit
      this.fetchItems()
    },

    prevPage() {
      if (this.offset >= this.limit) {
        this.offset -= this.limit
        this.fetchItems()
      }
    },

    // Converts end_date (unix seconds) into a simple "time left" string for the UI
    timeLeft(endUnix) {
  const now = Math.floor(Date.now() / 1000)
  let difference = endUnix - now

  if (difference <= 0) return "Auction Ended"

  const days = Math.floor(difference / 86400)
  difference = difference % 86400

  const hours = Math.floor(difference / 3600)
  difference = difference % 3600

  const mins = Math.floor(difference / 60)

  if (days > 0) return days + "d " + hours + "h"
  if (hours > 0) return hours + "h " + mins + "m"
  return mins + "m"
},

  },

  computed: {
     // Disables "Next" when we received fewer items than the page size (last page)
    disableNext() {
      return this.items.length < this.limit
    }
  },
}
</script>

