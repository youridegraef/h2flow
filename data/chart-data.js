const barChartData = {
    type: "bar",
    data: {
      labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      datasets: [
        {
          label: "Water",
          data: [12, 19, 3, 2, 3, 2, 6, 12, 19, 3, 2, 3, 2, 6],
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
            position: "top",
          },
          title: {
            display: true,
            text: "Progress in the past 14 days",
          },
        },
      },
    };
    
    export default barChartData;