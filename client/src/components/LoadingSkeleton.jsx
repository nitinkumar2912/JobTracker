export const LoadingSkeleton = ({ rows = 4 }) => (
  <div className="skeleton-stack" aria-label="Loading">
    {Array.from({ length: rows }).map((_, index) => (
      <div className="skeleton-row" key={index}>
        <span />
        <span />
        <span />
      </div>
    ))}
  </div>
);
