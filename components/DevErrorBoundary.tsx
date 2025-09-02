'use client';
import React from 'react';

type Props = { children: React.ReactNode };
type State = { error: Error | null, info: React.ErrorInfo | null };

export default class DevErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, info: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('💥 Render error caught by boundary:', error, info?.componentStack);
  }
  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div style={{padding:16}}>
          <h2>Something exploded during render</h2>
          <pre style={{whiteSpace:'pre-wrap'}}>{String(error.stack || error.message)}</pre>
          {info?.componentStack && (
            <>
              <h3>Component stack</h3>
              <pre style={{whiteSpace:'pre-wrap'}}>{info.componentStack}</pre>
            </>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
