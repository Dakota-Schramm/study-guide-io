import { BaseUserConfig } from "./base";

export class RestrictedAccessUserConfig extends BaseUserConfig {
  async initialize() {
    const root = await navigator.storage.getDirectory();
    await super.initialize(root);
  }
}
