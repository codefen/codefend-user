import {
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import { useLocation } from 'react-router';

interface PanelInteriorProps extends ComponentPropsWithRef<'main'> {
  title: string;
  description?: string;
  actions?: ReactNode;
  ready: boolean;
  contentReady?: boolean;
}

const easing = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

export const PanelInterior = ({
  title,
  description,
  actions,
  ready,
  contentReady = true,
  className = '',
  children,
  ref,
  ...mainProps
}: PanelInteriorProps) => {
  const { pathname } = useLocation();
  const panel = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [revealedPath, setRevealedPath] = useState<string | null>(null);
  const revealed = revealedPath === pathname;
  useLayoutEffect(() => {
    if (ready && contentReady) setRevealedPath(pathname);
  }, [pathname, ready, contentReady]);
  useImperativeHandle(ref, () => panel.current!, []);

  useLayoutEffect(() => {
    if (!revealed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animation = heading.current?.animate(
      [
        { opacity: 0, transform: 'translateX(24px)', clipPath: 'inset(0 0 -8px 75%)' },
        { opacity: 1, transform: 'none', clipPath: 'inset(0 0 -8px 0)' },
      ],
      { duration: 470, easing }
    );
    return () => animation?.cancel();
  }, [pathname, revealed]);

  useLayoutEffect(() => {
    if (!revealed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = panel.current;
    if (!root) return;
    const action = Array.from(
      root.querySelectorAll<HTMLElement>(
        '.panel-heading-actions button, .company-create-controls button, .scan-start button, button.refresh-btn, button.pentest-btn, button.primary-full, button.btn-red:not(:disabled)'
      )
    ).find(button => button.offsetHeight > 0);
    const detailSelector = [
      '.panel-heading p',
      '.table-search-bar',
      '.table-header',
      '.table-rows-container',
      '.company-create > h2',
      '.company-create > p',
      '.company-create form',
      '.company-world-map > .header',
      '.map-footer-summary',
      '.map-container',
      '.unified-chart-controls',
      '.activity-chart-container',
      '.chart-placeholder',
      '.metric-row',
      '.table-title',
      '.stat',
      '.risk-chart .chart',
    ].join(',');
    const details = Array.from(root.querySelectorAll<HTMLElement>(detailSelector));
    // Give sections without a table or chart their own entrance as well.
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.card, .empty-screen'));
    const targets = [
      ...details,
      ...cards.filter(
        card => !card.querySelector(detailSelector + ', .card') && !card.matches(detailSelector)
      ),
    ].filter(
      node =>
        node !== action &&
        node.offsetHeight > 0 &&
        !node.parentElement?.closest(detailSelector) &&
        node.getBoundingClientRect().top < window.innerHeight
    );
    targets.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );

    const step = Math.min(210, 1850 / Math.max(1, targets.length));
    const animations = targets.map((node, index) => {
      const draw = node.matches(
        '.table-rows-container, .activity-chart-container, .map-container, .chart'
      );
      const frames = draw
        ? [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0)' }]
        : [
            { opacity: 0, translate: '22px 0' },
            { opacity: 1, translate: '0 0' },
          ];
      return node.animate(frames, {
        duration: draw ? 620 : 410,
        delay: 180 + index * step,
        easing,
        fill: 'backwards',
      });
    });
    if (action) {
      animations.push(
        action.animate(
          [
            { opacity: 0, translate: '16px 0', scale: '0.94' },
            { opacity: 1, translate: '0 0', scale: '1.025', offset: 0.75 },
            { opacity: 1, translate: '0 0', scale: '1' },
          ],
          { duration: 430, delay: 380 + targets.length * step, easing, fill: 'backwards' }
        )
      );
    }
    const finish = () => animations.forEach(animation => animation.cancel());
    root.addEventListener('focusin', finish);
    root.addEventListener('pointerdown', finish);
    return () => {
      finish();
      root.removeEventListener('focusin', finish);
      root.removeEventListener('pointerdown', finish);
    };
  }, [pathname, revealed]);

  return (
    <main
      {...mainProps}
      ref={panel}
      aria-busy={!revealed}
      className={`panel-interior actived ${className}`}>
      {!revealed && <div className="panel-initial-loader" role="status" aria-label="Cargando"><PageLoader /></div>}
      <header className="panel-heading">
        <div className="panel-heading-copy">
          <h1 ref={heading}>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="panel-heading-actions">{actions}</div>}
      </header>
      {children}
    </main>
  );
};
