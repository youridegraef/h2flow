<template>
  <div class="flex gap-8">
    <div
      v-for="i in 1"
      :key="i"
      class="relative bg-[#D9D9D9] rounded-md w-full h-10 flex flex-row"
    >
      <div
        class="relative h-full bg-[#27316A] rounded-md"
        :style="{ width: (value[i] / goal) * 100 + '%' }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineProps } from "vue";

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    goal: {
        type: Number,
        required: true,
    }
  },

};

</script>
