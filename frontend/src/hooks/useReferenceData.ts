import { useEffect, useState } from "react";
import { getSuppliers, getAgreementTypes, getScales } from "../api/client";
import { RefSupplier, RefAgreementType, RefScale } from "../types/agreement";

export function useReferenceData() {
  const [suppliers, setSuppliers] = useState<RefSupplier[]>([]);
  const [agreementTypes, setAgreementTypes] = useState<RefAgreementType[]>([]);
  const [scales, setScales] = useState<RefScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, sc] = await Promise.all([getSuppliers(), getAgreementTypes(), getScales()]);
        setSuppliers(s);
        setAgreementTypes(t);
        setScales(sc);
      } catch {
        setError("Не удалось загрузить справочники");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { suppliers, agreementTypes, scales, loading, error };
}
