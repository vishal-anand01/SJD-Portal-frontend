import Footer from "../components/layout/Footer";
// or import FooterModern from "../components/layout/FooterModern";

function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer /> {/* 👈 Footer at bottom */}
    </>
  );
}
