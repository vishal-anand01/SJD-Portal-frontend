import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import axios from "../../../api/axiosConfig";
import ViewAssignmentModal from "../models/ViewAssignmentModal";
import DMVisitStatusModal from "../models/DMVisitStatusModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";

export default function AssignmentsList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusAssignment, setStatusAssignment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

  // pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const rowsPerPageOptions = [8, 20, 50];

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/dm/assignments");
      setAssignments(data.assignments || []);
      setPage(0); // reset to first page on new data
    } catch (err) {
      console.error("Failed to load assignments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (assignment) => {
    setSelected(assignment);
    setOpen(true);
  };

  const handleClose = () => {
    setSelected(null);
    setOpen(false);
  };

  const handleVisitStatus = (a) => {
    setStatusAssignment(a);
    setStatusOpen(true);
  };

  const total = assignments.length;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, total);

  const pageData = useMemo(
    () => assignments.slice(start, end),
    [assignments, start, end]
  );

  const nextPage = () => {
    if ((page + 1) * pageSize < total) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const onPageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPage(0);
  };

  const priorityBadge = (p) => {
    if (p === "High") return "badge bg-danger-subtle text-danger fw-semibold";
    if (p === "Medium")
      return "badge bg-warning-subtle text-warning fw-semibold";
    return "badge bg-success-subtle text-success fw-semibold";
  };

  return (
    <div className="container-fluid py-4">
      {/* ===== HEADER ===== */}
      <div
        className="rounded-3 p-4 mb-3 text-center text-white shadow"
        style={{
          background:
            "linear-gradient(90deg, #1e3a8a 0%, #2563eb 40%, #60a5fa 100%)",
          boxShadow: "0 6px 25px rgba(30,58,138,0.4)",
        }}
      >
        <h5 className="fw-bold mb-1">🧭 Assigned Field Visits</h5>
        <p className="mb-0 opacity-75">
          Review and manage all field visit assignments assigned by the District
          Magistrate
        </p>
      </div>

      {/* ===== CARD + TABLE ===== */}
      <div
        className="card border-0 shadow-sm"
        style={{ background: "linear-gradient(to bottom, #ffffff, #f9fafb)" }}
      >
        <div className="card-body">
          {/* Top toolbar */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center gap-2">
              <label className="form-label mb-0">Rows per page:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 90 }}
                value={pageSize}
                onChange={onPageSizeChange}
              >
                {rowsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="ms-auto text-muted small">
              {total > 0 ? (
                <>
                  Showing <strong>{start + 1}</strong>–<strong>{end}</strong> of{" "}
                  <strong>{total}</strong>
                </>
              ) : (
                <>No assignments</>
              )}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle table-striped mb-0">
              <thead
                className="text-white"
                style={{
                  background:
                    "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)",
                }}
              >
                <tr>
                  <th className="text-center" style={{ width: 70 }}>
                    #
                  </th>
                  <th>Officer</th>
                  <th style={{ width: 150 }}>District</th>
                  <th style={{ width: 180 }}>Gram Panchayat</th>
                  <th style={{ width: 180 }}>Village</th>
                  <th style={{ width: 130 }}>Priority</th>
                  <th style={{ width: 160 }}>Visit Date</th>
                
                  <th style={{ width: 120 }} className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => (
                  <tr key={row._id}>
                    {/* Index */}
                    <td className="text-center fw-semibold">
                      {start + idx + 1}
                    </td>

                    {/* Officer */}
                    <td>
                      <div className="d-flex flex-column">
                        <span
                          className="fw-semibold"
                          style={{ color: "#1e3a8a" }}
                        >
                          {(row?.officer?.firstName || "") +
                            " " +
                            (row?.officer?.lastName || "")}
                        </span>
                        <small className="text-muted">
                          {row?.officer?.email || "N/A"}
                        </small>
                      </div>
                    </td>

                    {/* District */}
                    <td>{row?.location?.district || "-"}</td>

                    {/* Gram Panchayat */}
                    <td>{row?.location?.gramPanchayat || "-"}</td>

                    {/* Village */}
                    <td>{row?.location?.village || "-"}</td>

                    {/* Priority */}
                    <td>
                      <span className={priorityBadge(row?.priority)}>
                        {row?.priority || "-"}
                      </span>
                    </td>

                    {/* Visit Date */}
                    <td>
                      {row?.visitDate
                        ? dayjs(row.visitDate).format("DD MMM YYYY")
                        : "—"}
                    </td>

                 
                    {/* Action */}
                    <td className="text-center">
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setMenuRow(row);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={menuRow?._id === row._id}
                        onClose={() => {
                          setAnchorEl(null);
                          setMenuRow(null);
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleView(row);
                            setAnchorEl(null);
                            setMenuRow(null);
                          }}
                        >
                          View
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            handleVisitStatus(row);
                            setAnchorEl(null);
                            setMenuRow(null);
                          }}
                        >
                          Visit Status
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-4">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="text-muted small">
              Page <strong>{total === 0 ? 0 : page + 1}</strong> of{" "}
              <strong>{total === 0 ? 0 : Math.ceil(total / pageSize)}</strong>
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

      {/* ===== VIEW MODAL (existing) ===== */}
      <ViewAssignmentModal
        open={open}
        onClose={handleClose}
        assignment={selected}
      />

      <DMVisitStatusModal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        assignment={statusAssignment}
      />
    </div>
  );
}
