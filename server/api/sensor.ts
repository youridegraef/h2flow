export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const response = await fetch("https://api/192.168.123.16/api/sensor-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body.processedData),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API response:", data);

    return {
      data,
    };
  } catch (error) {
    console.error("Error:", error);

    // Check if the error is a fetch error
    if (error instanceof TypeError && error.message === 'fetch failed') {
      return {
        error: "Failed to fetch data from the server. Please check the server URL and network connection.",
      };
    }

    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
});