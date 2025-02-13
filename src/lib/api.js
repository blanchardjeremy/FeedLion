export async function fetchAPI(endpoint, { method = 'POST', body = null, headers = {} } = {}) {
  // Ensure we have an absolute URL for server-side requests
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  console.log(`🌐 fetchAPI called:
  - Endpoint: ${endpoint}
  - Full URL: ${url}
  - Method: ${method}
  - Body: ${JSON.stringify(body)}`);

  try {
    console.log('📡 Making fetch request...');
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    console.log('📦 Response received:', {
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) {
      console.error('❌ API error:', data.error || 'Something went wrong');
      throw new Error(data.error || 'Something went wrong');
    }

    return { data, error: null };
  } catch (err) {
    console.error('❌ fetchAPI error:', err.message);
    console.error('Stack:', err.stack);
    return {
      data: null,
      error: err.message || 'Something went wrong',
    };
  }
} 