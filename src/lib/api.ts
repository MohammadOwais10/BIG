// Central API client for the BigTrade backend.
// Access token is kept in memory + localStorage; refresh token rotates via /auth/refresh.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const ACCESS_KEY = "big_access_token";
const REFRESH_KEY = "big_refresh_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export class ApiError extends Error {
  status: number;
  errorCode?: string;
  details?: { field: string; message: string }[];

  constructor(status: number, message: string, errorCode?: string, details?: any) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) return false;

    setTokens(json.data.accessToken, json.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // Single-flight token refresh on expiry
  if (res.status === 401 && auth && getRefreshToken()) {
    refreshing = refreshing ?? tryRefresh();
    const ok = await refreshing;
    refreshing = null;

    if (ok) {
      headers.Authorization = `Bearer ${getAccessToken()}`;
      res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } else {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json.success === false) {
    throw new ApiError(
      res.status,
      json.message || "Request failed",
      json.errorCode,
      json.details,
    );
  }

  return json as T;
}

export function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ---- Typed API surface ----

export const api = {
  // auth
  register: (body: { name: string; email: string; mobile: string; password: string; referralCode?: string }) =>
    apiFetch("/auth/register", { method: "POST", body, auth: false }),
  login: (identifier: string, password: string) =>
    apiFetch("/auth/login", { method: "POST", body: { identifier, password }, auth: false }),
  logout: () =>
    apiFetch("/auth/logout", { method: "POST", body: { refreshToken: getRefreshToken() } }),
  verifyEmail: (email: string, code: string) =>
    apiFetch("/auth/verify-email", { method: "POST", body: { email, code }, auth: false }),
  resendOtp: (email: string) =>
    apiFetch("/auth/resend-otp", { method: "POST", body: { email }, auth: false }),
  forgotPassword: (email: string) =>
    apiFetch("/auth/forgot-password", { method: "POST", body: { email }, auth: false }),
  resetPassword: (email: string, code: string, newPassword: string) =>
    apiFetch("/auth/reset-password", { method: "POST", body: { email, code, newPassword }, auth: false }),

  // user
  me: () => apiFetch("/users/me"),
  updateMe: (body: { name?: string; mobile?: string }) =>
    apiFetch("/users/me", { method: "PATCH", body }),
  dashboard: () => apiFetch("/dashboard"),

  // investments
  createInvestment: (amount: number, idempotencyKey?: string) =>
    apiFetch("/investments", { method: "POST", body: { amount, idempotencyKey } }),
  topUpInvestment: (investmentId: string, amount: number) =>
    apiFetch("/investments/top-up", { method: "POST", body: { investmentId, amount } }),
  investments: (page = 1, limit = 10, status?: string) =>
    apiFetch(`/investments${qs({ page, limit, status })}`),
  investment: (id: string) => apiFetch(`/investments/${id}`),

  // wallet
  wallet: () => apiFetch("/wallet"),
  transactions: (page = 1, limit = 10, type?: string) =>
    apiFetch(`/wallet/transactions${qs({ page, limit, type })}`),

  // withdrawals
  createWithdrawal: (amount: number, destinationAddress: string, idempotencyKey?: string) =>
    apiFetch("/withdrawals", { method: "POST", body: { amount, destinationAddress, idempotencyKey } }),
  principalWithdrawal: (investmentId: string, destinationAddress: string) =>
    apiFetch("/withdrawals/principal", { method: "POST", body: { investmentId, destinationAddress } }),
  principalEligibility: (investmentId: string) =>
    apiFetch(`/withdrawals/principal/${investmentId}/eligibility`),
  withdrawals: (page = 1, limit = 10, status?: string) =>
    apiFetch(`/withdrawals${qs({ page, limit, status })}`),

  // referrals & roi
  referrals: (page = 1, limit = 10) => apiFetch(`/referrals${qs({ page, limit })}`),
  referralTree: () => apiFetch("/referrals/tree"),
  referralsByLevel: (level: number, page = 1, limit = 10) =>
    apiFetch(`/referrals/level/${level}${qs({ page, limit })}`),
  commissions: (page = 1, limit = 10, type?: string) =>
    apiFetch(`/referrals/commissions${qs({ page, limit, type })}`),
  commissionStats: () => apiFetch("/referrals/commissions/stats"),
  referralStats: () => apiFetch("/referrals/stats"),
  roiSummary: () => apiFetch("/roi"),
  roiHistory: (page = 1, limit = 10) => apiFetch(`/roi/history${qs({ page, limit })}`),

  // deposits (crypto)
  depositConfig: (network = "BEP20") => apiFetch(`/deposits/config${qs({ network })}`),
  submitDeposit: (txHash: string, network = "BEP20") =>
    apiFetch("/deposits/crypto", { method: "POST", body: { txHash, network } }),
  recheckDeposit: (id: string) =>
    apiFetch(`/deposits/${id}/recheck`, { method: "POST" }),
  deposits: (page = 1, limit = 10) => apiFetch(`/deposits${qs({ page, limit })}`),

  // daily roi
  myDailyRoi: (page = 1, limit = 20) => apiFetch(`/daily-roi/my${qs({ page, limit })}`),
  myRewards: () => apiFetch("/rewards/my"),

  // admin
  adminDashboard: () => apiFetch("/admin/dashboard"),
  dailyRoiCycle: (date?: string) => apiFetch(`/admin/daily-roi/cycle${qs({ date })}`),
  dailyRoiHistory: (page = 1, limit = 20) => apiFetch(`/admin/daily-roi/history${qs({ page, limit })}`),
  dailyRoiPayouts: (date?: string, page = 1, limit = 20, status?: string) =>
    apiFetch(`/admin/daily-roi/payouts${qs({ date, page, limit, status })}`),
  dailyRoiSaveDraft: (body: { roiDate: string; ratePercent: number; reason?: string }) =>
    apiFetch("/admin/daily-roi/draft", { method: "POST", body }),
  dailyRoiValidate: (body: { roiDate: string; ratePercent: number }) =>
    apiFetch("/admin/daily-roi/validate", { method: "POST", body }),
  dailyRoiPublish: (body: { roiDate: string; ratePercent?: number; reason?: string }) =>
    apiFetch("/admin/daily-roi/publish", { method: "POST", body }),
  dailyRoiProcess: (roiDate: string) =>
    apiFetch("/admin/daily-roi/process", { method: "POST", body: { roiDate } }),
  dailyRoiExclusions: (date?: string) =>
    apiFetch(`/admin/daily-roi/exclusions${qs({ date })}`),
  supportCreate: (body: { subject: string; message: string }) =>
    apiFetch("/support", { method: "POST", body }),
  supportMy: (page = 1, limit = 10) => apiFetch(`/support/my${qs({ page, limit })}`),
  adminSupport: (page = 1, limit = 20, status?: string) =>
    apiFetch(`/admin/support${qs({ page, limit, status })}`),
  adminReplyTicket: (id: string, body: { reply?: string; status?: string }) =>
    apiFetch(`/admin/support/${id}`, { method: "PATCH", body }),
  dailyRoiSetExclusion: (body: { roiDate: string; userId: string; excluded: boolean; reason?: string }) =>
    apiFetch("/admin/daily-roi/exclusions", { method: "POST", body }),
  adminDeposits: (page = 1, limit = 10, status?: string) =>
    apiFetch(`/admin/deposits${qs({ page, limit, status })}`),
  adminDepositWallets: () => apiFetch("/admin/deposit-wallets"),
  adminAddDepositWallet: (network: string, address: string) =>
    apiFetch("/admin/deposit-wallets", { method: "POST", body: { network, address } }),
  adminRemoveDepositWallet: (id: string) =>
    apiFetch(`/admin/deposit-wallets/${id}`, { method: "DELETE" }),
  adminUsers: (page = 1, limit = 10, search?: string, status?: string) =>
    apiFetch(`/admin/users${qs({ page, limit, search, status })}`),
  adminUser: (id: string) => apiFetch(`/admin/users/${id}`),
  adminCreateUser: (body: any) => apiFetch("/admin/users", { method: "POST", body }),
  adminUpdateUser: (id: string, body: any) =>
    apiFetch(`/admin/users/${id}`, { method: "PATCH", body }),
  adminUpdateUserStatus: (id: string, status: string) =>
    apiFetch(`/admin/users/${id}/status`, { method: "PATCH", body: { status } }),
  adminAdjustWallet: (id: string, amount: number, reason: string) =>
    apiFetch(`/admin/users/${id}/wallet/adjust`, { method: "POST", body: { amount, reason } }),
  adminInvestments: (page = 1, limit = 10, status?: string, userId?: string) =>
    apiFetch(`/admin/investments${qs({ page, limit, status, userId })}`),
  adminUpdateInvestmentStatus: (id: string, status: string, remarks?: string) =>
    apiFetch(`/admin/investments/${id}/status`, { method: "PATCH", body: { status, remarks } }),
  adminWithdrawals: (page = 1, limit = 10, status?: string) =>
    apiFetch(`/admin/withdrawals${qs({ page, limit, status })}`),
  adminApproveWithdrawal: (id: string, remarks?: string) =>
    apiFetch(`/admin/withdrawals/${id}/approve`, { method: "PATCH", body: { remarks } }),
  adminRejectWithdrawal: (id: string, reason: string) =>
    apiFetch(`/admin/withdrawals/${id}/reject`, { method: "PATCH", body: { reason } }),
  adminCompleteWithdrawal: (id: string, txHash?: string) =>
    apiFetch(`/admin/withdrawals/${id}/complete`, { method: "PATCH", body: txHash ? { txHash } : {} }),
  adminSetGlobalRoi: (roiPercent: number, period: string) =>
    apiFetch("/admin/roi/global", { method: "POST", body: { roiPercent, period } }),
  adminGlobalRoi: () => apiFetch("/admin/roi/global"),
  adminSetUserRoi: (userId: string, roiPercent: number, period: string) =>
    apiFetch(`/admin/roi/user/${userId}`, { method: "POST", body: { roiPercent, period } }),
  adminDeleteUserRoi: (userId: string, period?: string) =>
    apiFetch(`/admin/roi/user/${userId}${qs({ period })}`, { method: "DELETE" }),
  adminRoiHistory: (page = 1, limit = 10, period?: string) =>
    apiFetch(`/admin/roi/history${qs({ page, limit, period })}`),
  adminRunRoi: (period: string) =>
    apiFetch("/admin/roi/process", { method: "POST", body: { period } }),
  adminCommissions: (page = 1, limit = 10, type?: string) =>
    apiFetch(`/admin/commissions${qs({ page, limit, type })}`),
  adminTransactions: (page = 1, limit = 10, type?: string, userId?: string) =>
    apiFetch(`/admin/transactions${qs({ page, limit, type, userId })}`),
  adminAuditLogs: (page = 1, limit = 10) =>
    apiFetch(`/admin/audit-logs${qs({ page, limit })}`),
  adminSettings: () => apiFetch("/admin/settings"),
  adminUpdateSetting: (key: string, value: string) =>
    apiFetch("/admin/settings", { method: "PATCH", body: { key, value } }),
};

// Formatting helpers — backend returns Decimals as strings
export const fmtUsd = (v: string | number | null | undefined) => {
  const n = Number(v ?? 0);
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export const newIdemKey = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
