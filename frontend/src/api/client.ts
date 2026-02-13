import { Agreement, AgreementCreate, AgreementStatus, RefSupplier, RefAgreementType, RefScale } from "../types/agreement";
import { LoginRequest, Token, User } from "../types/auth";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const TOKEN_KEY = "access_token";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const login = async (data: LoginRequest): Promise<Token> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.json();
};

export const createAgreement = async (data: AgreementCreate): Promise<Agreement> => {
  const response = await fetch(`${API_BASE_URL}/agreements`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create agreement");
  }

  return response.json();
};

export const getAgreements = async (): Promise<Agreement[]> => {
  const response = await fetch(`${API_BASE_URL}/agreements`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch agreements");
  }

  return response.json();
};

export const getAgreement = async (id: string): Promise<Agreement> => {
  const response = await fetch(`${API_BASE_URL}/agreements/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("Соглашение не найдено");
    throw new Error("Failed to fetch agreement");
  }

  return response.json();
};

export const updateAgreement = async (id: string, data: AgreementCreate): Promise<Agreement> => {
  const response = await fetch(`${API_BASE_URL}/agreements/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update agreement");
  }

  return response.json();
};

export const updateAgreementStatus = async (
  id: string,
  status: AgreementStatus
): Promise<Agreement> => {
  const response = await fetch(`${API_BASE_URL}/agreements/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update agreement status");
  }

  return response.json();
};

export const getSuppliers = async (): Promise<RefSupplier[]> => {
  const response = await fetch(`${API_BASE_URL}/ref/suppliers`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch suppliers");
  }

  return response.json();
};

export const getAgreementTypes = async (): Promise<RefAgreementType[]> => {
  const response = await fetch(`${API_BASE_URL}/ref/agreement-types`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch agreement types");
  }

  return response.json();
};

export const getScales = async (): Promise<RefScale[]> => {
  const response = await fetch(`${API_BASE_URL}/ref/scales`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch scales");
  }

  return response.json();
};
