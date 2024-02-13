import { BaseUserConfig } from "./base";

export class RestrictedAccessUserConfig extends BaseUserConfig {
  async initialize() {
    const root = await navigator.storage.getDirectory();
    await super.initialize(root);
  }

  async estimateStorage() {
    const estimate = await navigator.storage.estimate();
    const percentage = (estimate.usage / estimate.quota) * 100;
    const quota = `${(estimate.quota / 1024 / 1024).toFixed(2)}MB`;

    return { percentage, quota };
  }
}
