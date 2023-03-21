import { useState } from "react";

export default function withState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  type F = () => Promise<any>;

  async function wrapper(f: F) {
    setLoading(true);

    await f()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    loading,
    error,
    data,
    wrapper,
  };
}
