const barChartData = {
    type: "bar",
    data: {
      labels: ["",],
      datasets: [
        {
          label: "Water",
          data: [12,],
          backgroundColor: [
            "#27316A",
          ],
          borderColor: [
            "#27316A",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
        responsive: true,
        plugins: {
          legend: {
            position: "left",
          },
          title: {
            display: true,
            text: "Progress today",
          },
        },
      },
    };
    
    export default barChartData;