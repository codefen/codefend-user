import { type FC } from 'react';
import './loaders.scss';

const SpinnerV2: FC<{ icon: string }> = ({ icon }) => (
  <div className={`dotted-spinner ${icon}`}>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
  </div>
);

const OrbitSpinner: FC<{ icon: string }> = ({ icon }) => (
  <aside className={`ball-spinner ${icon}`}>
    <div className="ball-spinner-dot"></div>
    <div className="ball-spinner-dot"></div>
  </aside>
);

export const ButtonLoader: FC<{ left?: any; right?: any }> = ({
  left = '7%',
  right = 'inherit',
}) => {
  return (
    <div
      className="button-loader"
      style={
        {
          '--pos-left': left!,
          '--pos-right': right!,
        } as any
      }></div>
  );
};

export const Loader = () => {
  return (
    <div className="loader loader-screen">
      <OrbitSpinner icon="icon" />
    </div>
  );
};

export const PageOrbitLoader = () => {
  return (
    <div className="loader loader-full">
      <SpinnerV2 icon="small-icon" />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="loader loader-full">
      <OrbitSpinner icon="small-icon" />
    </div>
  );
};

export const PageLoaderWhite = () => {
  return (
    <div className="loader loader-full">
      <OrbitSpinner icon="icon" />
    </div>
  );
};

export const PageLoaderOverlay = () => {
  return (
    <div className="loader loader-full overlay">
      <OrbitSpinner icon="small-icon" />
    </div>
  );
};
