import "obsidian";

declare module "obsidian" {
  interface App {
    /**
     * Internal API of Obsidian. It is not part of the public API, thus it can
     * change or disappear without notice.
     */
    setting?: {
      open?: () => void;
      openTabById?: (id: string) => void;
    };
  }
}
