export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        ○
      </div>
      <h2>{title}</h2>
      {description && <p className="muted">{description}</p>}
      {action}
    </div>
  )
}
