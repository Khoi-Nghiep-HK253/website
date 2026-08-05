import { useEffect, useRef } from 'react';

interface UseDocumentTitleOptions {
  /** Restore the previous title when component unmounts (default: false) */
  restoreOnUnmount?: boolean;
  /** Suffix to append to title, e.g. "AppName" -> "Page Title | AppName" */
  suffix?: string;
}

/**
 * Custom hook to update the browser tab title (document.title)
 *
 * @param title - The title for the current page
 * @param options - Additional options (suffix, restoreOnUnmount)
 */
export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {}
) {
  const { restoreOnUnmount = false, suffix } = options;
  const previousTitle = useRef(document.title);

  useEffect(() => {
    const formattedTitle = suffix ? `${title} | ${suffix}` : title;
    document.title = formattedTitle;

    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitle.current;
      }
    };
  }, [title, suffix, restoreOnUnmount]);
}

export default useDocumentTitle;
