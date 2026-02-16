import axios, { type AxiosResponse, type AxiosRequestConfig } from "axios";

// const Base_Url = "https://bhuvanpaudel.com.np/haripur/api/v1"; // Set your base URL here
// const Base_Url = "https://haripurcms.tachyonwave.com.np/haripur/api/v1"; // Set your base URL here
const Base_Url = "https://api.bhuvanpaudel.com.np/haripur/api/v1"; // Set your base URL here

import { getApiHeaders } from "@/lib/api-headers";

// Types for API functions
interface ApiRequestConfig {
  url: string;
  headers?: Record<string, string>;
}

interface ApiPostConfig {
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
}

interface ApiPutConfig {
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
}

interface ApiPatchConfig {
  url: string;
  data?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

interface ApiDeleteConfig {
  url: string;
  headers?: Record<string, string>;
}

// GET request
export async function Get({
  url,
  headers = {},
}: ApiRequestConfig): Promise<unknown> {
  try {
    const defaultHeaders = getApiHeaders();
    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response: AxiosResponse = await axios.get(Base_Url + url, {
      headers: mergedHeaders,
    });
    return response.data;
  } catch (error) {
    console.error("Error while making GET request:", error);
    throw error;
  }
}

// POST request
export async function Post({
  url,
  data = {},
  headers = {},
}: ApiPostConfig): Promise<unknown> {
  try {
    const defaultHeaders = getApiHeaders();
    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response: AxiosResponse = await axios.post(Base_Url + url, data, {
      headers: mergedHeaders,
    });
    return response.data;
  } catch (error) {
    console.error("Error while making POST request:", error);
    throw error;
  }
}

// PUT request
export async function Put({
  url,
  data = {},
  headers = {},
}: ApiPutConfig): Promise<unknown> {
  try {
    const defaultHeaders = getApiHeaders();
    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response: AxiosResponse = await axios.put(Base_Url + url, data, {
      headers: mergedHeaders,
    });
    return response.data;
  } catch (error) {
    console.error("Error while making PUT request:", error);
    throw error;
  }
}

// PATCH request (partial update)
export async function Patch({
  url,
  data = {},
  config = {},
}: ApiPatchConfig): Promise<unknown> {
  try {
    const defaultHeaders = getApiHeaders();
    const mergedHeaders = { ...defaultHeaders, ...config.headers };
    const mergedConfig = { ...config, headers: mergedHeaders };

    const response: AxiosResponse = await axios.patch(
      Base_Url + url,
      data,
      mergedConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error while making PATCH request:", error);
    throw error;
  }
}

// DELETE request
export async function Delete({
  url,
  headers = {},
}: ApiDeleteConfig): Promise<unknown> {
  try {
    const defaultHeaders = getApiHeaders();
    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response: AxiosResponse = await axios.delete(Base_Url + url, {
      headers: mergedHeaders,
    });
    return response.data;
  } catch (error) {
    console.error("Error while making DELETE request:", error);
    throw error;
  }
}
