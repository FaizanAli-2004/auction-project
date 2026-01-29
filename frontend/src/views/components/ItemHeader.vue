<!-- Item header showing main auction details (title, seller, dates, pricing) -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <h2 class="mb-1">{{ item.name }}</h2>
        <div class="text-subtitle mb-2">{{ item.description }}</div>
      </div>
    </div>

    <hr />
    
      <!-- Item metadata -->
    <div class="row g-2">
      <div class="col-6">
        <div class="text-subtitle">Seller</div>
        <div class="fw-semibold">
          <router-link class="link-gold" :to="'/users/' + item.creator_id">
            {{ item.first_name }} {{ item.last_name }}
          </router-link>
        </div>
      </div>


       <div class="col-6">
        <div class="text-subtitle">Starts</div>
        <div class="fw-semibold">{{ startDate.toLocaleString() }}</div>
      </div>
       
        <div class="col-6">
        <div class="text-subtitle">Item Id</div>
        <div class="fw-semibold">{{ item.item_id }}</div>
      </div>

      <div class="col-6">
        <div class="text-subtitle">Auction ends</div>
        <div class="fw-semibold">{{ endDate.toLocaleString() }}</div>
      </div>

      <div class="col-6">
        <div class="text-subtitle">Starting bid</div>
        <div class="fw-semibold">{{ item.starting_bid }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Receives item details and formatted start/end dates from parent
  props: { item: Object, startDate: Date, endDate: Date }
}
</script>

