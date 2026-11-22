import { createRequestHandler, RouterContextProvider } from "react-router";
import { cloudflareContext } from "../app/lib/cloudflare-context";

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		const loadContext = new RouterContextProvider();
		loadContext.set(cloudflareContext, { ctx, env });
		return requestHandler(request, loadContext);
	},
} satisfies ExportedHandler<Env>;
