import { apiLogin } from "../api/api-login";

export function refreshToken(body: { refreshToken: string }) {
  return apiLogin.post("/session/refresh", body);
}
