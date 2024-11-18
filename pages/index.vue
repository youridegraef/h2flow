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
        <ProgressBar :value="totalWeights" :goal="goal" />
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
        <!-- <p>{{ totalWeights }}</p> -->
        <BarChart :value="totalWeights" :goal="goal" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";

export default defineComponent({
  setup() {
    interface SensorData {
      user_id: number;
      date: string;
      weight: string;
    }
    interface UserData {
      id: number;
      name: string;
      weight: number; // Assume bodyweight is in kilograms
    }

    const userData = ref<UserData[]>([]);
    const data = ref<SensorData[]>([]);
    const name = ref(""); // Variable for the user's name
    const goal = ref(0); // Default goal
    const newGoal = ref(0); // Value from the input field

    let userId = 1; // Set the user_id to filter by

    const url = "https://192.168.123.16/api/sensor-data";
    const usersUrl = "https://192.168.123.16/api/users";

    const fetchData = async () => {
      try {
        data.value = await $fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          retry: 0, // Disable retries
        });
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
          retry: 0, // Disable retries
        });
        const user = userData.value.find((user) => user.id == userId);
        if (user) {
          name.value = user.name; // Set the name from user data
          goal.value = user.weight * 35; // 35ml per kg
        } else {
          console.error("User data not found for id:", userId);
        } 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const totalWeights = computed(() => {
      // const userId = 1; // Set the user_id to filter by
      const grouped = data.value
        .filter((item) => item.user_id === userId) // Filter by user_id
        .reduce(
          (
            acc: Record<string, number>,
            item: { date: string; weight: string }
          ) => {
            if (!acc[item.date]) {
              acc[item.date] = 0;
            }
            acc[item.date] += parseInt(item.weight, 10);
            return acc;
          },
          {}
        );
      return Object.values(grouped); // Extract only the total weights
    });

    const updateGoal = () => {
      if (newGoal.value > 0) {
        goal.value = newGoal.value; // Convert to milliliters if needed
      }
    };
    
    onMounted(() => {
      fetchData();
      fetchUserData();
    });

    return {
      data,
      totalWeights,
      goal,
      newGoal,
      updateGoal,
      name,
    };
  },
});
</script>
