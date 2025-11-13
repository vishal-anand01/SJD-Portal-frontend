import React, { useEffect, useMemo, useState } from "react";
import axios from "../../../api/axiosConfig";
import ViewOfficerModal from "../models/ViewOfficerModal";

export default function OfficerList() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  // UI state
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const rowsPerPageOptions = [8, 20, 50];

  // simple sort
  const [sort, setSort] = useState({ field: "createdAt", dir: "desc" }); // 'asc' | 'desc'

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/dm/officers");
      setOfficers(data.officers || []);
      setPage(0);
    } catch (err) {
      console.error("Failed to load officers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (officer) => {
    setSelected(officer);
    setOpen(true);
  };
  const handleClose = () => {
    setSelected(null);
    setOpen(false);
  };

  // filter + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? officers.filter((o) => {
          const name = `${o?.firstName || ""} ${o?.lastName || ""}`.toLowerCase();
          const email = (o?.email || "").toLowerCase();
          const phone = (o?.phone || "").toLowerCase();
          return name.includes(q) || email.includes(q) || phone.includes(q);
        })
      : officers.slice();

    base.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      const fa = sort.field;
      let va, vb;

      if (fa === "name") {
        va = `${a?.firstName || ""} ${a?.lastName || ""}`.toLowerCase();
        vb = `${b?.firstName || ""} ${b?.lastName || ""}`.toLowerCase();
      } else if (fa === "email") {
        va = (a?.email || "").toLowerCase();
        vb = (b?.email || "").toLowerCase();
      } else if (fa === "phone") {
        va = (a?.phone || "").toLowerCase();
        vb = (b?.phone || "").toLowerCase();
      } else if (fa === "createdAt") {
        va = new Date(a?.createdAt || 0).getTime();
        vb = new Date(b?.createdAt || 0).getTime();
      } else {
        va = a?.[fa];
        vb = b?.[fa];
      }

      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });

    return base;
  }, [officers, query, sort]);

  // pagination
  const total = filtered.length;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageData = useMemo(() => filtered.slice(start, end), [filtered, start, end]);

  const nextPage = () => {
    if ((page + 1) * pageSize < total) setPage((p) => p + 1);
  };
  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };
  const onPageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(0);
  };

  const toggleSort = (field) => {
    setSort((s) => {
      if (s.field === field) {
        return { field, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { field, dir: "asc" };
    });
  };

  const SortIcon = ({ field }) => {
    if (sort.field !== field) return <span className="opacity-50">↕</span>;
    return sort.dir === "asc" ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div
        className="rounded-3 p-4 mb-3 text-center text-white shadow"
        style={{
          background:
            "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)",
          boxShadow: "0 6px 25px rgba(30,58,138,0.4)",
        }}
      >
        <h5 className="fw-bold mb-1">👮 Officer Directory</h5>
        <p className="mb-0 opacity-75">
          View complete details of all field officers available for assignments
        </p>
      </div>

      {/* Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* Toolbar */}
          <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
            <div className="input-group" style={{ maxWidth: 360 }}>
              <span className="input-group-text">Search</span>
              <input
                type="text"
                className="form-control"
                placeholder="Name, email, or phone"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
              />
            </div>

            <div className="d-flex align-items-center gap-2 ms-auto">
              <label className="form-label mb-0">Rows per page:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 90 }}
                value={pageSize}
                onChange={onPageSizeChange}
              >
                {rowsPerPageOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="text-white" style={{ background: "#f1f5f9", color: "#1e3a8a" }}>
                <tr>
                  <th style={{ width: 70 }} className="text-center">#</th>
                  <th role="button" onClick={() => toggleSort("name")}>
                    Name &nbsp;<SortIcon field="name" />
                  </th>
                  <th style={{ width: 160 }} role="button" onClick={() => toggleSort("phone")}>
                    Mobile &nbsp;<SortIcon field="phone" />
                  </th>
                  <th style={{ width: 220 }} role="button" onClick={() => toggleSort("email")}>
                    Email &nbsp;<SortIcon field="email" />
                  </th>
                  <th style={{ width: 180 }} role="button" onClick={() => toggleSort("createdAt")}>
                    Joined &nbsp;<SortIcon field="createdAt" />
                  </th>
                  <th style={{ width: 150 }} className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => (
                  <tr key={row._id}>
                    <td className="text-center fw-semibold">{start + idx + 1}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold" style={{ color: "#0f172a" }}>
                          {(row.firstName || "") + " " + (row.lastName || "")}
                        </span>
                        <small className="text-muted">{row.email || "N/A"}</small>
                      </div>
                    </td>
                    <td>{row.phone || "N/A"}</td>
                    <td className="text-truncate" style={{ maxWidth: 240 }}>
                      {row.email || "N/A"}
                    </td>
                    <td>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm fw-semibold"
                        onClick={() => handleView(row)}
                        style={{ borderColor: "#1e3a8a", color: "#1e3a8a" }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#1e3a8a";
                          e.currentTarget.style.color = "#fff";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(30,58,138,0.3)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#1e3a8a";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No officers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="text-muted small">
              {total > 0 ? (
                <>
                  Showing <strong>{start + 1}</strong>–<strong>{end}</strong> of{" "}
                  <strong>{total}</strong>
                </>
              ) : (
                <>No records</>
              )}
            </div>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={prevPage}
                disabled={page === 0}
              >
                ‹ Prev
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={nextPage}
                disabled={(page + 1) * pageSize >= total}
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ViewOfficerModal open={open} onClose={handleClose} officer={selected} />
    </div>
  );
}
