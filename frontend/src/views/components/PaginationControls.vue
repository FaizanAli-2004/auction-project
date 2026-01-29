  <!-- Pagination controls for navigating between result pages -->
<template>
  <div class="d-flex gap-2 mt-3">
    <button class="btn btn-secondary" @click="$emit('prev')" :disabled="offset === 0">
      Prev
    </button>

    <button class="btn btn-secondary" @click="$emit('next')" :disabled="disableNext">
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    offset: Number,
    disableNext: Boolean
  }
}
</script>
