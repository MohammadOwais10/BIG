"use client";

import { useEffect, useState } from "react";
import { api, fmtDate } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Spinner, EmptyState, Pager } from "@/components/app/ui";

export default function AdminAudit() {
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .adminAuditLogs(page, 20)
      .then((r) => {
        setList(r.data.logs);
        setTotalPages(r.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <PageHeader title="Audit logs" sub="Every admin action, traceable" />
      <Card title="Activity">
        {loading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="No admin actions recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">Admin</th>
                  <th className="pb-2 pr-4">Action</th>
                  <th className="pb-2 pr-4">Target</th>
                  <th className="pb-2 pr-4">IP</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((l) => (
                  <tr key={l.id} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-[#CBD6EC]">{l.admin?.name}</p>
                      <p className="text-xs text-[#5F7099]">{l.admin?.email}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-[#7FA8FF]">{l.action}</td>
                    <td className="py-3 pr-4 text-xs text-[#8FA3CC]">
                      {l.targetType ?? "—"}
                      {l.targetUser ? ` · ${l.targetUser.name}` : ""}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-[#5F7099]">{l.ipAddress ?? "—"}</td>
                    <td className="py-3 text-xs text-[#8FA3CC]">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </Card>
    </>
  );
}
