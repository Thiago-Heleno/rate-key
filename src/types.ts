export interface ApiKey {
  key: string;
  is_rate_limited: boolean;
  rate_limit_time: number; // Represents hours
  rateLimitedAt: number | null; // Timestamp (ms) when rate limit started, or null
}

export interface Service {
  name: string;
  api_keys: ApiKey[];
}
