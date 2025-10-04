// Simple test function to verify Supabase Edge Functions are working
Deno.serve((req) => {
  return new Response(
    JSON.stringify({
      message: "Test function is working!",
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
});