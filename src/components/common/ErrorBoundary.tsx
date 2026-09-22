import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    const errorMsg = this.state.error?.message || '';
    if (
      /dynamically imported module|Loading chunk|Failed to fetch|NetworkError/i.test(errorMsg) &&
      typeof window !== 'undefined'
    ) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError = /dynamically imported module|Loading chunk|Failed to fetch/i.test(
        this.state.error?.message || ''
      );

      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 text-slate-800" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-[#001639]">
              {isChunkError ? 'تعذر تحميل الصفحة تلقائياً' : 'حدث خطأ غير متوقع'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isChunkError
                ? 'حدث انقطاع مؤقت أثناء تحميل الملفات. تم حفظ بياناتك بأمان في المتصفح، يرجى إعادة المحاولة.'
                : 'تم حفظ بياناتك تلقائياً في ذاكرة المتصفح. يمكنك العودة للمحرر ومتابعة العمل بأمان.'}
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-5 bg-[#001639] hover:bg-[#00245a] text-white font-extrabold text-sm rounded-xl transition shadow-md cursor-pointer"
              >
                {isChunkError ? 'إعادة المحاولة وتحديث الصفحة' : 'العودة إلى محرر السيرة الذاتية'}
              </button>
              {isChunkError && (
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  الذهاب إلى الصفحة الرئيسية
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
