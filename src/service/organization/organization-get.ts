import { api } from "../api/api";

export function getOrganizations(type: string) {
  return api.get("/organization/linked", {
    params: {
      type,
    },
  });
}
