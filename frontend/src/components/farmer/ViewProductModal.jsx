import React from "react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/formatters";

const approvalBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return { variant: "green", label: "Approved" };
    case "rejected":
      return { variant: "red", label: "Rejected" };
    case "pending":
      return { variant: "amber", label: "Pending Approval" };
    default:
      return {
        variant: "primary",
        label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown",
      };
  }
};

const ViewProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const badge = approvalBadge(product.status);
  const primaryImage =
    product.images?.find((img) => img.sort_order === 1)?.url ||
    product.images?.[0]?.url ||
    null;

  const labelStyle = { color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600, marginBottom: 4 };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>{product.name}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {primaryImage ? (
            <div className="image-preview">
              <img src={primaryImage} alt={product.name} />
            </div>
          ) : (
            <div className="image-preview" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", color: "#94a3b8" }}>
              No image
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Badge variant={badge.variant}>{badge.label}</Badge>
            {product.status === "rejected" && product.rejection_reason && (
              <span style={{ color: "#f87171", fontSize: "0.75rem", fontWeight: 600 }}>
                Reason: {product.rejection_reason}
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
            <div>
              <div style={labelStyle}>Category</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{product.category?.name ?? "No Category"}</div>
            </div>
            <div>
              <div style={labelStyle}>Price</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{formatCurrency(product.price)}</div>
            </div>
            <div>
              <div style={labelStyle}>Quantity</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>
                {product.quantity_available ?? 0} {product.unit}
              </div>
            </div>
            <div>
              <div style={labelStyle}>Added</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>
                {product.created_at ? new Date(product.created_at).toLocaleDateString() : "-"}
              </div>
            </div>
          </div>

          {product.description ? (
            <div>
              <div style={labelStyle}>Description</div>
              <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{product.description}</p>
            </div>
          ) : null}

          {Array.isArray(product.tags) && product.tags.length > 0 ? (
            <div>
              <div style={labelStyle}>Tags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {product.tags.map((tag) => (
                  <span key={tag} className="badge badge-primary badge-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {product.status === "rejected" && product.rejection_reason ? (
            <div style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.35)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ color: "#fca5a5", fontSize: "0.75rem", fontWeight: 700, marginBottom: 4 }}>Rejection Reason</div>
              <div style={{ color: "#fecaca", fontSize: "0.9rem", lineHeight: 1.6 }}>{product.rejection_reason}</div>
            </div>
          ) : null}

          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
