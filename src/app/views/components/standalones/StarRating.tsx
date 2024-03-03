import React, { Fragment } from 'react';

interface StartRatingProps {
	rating: number;
}

export const StarRating: React.FC<StartRatingProps> = ({ rating }) => {
	const stars = [];
	const ratingRounded = Math.floor(rating);
	const ratingDecimal = rating - ratingRounded;

	for (let i = 0; i < ratingRounded; i++) {
		stars.push(
			<svg width="18" height="18" viewBox="0 0 21 20" fill="none">
				<g filter="url(#filter0_d_151_891)">
					<path
						d="M15.4101 6.57395C15.4706 6.39104 15.7294 6.39104 15.7899 6.57395L16.8119 9.66322C16.839 9.74511 16.9155 9.80041 17.0018 9.80041H20.3013C20.4959 9.80041 20.5759 10.0502 20.4175 10.1632L17.7543 12.0635C17.683 12.1145 17.6531 12.2059 17.6806 12.2892L18.6993 15.3684C18.7601 15.552 18.5507 15.7063 18.3933 15.594L15.7162 13.6837C15.6467 13.6341 15.5533 13.6341 15.4838 13.6837L12.8067 15.594C12.6493 15.7063 12.4399 15.552 12.5007 15.3684L13.5194 12.2892C13.5469 12.2059 13.517 12.1145 13.4457 12.0635L10.7825 10.1632C10.6241 10.0502 10.7041 9.80041 10.8987 9.80041H14.1982C14.2845 9.80041 14.361 9.74511 14.3881 9.66322L15.4101 6.57395Z"
						fill="#FF9400"
					/>
					<path
						d="M15.7424 6.58966L16.7644 9.67893C16.7983 9.78129 16.894 9.85041 17.0018 9.85041H20.3013C20.4473 9.85041 20.5073 10.0377 20.3884 10.1225L17.7253 12.0228C17.6361 12.0865 17.5987 12.2008 17.6332 12.3049L18.6518 15.3841C18.6974 15.5218 18.5404 15.6376 18.4223 15.5533L15.7452 13.643C15.6583 13.581 15.5417 13.581 15.4548 13.643L12.7777 15.5533C12.6596 15.6376 12.5026 15.5218 12.5482 15.3841L13.5668 12.3049C13.6013 12.2008 13.5639 12.0865 13.4747 12.0228L10.8116 10.1225C10.6927 10.0377 10.7527 9.85041 10.8987 9.85041H14.1982C14.306 9.85041 14.4017 9.78129 14.4356 9.67893L15.4576 6.58966C15.503 6.45247 15.697 6.45247 15.7424 6.58966Z"
						stroke="#FD8B00"
						strokeWidth="0.1"
					/>
				</g>
				<defs>
					<filter
						id="filter0_d_151_891"
						x="0.698242"
						y="0.436768"
						width="29.8035"
						height="29.1953"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="4" />
						<feGaussianBlur stdDeviation="5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"
						/>
						<feBlend
							mode="normal"
							in2="BackgroundImageFix"
							result="effect1_dropShadow_151_891"
						/>
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="effect1_dropShadow_151_891"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>,
		);
	}

	if (ratingDecimal > 0) {
		stars.push(
			<svg width="18" height="18" viewBox="0 0 21 20" fill="none">
				<g filter="url(#filter0_d_151_890)">
					<path
						d="M15.6475 6.62106L16.6695 9.71034C16.7169 9.85364 16.8508 9.95041 17.0018 9.95041H20.3013C20.35 9.95041 20.37 10.0128 20.3304 10.0411L17.6672 11.9414C17.5423 12.0306 17.49 12.1906 17.5382 12.3363L18.5569 15.4155C18.5721 15.4614 18.5198 15.5 18.4804 15.4719L15.8033 13.5616C15.6817 13.4748 15.5183 13.4748 15.3967 13.5616L12.7196 15.4719C12.6802 15.5 12.6279 15.4614 12.6431 15.4155L13.6618 12.3363C13.71 12.1906 13.6577 12.0306 13.5328 11.9414L10.8696 10.0411C10.83 10.0128 10.85 9.95041 10.8987 9.95041H14.1982C14.3492 9.95041 14.4831 9.85364 14.5305 9.71034L15.5525 6.62106C15.5677 6.57534 15.6323 6.57534 15.6475 6.62106Z"
						stroke="url(#paint0_linear_151_890)"
						strokeWidth="0.3"
						shapeRendering="crispEdges"
					/>
				</g>
				<g filter="url(#filter1_d_151_890)">
					<path
						d="M15.4101 6.57395C15.4706 6.39104 15.7294 6.39104 15.7899 6.57395L16.8119 9.66322C16.839 9.74511 16.9155 9.80041 17.0018 9.80041H20.3013C20.4959 9.80041 20.5759 10.0502 20.4175 10.1632L17.7543 12.0635C17.683 12.1145 17.6531 12.2059 17.6806 12.2892L18.6993 15.3684C18.7601 15.552 18.5507 15.7063 18.3933 15.594L15.7162 13.6837C15.6467 13.6341 15.5533 13.6341 15.4838 13.6837L12.8067 15.594C12.6493 15.7063 12.4399 15.552 12.5007 15.3684L13.5194 12.2892C13.5469 12.2059 13.517 12.1145 13.4457 12.0635L10.7825 10.1632C10.6241 10.0502 10.7041 9.80041 10.8987 9.80041H14.1982C14.2845 9.80041 14.361 9.74511 14.3881 9.66322L15.4101 6.57395Z"
						fill="url(#paint1_linear_151_890)"
						shapeRendering="crispEdges"
					/>
					<path
						d="M15.7424 6.58966L16.7644 9.67893C16.7983 9.78129 16.894 9.85041 17.0018 9.85041H20.3013C20.4473 9.85041 20.5073 10.0377 20.3884 10.1225L17.7253 12.0228C17.6361 12.0865 17.5987 12.2008 17.6332 12.3049L18.6518 15.3841C18.6974 15.5218 18.5404 15.6376 18.4223 15.5533L15.7452 13.643C15.6583 13.581 15.5417 13.581 15.4548 13.643L12.7777 15.5533C12.6596 15.6376 12.5026 15.5218 12.5482 15.3841L13.5668 12.3049C13.6013 12.2008 13.5639 12.0865 13.4747 12.0228L10.8116 10.1225C10.6927 10.0377 10.7527 9.85041 10.8987 9.85041H14.1982C14.306 9.85041 14.4017 9.78129 14.4356 9.67893L15.4576 6.58966C15.503 6.45247 15.697 6.45247 15.7424 6.58966Z"
						stroke="url(#paint2_linear_151_890)"
						strokeWidth="0.1"
						shapeRendering="crispEdges"
					/>
				</g>
				<defs>
					<filter
						id="filter0_d_151_890"
						x="0.698242"
						y="0.436768"
						width="29.8035"
						height="29.1953"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="4" />
						<feGaussianBlur stdDeviation="5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"
						/>
						<feBlend
							mode="normal"
							in2="BackgroundImageFix"
							result="effect1_dropShadow_151_890"
						/>
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="effect1_dropShadow_151_890"
							result="shape"
						/>
					</filter>
					<filter
						id="filter1_d_151_890"
						x="0.698242"
						y="0.436768"
						width="29.8035"
						height="29.1953"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset dy="4" />
						<feGaussianBlur stdDeviation="5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"
						/>
						<feBlend
							mode="normal"
							in2="BackgroundImageFix"
							result="effect1_dropShadow_151_890"
						/>
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="effect1_dropShadow_151_890"
							result="shape"
						/>
					</filter>
					<linearGradient
						id="paint0_linear_151_890"
						x1="19"
						y1="10.5"
						x2="14"
						y2="10.5"
						gradientUnits="userSpaceOnUse">
						<stop offset="0.253281" stopColor="#4B4D4E" />
						<stop offset="1" stopColor="#484C50" stopOpacity="0" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_151_890"
						x1="15.5"
						y1="11"
						x2="16.5"
						y2="11"
						gradientUnits="userSpaceOnUse">
						<stop offset="0.0782809" stopColor="#FF9400" />
						<stop offset="0.248281" stopColor="#FF9400" stopOpacity="0" />
					</linearGradient>
					<linearGradient
						id="paint2_linear_151_890"
						x1="12.5"
						y1="10.5"
						x2="15.5"
						y2="10.5"
						gradientUnits="userSpaceOnUse">
						<stop offset="0.528281" stopColor="#FD8B00" />
						<stop offset="1" stopColor="#FD8B00" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>,
		);
	}

	return (
		<div className="rating-content">
			{stars.map((star: any, i: number) => (
				<Fragment key={i}>{star}</Fragment>
			))}
		</div>
	);
};
