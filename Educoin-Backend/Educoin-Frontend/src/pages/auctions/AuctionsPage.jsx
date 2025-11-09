import React, { useState } from "react";
import AuctionList from "../../components/auctions/AuctionList";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === "function") {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert" style={{ padding: 16, border: "1px solid #f5c6cb", background: "#f8d7da" }}>
          <h2>Ocurrió un error mostrando las subastas</h2>
          <p>Intenta recargar la lista. Si el problema persiste, revisa la consola.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={this.handleRetry}>
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => {
                // dejar que el usuario recargue la página como último recurso
                window.location.reload();
              }}
            >
              Recargar página
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default function AuctionsPage() {
  // Cambiar refreshKey forzará el remonte de AuctionList tras un error / reintento
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main style={{ padding: 20 }}>
      <header style={{ marginBottom: 16 }}>
        <h1>Subastas</h1>
      </header>

      <ErrorBoundary onReset={() => setRefreshKey((k) => k + 1)}>
        {/* key permite remonte completo al cambiar refreshKey */}
        <AuctionList key={refreshKey} />
      </ErrorBoundary>
    </main>
  );
}