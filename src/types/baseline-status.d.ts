declare namespace JSX {
  interface IntrinsicElements {
    'baseline-status': {
      featureId?: string;
      ref?: React.Ref<HTMLElement>;
    };
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'baseline-status': {
        featureId?: string;
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}
