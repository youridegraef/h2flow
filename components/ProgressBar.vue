<template>
  <div class="flex gap-8">
    <div class="relative bg-[#D9D9D9] rounded-md w-full h-10 flex flex-row">
      <div
        class="relative h-full bg-[#27316A] rounded-md"
        :style="{ width: (value / goal) * 100 + '%' }"
      ></div>
    </div>
    <p class="font-semibold">{{ value }} / {{ goal }} mL</p>
  </div>
</template>

<script lang="ts">
import { defineProps, watch } from "vue";

export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    watch(
      () => props.value,
      (newValue) => {
        console.log("Updated value:", newValue);
      }
    );
    watch(
      () => props.goal,
      (newGoal) => {
        console.log("Updated goal:", newGoal);
      }
    );
  },
};
</script>
