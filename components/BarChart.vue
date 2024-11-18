<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-4 justify-between">
      <div v-for="i in 14" :key="i">
        <div
          class="relative bg-[#D9D9D9] rounded-md h-40 w-12 flex flex-col-reverse"
        >
          <div
            class="relative w-full bg-[#27316A] bottom-0 rounded-md"
            :style="{ height: (value[i] / goal) * 100 + '%' }"
          ></div>
        </div>
        <p class="text-xs text-center mt-2 font-semibold">{{ value[i] }} mL</p>
      </div>
      <!-- <p class="text-xs" v-for="j in 14">{{ value[j] }} mL</p> -->
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
