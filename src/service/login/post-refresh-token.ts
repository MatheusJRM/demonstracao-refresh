import { apiLogin } from "../api/api-login";

export function sendRefreshToken(body: { refreshToken: string }) {
  return apiLogin.post("/session/refresh", body);
}
