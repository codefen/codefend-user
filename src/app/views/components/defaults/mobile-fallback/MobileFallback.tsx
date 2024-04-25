import './mobilefallback.scss';

export const MobileFallback = () => (
	<div className="fallback-container">
		<picture className="logo-container">
			<img
				src="/codefend/fav.png"
				alt="Codefend logo"
				decoding="async"
				loading="lazy"
			/>
		</picture>

		<div className="fallback-content">
			<h1 className="title">Mobile version in progress!</h1>
			<div className="text-container">
				<p>We continue working on the version for mobile devices</p>
				<p>
					We invite you to continue working from a device with higher
					resolution
				</p>
			</div>
		</div>
	</div>
);
