// Worker entry: handles /api/contact and serves everything else from ./public.
import { handleContact, methodNotAllowed } from "./contact.js";

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") {
      return request.method === "POST" ? handleContact(request, env, ctx) : methodNotAllowed();
    }
    return env.ASSETS.fetch(request);
  },
};
