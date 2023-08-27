import { useQueryHistory } from "@/hooks/useQueryHistory";
import Link from "next/link";

export default function History() {
  const { queryHistory } = useQueryHistory();
  const queriesAsLinks = queryHistory.map((q) =>
    Object.entries(JSON.parse(q)).reduce(
      (link, pair) => (pair[1] ? `${link}&${pair[0]}=${pair[1]}` : link),
      ""
    )
  );

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Search History</h1>
      <div className="card glass">
        <div className="card-body">
          <ul>
            {!queryHistory.length ? (
              <li>No history yet</li>
            ) : (
              queriesAsLinks.map((q, i) => {
                q = q.replace("&", "?");
                return (
                  <li className="mb-2" key={i}>
                    <Link className="link link-secondary" href={`/${q}`}>
                      {q}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
