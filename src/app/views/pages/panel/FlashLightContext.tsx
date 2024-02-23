import { useTheme } from '../../ThemeContext';
import React, {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useRef,
} from 'react';

export type FlashLight = {
	isActive: boolean;
	rightPaneRef: React.RefObject<HTMLDivElement> | null;
};

const FlashLightContext = createContext({} as FlashLight);

export const useFlashlight = () => {
	const context = useContext(FlashLightContext);

	return { isActive: context.isActive, rightPaneRef: context.rightPaneRef };
};

export const FlashLightProvider = ({ children }: PropsWithChildren) => {
	const { theme } = useTheme();
	const flashlightRef = useRef<HTMLDivElement>(null);
	const rightPaneRef = useRef<HTMLDivElement>(null);

	const handleFlashlightInRightPane = (
		x: number,
		y: number,
		glowRadius: number,
		proximityThreshold: number,
	) => {
		const rightPaneRect = rightPaneRef.current!.getBoundingClientRect();

		if (isMouseNearRightPane(x, rightPaneRect, proximityThreshold)) {
			const offsetX = calculateOffsetX(
				x,
				rightPaneRect.left,
				proximityThreshold,
			);
			let proximityRatio = (rightPaneRect.left - x) / proximityThreshold;

			//Apply flashlight effect based on mouse position
			if (x < rightPaneRect.left) {
				rightPaneRef.current!.style.background = `radial-gradient(circle at ${offsetX}px ${y}px, rgba(60, 80, 100, ${
					0.25 * (1 - proximityRatio)
				}), transparent ${glowRadius * (1 - proximityRatio)}px)`;
			} else {
				rightPaneRef.current!.style.background = `radial-gradient(circle at ${offsetX}px ${y}px, rgba(60, 80, 100, 0.25), transparent ${glowRadius}px)`;
			}
		} else {
			clearRightPaneEffect();
		}
	};

	const getMouseCoordinates = (e: MouseEvent) => {
		return { x: e.clientX, y: e.clientY };
	};
	const applyFlashlightEffect = (x: number, y: number, glowRadius: number) => {
		flashlightRef.current!.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(60, 80, 100, 0.25), transparent ${glowRadius}px)`;
	};
	const isMouseNearRightPane = (
		x: number,
		rightPaneRect: DOMRect,
		proximityThreshold: number,
	) => {
		return (
			x > rightPaneRect.left - proximityThreshold && x < rightPaneRect.right
		);
	};

	const clearRightPaneEffect = () => {
		rightPaneRef.current!.style.background = 'none';
	};

	const calculateOffsetX = (
		x: number,
		rightPaneRectLeft: number,
		proximityThreshold: number,
	) => {
		// Adjust offsetX to include proximity area
		let offsetX = x - rightPaneRectLeft + proximityThreshold;
		return offsetX < 0 ? 0 : offsetX;
	};

	const handleFlashLight = (e: any) => {
		if (theme === 'dark') {
			const { x, y } = getMouseCoordinates(e);
			const glowRadius = 350; //Radio del brillo.
			const rightPaneGlowRadius = 400;
			const proximityThreshold = 100; // Tolerance in pixels - Umbral de proximidad.

			if (flashlightRef.current) {
				applyFlashlightEffect(x, y, glowRadius);

				if (rightPaneRef.current) {
					//It runs only if I save a reference to a right panel
					handleFlashlightInRightPane(
						x,
						y,
						rightPaneGlowRadius,
						proximityThreshold,
					);
				}
			}
		}
	};

	useEffect(() => {
		if (theme !== 'dark') {
			//Remove background flash in light mode
			flashlightRef.current!.style.background = 'transparent';
			if (rightPaneRef.current) {
				rightPaneRef.current!.style.background = 'transparent';
			}
		}
	}, [theme]);

	return (
		<FlashLightContext.Provider
			value={{
				isActive: theme === 'dark',
				rightPaneRef,
			}}>
			<div
				id="flashlight"
				ref={flashlightRef}
				onMouseMove={handleFlashLight}
				style={{ background: '' }}>
				{children}
			</div>
		</FlashLightContext.Provider>
	);
};
