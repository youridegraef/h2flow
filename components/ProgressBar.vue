<template>
  <div class="flex gap-8">
    <div class="relative bg-[#D9D9D9] rounded-md w-full h-10 flex flex-row">
      <div
        class="relative h-full bg-[#27316A] rounded-md"
        :style="{ width: (value[1] / goal) * 100 + '%' }"
      ></div>
    </div>
  </div>

  <p class="font-semibold">{{ value[1] }} / {{ goal }} mL</p>
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
    },
  },
};
</script>
