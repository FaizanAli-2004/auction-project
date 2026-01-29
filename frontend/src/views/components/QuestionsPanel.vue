<!-- Displays item questions, answers, and allows asking/answering based on user role -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h3 class="mb-0">Questions</h3>
      <span class="total-count-badge">
        <span class="custom-semibold">Total questions:</span>
        {{ questions.length }}
      </span>
    </div>

    <!-- Empty state -->
    <div v-if="questions.length === 0" class="text-subtitle grey-text mb-3">
      No questions yet
    </div>

    <!-- Questions list -->
    <ul v-else class="list-group mb-3">
      <li
        v-for="(q, index) in questions"
        :key="index"
        class="list-group-item custom-list"
      >
        <!-- Question -->
        <div class="fw-semibold">Q: {{ q.question_text }}</div>

        <!-- Answer (if exists) -->
        <div v-if="q.answer_text" class="text-subtitle mt-1">
          <span class="custom-semibold">A:</span> {{ q.answer_text }}
        </div>

        <!-- No answer yet + seller answer form (only when: no answer, logged in, seller, auction open) -->
        <div v-else>
          <div class="text-subtitle grey-text mt-2">(No answer yet)</div>

          <div v-if="canAnswer" class="mt-2 d-flex gap-2">
            <input
              class="form-control"
              v-model="answerTexts[q.question_id]"
              placeholder="Write answer"
            />
            <button class="btn btn-secondary" @click="submitAnswer(q.question_id)">
              Answer
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Bottom area: messages / ask form -->
    <div v-if="!isLoggedIn" class="text-subtitle">
      Please <router-link class="gold-link" to="/signin">sign in</router-link> to ask a question.
    </div>

    <div v-else>
      <div v-if="auctionEnded" class="text-subtitle custom-semibold">
        Auction has ended. Questions are closed.
      </div>

      <div v-else-if="isSeller" class="custom-semibold">
        You are the seller. You cannot ask a question on your own item.
        Answer questions here.
      </div>

      <div v-else>
        <h4 class="mb-2">Ask a question</h4>
        <form @submit.prevent="submitQuestion">
          <input
            class="form-control mb-2"
            v-model="questionText"
            placeholder="Type your question..."
          />
          <div class="text-danger small" v-show="qSubmitted && !questionText">
            Question is required
          </div>
          <button class="btn btn-primary" type="submit">Ask</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { questions: Array, isLoggedIn: Boolean, isSeller: Boolean, auctionEnded: Boolean },

  data() {
    return { questionText: "", qSubmitted: false, answerTexts: {} }
  },

  methods: {
    submitQuestion() {
      this.qSubmitted = true
      if (!this.questionText) return

      this.$emit("ask", this.questionText)

      this.questionText = ""
      this.qSubmitted = false
    },

    submitAnswer(questionId) {
      const ans = this.answerTexts[questionId]
      if (!ans) return

      this.$emit("answer", { questionId: questionId, answerText: ans })

      this.answerTexts[questionId] = ""
    }
  },

  computed: {
    canAnswer() {
      return this.isLoggedIn && this.isSeller && !this.auctionEnded
    }
  }
}
</script>
