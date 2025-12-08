const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-dark py-3 mt-auto border-top">
      <div className="container">
        <div className="text-center">
          <p className="mb-0 small">
            © {currentYear} RevTickets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
