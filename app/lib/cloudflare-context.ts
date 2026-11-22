import { createContext, type RouterContextProvider } from "react-router";

export type CloudflareContextValue = {
	ctx: ExecutionContext;
	env: Env;
};

export const cloudflareContext = createContext<CloudflareContextValue>();

export function getCloudflare(
	context: Readonly<RouterContextProvider>,
): CloudflareContextValue {
	return context.get(cloudflareContext);
}
