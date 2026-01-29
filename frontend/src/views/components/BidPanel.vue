<!-- Bid panel: shows current bid info and allows users to place bids -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h3 class="mb-0">Bidding</h3>
    </div>

    <!-- Bid info (same UI, labels change based on auctionEnded) -->
    <div class="text-subtitle mb-2">
      {{ auctionEnded ? "Winner bid holder:" : "Current bid holder:" }}
      <template v-if="item.current_bid_holder">
        <router-link class="link-gold" :to="'/users/' + item.current_bid_holder.user_id">
          {{ item.current_bid_holder.first_name }} {{ item.current_bid_holder.last_name }}
        </router-link>
      </template>
      <template v-else>
        <span class="grey-text">No bids yet</span>
      </template>
    </div>

    <div class="text-subtitle mb-2">
      {{ auctionEnded ? "Winning bid:" : "Current bid:" }}
      <span class="fw-semibold text-white">{{ item.current_bid }}</span>
      
    </div>

    <!-- Winning status message -->
    <div v-if="isLoggedIn && isWinning && auctionEnded" class="mt-1 mb-0">
      You won this auction.
      
    </div>

    <div v-else-if="isLoggedIn && isWinning" class="mt-1 mb-0">
      You are currently the highest bidder.
    </div>
     <hr />

    <!-- Bidding UI -->
    <div v-if="!isLoggedIn" class="text-subtitle">
      Please <router-link class="gold-link" to="/signin">sign in</router-link> to bid.
    </div>

    <div v-else>
      <!-- Auction closed message -->
      <div v-if="auctionEnded" class="text-subtitle custom-semibold">
        Auction has ended. Bidding is closed.
      </div>

      <!-- Seller restriction (only when auction still open) -->
      <div v-else-if="isSeller" class="custom-semibold">
        You are the seller. You can’t bid on your own item.
      </div>

      <!-- Bid form (only when logged in, not seller, and auction open) -->
      <div v-else>
        <form @submit.prevent="submitBid" >
          <label class="form-label">Your bid</label>
          <input class="form-control mb-2" type="number" step="any" v-model="bidAmount" />
          <div v-if="bidError" class="text-danger">
  {{ bidError }}
</div>

           
          <div class="text-danger small" v-show="submitted && !bidAmount">
            Bid amount is required
          </div>

          <button class="btn btn-primary w-100" type="submit" :disabled="showConfirm">
            Place Bid
          </button>

          <div class="custom-semibold mt-2">Payment options :</div>

          <div class="d-flex gap-3 align-items-center">
            <i class="bi bi-credit-card fs-5"></i>
            <i class="bi bi-paypal fs-5"></i>
            <i class="bi bi-apple fs-5"></i>
            <i class="bi bi-google fs-5"></i>
            <i class="bi bi-stripe"></i>
          </div>
        </form>

        <!-- Confirmation popup before submitting bid -->
        <div v-if="showConfirm" id="popUp_place">
          <div id="popUp_background">
            <h5 class="mb-2">Confirm bid</h5>
            <div class="mb-3">
              Are you sure you want to place a bid of <b>£{{ bidAmount }}</b>?
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="confirmBid">Confirm</button>
              <button class="btn btn-secondary" @click="cancelConfirm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { item: Object, isLoggedIn: Boolean, isSeller: Boolean },

  data() {
    return { bidAmount: "", submitted: false, showConfirm: false, bidError: ""}
  },

  methods: {
    submitBid() {
      this.submitted = true
      this.bidError = ""
      if (this.auctionEnded) return
      if (!this.bidAmount) return
      if (!Number.isInteger(Number(this.bidAmount))) {
    this.bidError = "Please enter a whole number (no pennies allowed)."
    return
  }

   this.showConfirm = true
    },

    confirmBid() {
      this.$emit("bid-placed", Number(this.bidAmount))

      this.showConfirm = false
      this.bidAmount = ""
      this.submitted = false
    },

    cancelConfirm() {
      this.showConfirm = false
    }
  },

  computed: {
    myUserId() {
      const v = localStorage.getItem("user_id")
      return v ? parseInt(v, 10) : null
    },

    auctionEnded() {
      const now = Math.floor(Date.now() / 1000)
      return this.item && this.item.end_date <= now
    },

    isWinning() {
      if (!this.item || !this.item.current_bid_holder) return false
      return this.item.current_bid_holder.user_id === this.myUserId
    }
  }
}
</script>

<style scoped>
#popUp_place {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

#popUp_background {
  background: #07132c;
  border: 3px solid #602727;
  border-radius: 14px;
  padding: 16px;
  width: 420px; 
}
</style>
