import type { ProductGridProps, ProductStatus } from '../section-contract';
import { SectionSurface } from './SectionSurface';

const statusLabels: Record<ProductStatus, string> = {
  available: 'Available',
  coming_soon: 'Coming Soon',
  early_access: 'Early Access',
};

export function ProductGridSection(props: ProductGridProps) {
  const { surface, width, backgroundImageUrl, sectionTitle, sectionDescription, products } = props;
  const visibleProducts = products.slice(0, 6);

  return (
    <SectionSurface surface={surface} width={width} backgroundImageUrl={backgroundImageUrl} className="emovel-product-grid">
      <style>{`
        .emovel-product-grid {
          overflow: hidden;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .emovel-product-grid__inner {
          width: min(100%, 72rem);
          margin: 0 auto;
          padding: clamp(var(--space-section-v), 7vw, 6.75rem) clamp(1.25rem, 4vw, var(--space-section-h));
        }

        .emovel-product-grid__header {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(18rem, 0.72fr);
          gap: clamp(1rem, 4vw, 3rem);
          align-items: end;
          margin-bottom: clamp(2rem, 4vw, 3.25rem);
        }

        .emovel-product-grid__title {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(2rem, 4.4vw, 3.75rem);
          font-weight: 760;
          letter-spacing: -0.035em;
          line-height: 1.02;
          text-wrap: balance;
        }

        .emovel-product-grid__description {
          margin: 0;
          color: var(--color-textSecondary);
          font-size: clamp(1rem, 1.35vw, 1.125rem);
          line-height: 1.7;
        }

        .emovel-product-grid__cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1rem, 2vw, 1.35rem);
        }

        .emovel-product-grid__card {
          position: relative;
          display: flex;
          min-height: 18rem;
          flex-direction: column;
          padding: clamp(1.1rem, 2.4vw, 1.5rem);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          box-shadow: var(--shadow-card);
          transition:
            transform var(--motion-duration) var(--motion-ease),
            border-color var(--motion-duration) var(--motion-ease),
            box-shadow var(--motion-duration) var(--motion-ease);
        }

        .emovel-product-grid__card:hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--color-primary) 60%, var(--color-border));
          box-shadow: 0 2px 8px rgba(0,0,0,.12), 0 12px 32px rgba(0,0,0,.10);
        }

        .emovel-product-grid__card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.35rem;
        }

        .emovel-product-grid__index {
          color: var(--color-textSecondary);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }

        .emovel-product-grid__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          flex: none;
          min-height: 1.65rem;
          padding: 0.36rem 0.6rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          background: color-mix(in srgb, var(--badge-color) 12%, var(--color-surface));
          color: var(--badge-color);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }

        .emovel-product-grid__badge::before {
          content: "";
          width: 0.38rem;
          height: 0.38rem;
          border-radius: var(--radius-pill);
          background: var(--badge-color);
        }

        .emovel-product-grid__badge--available {
          --badge-color: var(--color-success);
        }

        .emovel-product-grid__badge--coming_soon {
          --badge-color: var(--color-textSecondary);
        }

        .emovel-product-grid__badge--early_access {
          --badge-color: var(--color-secondary);
        }

        .emovel-product-grid__card-title {
          margin: 0;
          color: var(--color-textPrimary);
          font-size: clamp(1.18rem, 2vw, 1.45rem);
          font-weight: 740;
          letter-spacing: -0.018em;
          line-height: 1.14;
          text-wrap: balance;
        }

        .emovel-product-grid__card-description {
          margin: 0.85rem 0 0;
          color: var(--color-textSecondary);
          font-size: 0.98rem;
          line-height: 1.65;
        }

        .emovel-product-grid__card-footer {
          margin-top: auto;
          padding-top: 1.5rem;
        }

        .emovel-product-grid__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          color: var(--color-primary);
          font-size: 0.94rem;
          font-weight: 800;
          line-height: 1;
          text-decoration: none;
        }

        .emovel-product-grid__cta::after {
          content: "";
          width: 1.75rem;
          height: 1px;
          background: var(--color-primary);
          transform-origin: left center;
          transition: transform var(--motion-duration) var(--motion-ease);
        }

        .emovel-product-grid__cta:hover::after {
          transform: scaleX(1.35);
        }

        @container (max-width: 58rem) {
          .emovel-product-grid__header {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .emovel-product-grid__description {
            max-width: 42rem;
          }

          .emovel-product-grid__cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @container (max-width: 38rem) {
          .emovel-product-grid__inner {
            padding-block: 4rem;
          }

          .emovel-product-grid__cards {
            grid-template-columns: 1fr;
          }

          .emovel-product-grid__card {
            min-height: 15.5rem;
          }

          .emovel-product-grid__card-top {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="emovel-product-grid__inner">
        <div className="emovel-product-grid__header">
          <h2 className="emovel-product-grid__title">{sectionTitle}</h2>
          {sectionDescription ? (
            <p className="emovel-product-grid__description">{sectionDescription}</p>
          ) : null}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="emovel-product-grid__cards">
            {visibleProducts.map((product, index) => (
              <article className="emovel-product-grid__card" key={`${product.title}-${index}`}>
                <div className="emovel-product-grid__card-top">
                  <span className="emovel-product-grid__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className={`emovel-product-grid__badge emovel-product-grid__badge--${product.status}`}>
                    {statusLabels[product.status]}
                  </span>
                </div>

                <h3 className="emovel-product-grid__card-title">{product.title}</h3>
                <p className="emovel-product-grid__card-description">{product.description}</p>

                {product.cta ? (
                  <div className="emovel-product-grid__card-footer">
                    <a className="emovel-product-grid__cta" href={`#product-${index + 1}`}>
                      {product.cta}
                    </a>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </SectionSurface>
  );
}
