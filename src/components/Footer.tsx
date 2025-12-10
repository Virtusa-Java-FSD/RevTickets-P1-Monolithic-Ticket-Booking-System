const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-3">RevTickets</h5>
            <p className="text-muted small mb-0">
              Your one-stop destination for booking amazing events, concerts, and travel experiences.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end justify-content-start gap-3 mt-3 mt-md-0">
              <a href="#" className="text-muted text-decoration-none small">Privacy Policy</a>
              <a href="#" className="text-muted text-decoration-none small">Terms of Service</a>
              <a href="#" className="text-muted text-decoration-none small">Contact Us</a>
            </div>
            <p className="text-muted small mt-2 mb-0">
              © 2024 RevTickets. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
