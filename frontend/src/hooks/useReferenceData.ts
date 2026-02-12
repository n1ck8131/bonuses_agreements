import { useEffect, useState } from "react";
import { getSuppliers, getAgreementTypes } from "../api/client";
import { RefSupplier, RefAgreementType } from "../types/agreement";

export function useReferenceData() {
  const [suppliers, setSuppliers] = useState<RefSupplier[]>([]);
  const [agreementTypes, setAgreementTypes] = useState<RefAgreementType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t] = await Promise.all([getSuppliers(), getAgreementTypes()]);
        setSuppliers(s);
        setAgreementTypes(t);
      } catch {
        setError("Не удалось загрузить справочники");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { suppliers, agreementTypes, loading, error };
}
