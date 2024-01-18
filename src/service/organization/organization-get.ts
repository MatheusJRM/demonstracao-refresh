import { AxiosInstance } from "axios";

export function getOrganizations(api: AxiosInstance, type: string) {
  return api.get("/organization/linked", {
    params: {
      type,
    },
  });
}
