export function runtimeEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value : "";
}
