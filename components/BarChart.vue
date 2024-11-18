<template>
    <div>
        <!-- <canvas id="bar-chart"></canvas> -->
        <Bar2 :value="barChartData" />
    </div>
</template>

<script>
import Bar2 from './BarChart1.vue';
import { Chart, registerables } from 'chart.js';
import barChartData from "../data/chart-data";

export default {
    name: "BarChart",
    data() {
        return {
            barChartData
        }
    },
    async mounted() {
        const ctx = document.getElementById("bar-chart");
        Chart.register(...registerables);

            // const data = ref(null);
    const url = "https://192.168.123.16/api/sensor-data";

    let data = await $fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          retry: 0, // Disable retries
    });


    const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - 14);

    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= pastDate && itemDate <= currentDate;
    });

    const combinedData = Array(14).fill(0);
    filteredData.forEach((item) => {
        const itemDate = new Date(item.date);
        const dayIndex = Math.floor((currentDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
        combinedData[13 - dayIndex] += parseFloat(item.weight);
    });

    console.log(combinedData);
    this.barChartData = combinedData

    // values = data.value.map(() => {
        
    // })
    // const fetchData = async () => {
    //   try {
    //     data.value = await $fetch(url, {
    //       method: "GET",
    //       headers: {
    //         Accept: "application/json",
    //       },
    //       retry: 0, // Disable retries
    //     });
    //     console.log(data);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    //     new Chart(ctx, this.barChartData);
    }
};
</script>

