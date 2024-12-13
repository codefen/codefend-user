import { Component, type ErrorInfo, type ReactNode } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  isNetworkOpen: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, isNetworkOpen: false };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    //Runs when catching an error
    this.setState({ hasError: true });
  }

  updateHasError = () => {
    this.setState({ hasError: !this.state.hasError });
  };

  updateNetworkOpen = () => {
    this.setState({ isNetworkOpen: !this.state.isNetworkOpen });
  };

  override render() {
    if (this.state.hasError) {
      //Renders the alternative error message
      return (
        <>
          <div className="error-boundry">
            <header>
              <h2 className="error-boundry-title">¡Oops! Something went wrong.</h2>
              <p className="error-boundry-text">
                Sorry, an unexpected error occurred and we were unable to display the content, you
                can go back
              </p>
            </header>

            <PrimaryButton
              text="Go back"
              className="error-tertiary-btn"
              click={() => {
                this.updateHasError();
                window.history.back();
                setTimeout(() => {
                  window.location.reload();
                }, 150);
              }}
              buttonStyle="gray"
            />
          </div>
        </>
      );
    }
    // Render normal child components
    return this.props.children;
  }
}
