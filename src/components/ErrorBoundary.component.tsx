import { Component, type PropsWithChildren } from 'react';

import { hawk } from '@/utils/hawk.util';
import EnvUnsupported from './EnvUnsupported.component';

type ErrorBoundaryState = {
  error: Error | null;
};

/** Показывает безопасный fallback вместо падения всего React-дерева. */
class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    hawk?.captureError(error);
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <EnvUnsupported error={error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
