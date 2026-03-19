import Header from './Header';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <div className="layout-content">{children}</div>
      </main>
    </div>
  );
}
