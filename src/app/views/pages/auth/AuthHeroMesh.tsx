import { createPortal } from 'react-dom';

/** Animated mesh backdrop inspired by website service-hero (web-pentest / crawlers). */
export const AuthHeroMesh = () =>
  createPortal(
    <div className="auth-hero-mesh" aria-hidden="true">
      <svg viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Browser frames — web-pentest language */}
        <g stroke="currentColor" strokeOpacity=".16">
          <rect x="40" y="140" width="150" height="86" />
          <path d="M40 162h150" />
          <rect x="220" y="300" width="140" height="78" />
          <path d="M220 320h140" />
          <rect x="80" y="460" width="170" height="86" />
          <path d="M80 482h170" />
        </g>
        <g stroke="currentColor" fill="none" strokeWidth="1.2" strokeOpacity=".42">
          <path className="auth-mesh-flow" d="M40 180H340" style={{ animationDuration: '14s' }} />
          <path className="auth-mesh-flow" d="M80 360H380" style={{ animationDuration: '11s' }} />
        </g>

        {/* Crawl lanes — crawlers language */}
        <g stroke="currentColor" fill="none" strokeWidth="1.15" strokeOpacity=".38">
          <path className="auth-mesh-flow" d="M520 200H1380" />
          <path className="auth-mesh-flow" d="M520 280H1380" style={{ animationDuration: '9s' }} />
          <path className="auth-mesh-flow" d="M520 360H1380" style={{ animationDuration: '12s' }} />
          <path className="auth-mesh-flow" d="M520 440H1380" style={{ animationDuration: '8s' }} />
          <path className="auth-mesh-flow" d="M520 520H1380" style={{ animationDuration: '14s' }} />
        </g>
        <g stroke="currentColor" fill="currentColor">
          <g transform="translate(760 280)">
            <circle r="4" />
            <path
              d="M0 0l-11-7M0 0l-13 0M0 0l-9 8M0 0l9-7M0 0l13 0M0 0l9 8"
              fill="none"
              strokeOpacity=".85"
            />
          </g>
          <g transform="translate(1040 440)">
            <circle r="4.5" />
            <path
              d="M0 0l-12-7M0 0l-14 0M0 0l-10 9M0 0l10-7M0 0l14 0M0 0l10 9"
              fill="none"
              strokeOpacity=".85"
            />
          </g>
        </g>
        <g fill="currentColor">
          <circle className="auth-mesh-pulse" cx="560" cy="200" r="3" style={{ animationDelay: '.3s' }} />
          <circle className="auth-mesh-pulse" cx="900" cy="360" r="3.4" style={{ animationDelay: '.8s' }} />
          <circle className="auth-mesh-pulse" cx="1280" cy="520" r="3.2" style={{ animationDelay: '1.2s' }} />
          <circle cx="1180" cy="280" r="2.6" opacity=".65" />
        </g>

        {/* Right browser frames */}
        <g stroke="currentColor" strokeOpacity=".2">
          <rect x="1080" y="100" width="180" height="100" />
          <path d="M1080 124h180" />
          <rect x="1220" y="320" width="160" height="90" />
          <path d="M1220 344h160" />
        </g>
        <g stroke="currentColor" fill="none" strokeWidth="1.2">
          <path className="auth-mesh-flow" d="M1260 150H1420" />
          <path className="auth-mesh-flow" d="M1380 365H1420" style={{ animationDuration: '9s' }} />
        </g>

        {/* Soft scan sweep */}
        <rect className="auth-mesh-scan" x="0" y="0" width="1440" height="48" fill="currentColor" opacity=".045" />
      </svg>
    </div>,
    document.body
  );
