export async function fetchAPI(endpoint, { method = 'POST', body = null, headers = {} } = {}) {
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.message || 'Something went wrong',
    };
  }
} 