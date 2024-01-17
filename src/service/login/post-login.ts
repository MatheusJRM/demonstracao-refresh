import { apiLogin } from "../api/api-login";

export function createSession(body: { login: string; password: string }) {
  return apiLogin.post("/session", body);
}
