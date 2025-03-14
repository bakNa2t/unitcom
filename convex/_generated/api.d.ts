/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as contact from "../contact.js";
import type * as contacts from "../contacts.js";
import type * as conversation from "../conversation.js";
import type * as conversations from "../conversations.js";
import type * as friend_request from "../friend_request.js";
import type * as friend_requests from "../friend_requests.js";
import type * as http from "../http.js";
import type * as message from "../message.js";
import type * as messages from "../messages.js";
import type * as status from "../status.js";
import type * as user from "../user.js";
import type * as _utils_utils from "../_utils/utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  contact: typeof contact;
  contacts: typeof contacts;
  conversation: typeof conversation;
  conversations: typeof conversations;
  friend_request: typeof friend_request;
  friend_requests: typeof friend_requests;
  http: typeof http;
  message: typeof message;
  messages: typeof messages;
  status: typeof status;
  user: typeof user;
  "_utils/utils": typeof _utils_utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
