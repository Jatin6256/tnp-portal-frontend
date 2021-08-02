import axios from "axios";

/**
 * @param {String} url Path relative to baseUrl
 * @param {String} method Request method
 * @param {String} token Authorization token
 * @param {Object.<String, String>} data Data to pass
 * @param {Object.<String, String>} headers Additional headers to pass
 *
 */
export default function axiosUtil(url, method, token, data, headers) {
  if (!headers) headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return axios({
    method,
    url,
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    data,
    headers,
  });
}
