<template>
  <div class="flex gap-4">
    <div
      v-for="i in 14"
      :key="i"
      class="relative bg-[#D9D9D9] rounded-md h-40 w-full flex flex-col-reverse"
    >
      <div
        class="relative w-full bg-[#27316A] bottom-0 rounded-md"
        :style="{ height: (value[i] / goal) * 100 + '%' }"
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
    },
  },
};
</script>
