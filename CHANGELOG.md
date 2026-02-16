# Changelog

All notable changes will be documented in this file.

## [Unreleased]

## Changed

- The publish process now includes a build step so generated files are present at publish time.

## 4.0.0

**This release contains backwards-incompatible changes.**

## **Added**

- Automatic and configurable **rate limiting** to prevent API overuse and ensure compliance with ClickUp’s rate limits.
- New client instantiation entry point: **`createClickup()`** for clearer configuration and future extensibility.

## **Changed**

- Replaced **`got`** with **`ofetch`** as the internal HTTP client for a lighter, modern, ESM-friendly implementation.
- Normalized all API errors via the new **`ClickupAPIError`** class, providing consistent error structures and improved debugging.
- Top-level resources have been renamed to **singular** forms for a more intuitive API (e.g., `client.tasks.get()` → `client.task.get()`).
- `addAttachment` now requires a **`FormData`** instance for its `attachment` parameter, improving compatibility across environments.
