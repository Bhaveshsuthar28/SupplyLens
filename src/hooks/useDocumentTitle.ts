import { useEffect } from "react";

export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} | SupplyLens` : "SupplyLens";
  }, [page]);
}
