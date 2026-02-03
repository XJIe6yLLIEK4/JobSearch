export const config =  {
  base_url: __ENV.BASE_URL,
  seed_count: parseInt(__ENV.SEED_COUNT, 10),
  timeout: __ENV.HTTP_TIMEOUT
};