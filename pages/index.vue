<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="grid grid-cols-12 gap-4 w-full max-w-screen-lg">
      <div class="flex flex-row gap-2 rounded-2xl col-span-12">
        <Bluetooth />
      </div>
      <div
        class="p-12 flex flex-row justify-between items-center bg-gray-200 rounded-2xl col-span-7 h-40"
      >
        <img class="h-12" src="~/assets/H2flow.svg" />
        <div class="flex flex-row gap-4 items-center">
          <!-- <NuxtLink to="/settings"
            ><img class="h-12" src="~/assets/Settings.svg"
          /></NuxtLink> -->
        </div>
      </div>
      <div
        class="p-8 flex flex-row items-center gap-4 bg-gray-200 rounded-2xl col-span-5"
      >
        <img class="h-16" src="~/assets/Profile.svg" />
        <div>
          <h3 class="">Welcome back,</h3>
          <h3 class="text-2xl font-bold">{{ name }}</h3>
        </div>
      </div>
      <div class="p-12 flex flex-col gap-4 bg-gray-200 rounded-2xl col-span-7">
        <h3 class="font-semibold text-3xl">Your progress today:</h3>
        <ProgressBar :value="todayWeight" :goal="goal" />
      </div>
      <div class="p-12 bg-gray-200 rounded-2xl col-span-5 h-full">
        <h3 text-lg>Your goal today:</h3>
        <h3 class="text-6xl font-bold text-[#27316A]">{{ goal }} mL</h3>
        <input
          type="number"
          v-model.number="newGoal"
          class="mt-4 p-2 border rounded"
          min="0"
          step="100"
          placeholder="Enter your goal"
        />
        <button
          @click="updateGoal"
          class="bg-[#27316A] text-white p-2 rounded-md"
        >
          Submit
        </button>
      </div>
      <div
        class="p-12 bg-gray-200 flex flex-col gap-8 rounded-2xl col-span-12 h-full"
      >
        <h3 class="font-semibold text-3xl">
          Your progress the last two weeks:
        </h3>
        <BarChart :value="last14DaysWeights" :goal="goal" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";

export default defineComponent({
  setup() {
    interface SensorData {
      id: number;
      user_id: number;
      weight: string;
      date: string;
    }
    interface UserData {
      id: number;
      name: string;
      weight: number;
    }

    const userData = ref<UserData[]>([]);
    const data = ref<SensorData[]>([]);
    const name = ref("");
    const goal = ref(0);
    const newGoal = ref(0);
    const userId = 1;

    const url = "https://192.168.123.16/api/sensor-data";
    const usersUrl = "https://192.168.123.16/api/users";

    const fetchData = async () => {
      try {
        data.value = await $fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          retry: 0,
        });
        console.log("Data fetched:", data.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        userData.value = await $fetch(usersUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          retry: 0,
        });
        const user = userData.value.find((user) => user.id === userId);
        if (user) {
          name.value = user.name;
          goal.value = user.weight * 35;
        } else {
          console.error("User data not found for id:", userId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const groupedWeights = computed(() => {
      return data.value
        .filter((item) => item.user_id === userId) // Filter for the current user
        .reduce((acc: Record<string, number>, item) => {
          // Normalize the date to 'YYYY-MM-DD'
          const normalizedDate = item.date.split(" ")[0]; // Extract date part
          if (!acc[normalizedDate]) {
            acc[normalizedDate] = 0;
          }
          acc[normalizedDate] += parseInt(item.weight, 10); // Sum up weights
          return acc;
        }, {});
    });

    const todayWeight = computed(() => {
      const today = new Date().toISOString().split("T")[0]; // Get today's date
      return groupedWeights.value[today] || 0; // Return today's total weight or 0
    });

    const last14DaysWeights = computed(() => {
      const dates = [...Array(14).keys()]
        .map((daysAgo) => {
          const date = new Date();
          date.setDate(date.getDate() - daysAgo); // Subtract days
          return date.toISOString().split("T")[0]; // Normalize to 'YYYY-MM-DD'
        })
        .reverse(); // Ensure chronological order
      return dates.map((date) => groupedWeights.value[date] || 0); // Map to weights or 0
    });

    const updateGoal = () => {
      if (newGoal.value > 0) {
        goal.value = newGoal.value;
      }
    };

    onMounted(() => {
      fetchData();
      fetchUserData();

      const interval = setInterval(() => {
        fetchData();
        fetchUserData();
      }, 10000); // 10 seconds

      // Clear interval on unmount
      onUnmounted(() => {
        clearInterval(interval);
      });
    });

    return {
      data,
      todayWeight,
      last14DaysWeights,
      goal,
      newGoal,
      updateGoal,
      name,
    };
  },
});
</script>
