import { PureComponent } from 'react';

interface EmptyCardProps {
  title?: string;
  info?: string;
}

class EmptyCard extends PureComponent<EmptyCardProps> {
  override render() {
    const { title, info } = this.props;
    return (
      <div className="empty-card">
        <div className="empty-container">
          <div className="empty-wrapper">
            <img
              src="/codefend/not-allowed.svg"
              alt="Not allowed icon"
              decoding="async"
              loading="lazy"
              width="5rem"
              height="5rem"
            />

            <div className="empty-content">
              <p className="first-text">{title || "There's no data to display here."}</p>
              <p className="second-text">
                {info ||
                  'If you just placed an order please allow our team to work for a few hours before getting the first results. '}
                <a
                  className="codefend-text-red"
                  href="mailto:cs@codefend.com"
                  rel="noopener noreferrer"
                  target="_blank">
                  Send email.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmptyCard;
