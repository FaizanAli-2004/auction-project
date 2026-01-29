<!-- Auction detail page showing item info, bidding, bid history, and Q&A -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h1 class="section-title mb-1">Auction</h1>
        <div class="section-title ">Item details, bidding, and questions</div>
      </div>
    </div>

    <div v-if="error" class="alert error-alert d-flex justify-content-center">{{ error }}</div>
    <div v-if="loading" class="grey-text">Loading...</div>

    <div v-if="item && !loading">
      <div class="row g-3">
        <div class="col-8">
          <!-- Item info -->
          <div class="card custom-card mb-3">
            <div class="card-body">
              <ItemHeader :item="item" :startDate="startDate" :endDate="endDate" />
            </div>
          </div>

          <!-- Questions and Answers -->
          <div class="card custom-card">
            <div class="card-body">
              <QuestionsPanel
                :questions="questions"
                :isLoggedIn="isLoggedIn"
                :isSeller="isSeller"
                :auctionEnded="auctionEnded"
                @ask="handleQuestion"
                @answer="handleAnswer"
              />
            </div>
          </div>
        </div>

        <div class="col-4">
          <!-- Bid panel -->
          <div class="card custom-card mb-3">
            <div class="card-body">
              <BidPanel
                :item="item"
                :isLoggedIn="isLoggedIn"
                :isSeller="isSeller"
                @bid-placed="handleBid"
              />
            </div>
          </div>

          <!-- Bid history -->
          <div class="card custom-card">
            <div class="card-body">
              <BidHistory :bids="bids" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { coreService } from "@/services/core.service"
import { questionService } from "@/services/question.service"

import ItemHeader from "@/views/components/ItemHeader.vue"
import BidPanel from "@/views/components/BidPanel.vue"
import BidHistory from "@/views/components/BidHistory.vue"
import QuestionsPanel from "@/views/components/QuestionsPanel.vue"

export default {
  components: {
    ItemHeader,
    BidPanel,
    BidHistory,
    QuestionsPanel
  },

  data() {
    return {
      item: null,
      startDate: new Date(),
      endDate: new Date(),
      bids: [],
      questions: [],
      error: "",
      loading: true
    }
  },

  mounted() {
    // Load item, bids, and questions/answers when page opens
    this.loadPage()
  },

  methods: {
     // Fetch item details, bid history, and questions/answers
    loadPage() {
      this.loading = true
      this.error = ""

      const id = this.$route.params.id

      coreService.getSingleItem(id)
        .then((item) => {
          this.item = item
          this.startDate = new Date(item.start_date * 1000)
          this.endDate = new Date(item.end_date * 1000)
          return coreService.getBidHistory(id)
        })
        .then((bids) => {
          this.bids = bids
          return questionService.getQuestions(id)
        })
        .then((qs) => {
          this.questions = qs
          this.loading = false
        })
        .catch((err) => {
          this.error = err
          this.loading = false
        })
    },

     // Place a bid and refresh item + bid history
    handleBid(amount) {
      this.error = ""
      const token = localStorage.getItem("session_token")
      const id = this.$route.params.id

      coreService.placeBid(id, amount, token)
        .then(() => { // refresh item + bids
          return coreService.getSingleItem(id) 
        })
        .then((item) => {
          this.item = item
          return coreService.getBidHistory(id)
        })
        .then((bids) => {
          this.bids = bids
        })
        .catch((err) => {
          this.error = err
        })
    },

     // Submit a new question and refresh questions list
    handleQuestion(questionText) {
      this.error = ""
      const token = localStorage.getItem("session_token")
      const id = this.$route.params.id

      questionService.askQuestion(id, questionText, token)
        .then(() => {
          return questionService.getQuestions(id)
        })
        .then((qs) => {
          this.questions = qs
        })
        .catch((err) => {
          this.error = err
        })
    },

      // Submit an answer and refresh questions list
    handleAnswer(payload) {
      this.error = ""
      const token = localStorage.getItem("session_token")
      const itemId = this.$route.params.id

      questionService.answerQuestion(payload.questionId, payload.answerText, token)
        .then(() => {
          return questionService.getQuestions(itemId)
        })
        .then((qs) => {
          this.questions = qs
        })
        .catch((err) => {
          this.error = err
        })
    }
  },

  computed: {
     // True if a session token exists
    isLoggedIn() { 
      return !!localStorage.getItem("session_token")
    },
    myUserId() { // Logged-in user's ID 
      const v = localStorage.getItem("user_id")
      return v ? parseInt(v, 10) : null
    },
    isSeller() {
      if (!this.item) return false
      return this.myUserId === this.item.creator_id
    },
  auctionEnded() {
    if (!this.item) return false
    const now = Math.floor(Date.now() / 1000)
    return this.item.end_date <= now
  }
  }
}
</script>

