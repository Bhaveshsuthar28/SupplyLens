import { useEffect } from "react";

export function useDocumentTitle(page) {
  useEffect(() => {
    document.title = page ? `${page} | SupplyLens` : "SupplyLens";
  }, [page]);
}
