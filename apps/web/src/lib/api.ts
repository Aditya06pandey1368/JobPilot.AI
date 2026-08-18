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

    const dataResponse = await response.json();

    if (!response.ok) {
      throw new Error(dataResponse.detail || "Request failed");
    }

    return {
      data: dataResponse,
    };
  },

  get: async (url: string) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Request failed");
    }

    return {
      data,
    };
  },
};

export default api;