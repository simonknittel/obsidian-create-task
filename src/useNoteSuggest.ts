import {
  AbstractInputSuggest,
  App,
  prepareFuzzySearch,
  renderMatches,
  SearchResult,
  sortSearchResults,
  TFile,
} from "obsidian";
import { useCallback, useEffect, useRef } from "react";

interface NoteSuggestion {
  readonly file: TFile;
  readonly match: SearchResult;
}

/**
 * Suggests the notes of the vault in the same way as the file picker of the
 * settings tab.
 */
class NoteSuggest extends AbstractInputSuggest<NoteSuggestion> {
  protected getSuggestions(query: string): NoteSuggestion[] {
    const fuzzySearch = prepareFuzzySearch(query);

    const suggestions = this.app.vault.getMarkdownFiles().flatMap((file) => {
      const match = fuzzySearch(file.path);
      return match ? [{ file, match }] : [];
    });

    sortSearchResults(suggestions);
    return suggestions;
  }

  renderSuggestion({ file, match }: NoteSuggestion, element: HTMLElement) {
    element.addClass("mod-nowrap");
    renderMatches(element, file.path.replace(/\.md$/, ""), match.matches);
  }
}

/**
 * Returns a ref callback that adds note suggestions to a text input.
 *
 * Obsidian cannot remove a suggest from an input. Thus, the ref callback adds
 * only one suggest to an input, also if React calls the ref callback again.
 */
export const useNoteSuggest = (app: App, onSelect: (path: string) => void) => {
  const latestOnSelect = useRef(onSelect);
  const attachedInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    latestOnSelect.current = onSelect;
  }, [onSelect]);

  return useCallback(
    (input: HTMLInputElement | null) => {
      if (!input || input === attachedInput.current) return;
      attachedInput.current = input;

      const noteSuggest = new NoteSuggest(app, input).onSelect(({ file }) => {
        latestOnSelect.current(file.path);
        noteSuggest.close();
      });
    },
    [app],
  );
};
