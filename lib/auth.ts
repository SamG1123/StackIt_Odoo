export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("stackit_loggedIn") === "1"
}

/* simple helper to set the flag in your login success block */
export function setLoggedIn() {
  if (typeof window !== "undefined")
    localStorage.setItem("stackit_loggedIn", "1")
}
export function logout() {
  if (typeof window !== "undefined")
    localStorage.removeItem("stackit_loggedIn")
}
