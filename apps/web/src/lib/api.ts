const API_URL = "http://127.0.0.1:8000";

const api = {
  post: async (url: string, data: unknown) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData?.detail || "Request failed"
      );
    }

    return {
      data: responseData,
    };
  },

  get: async (url: string) => {
    const response = await fetch(`${API_URL}${url}`);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData?.detail || "Request failed"
      );
    }

    return {
      data: responseData,
    };
  },
};

export default api;