const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      padding: "1rem",
      background: "#f8f9fa",
      borderTop: "1px solid #e9ecef",
      textAlign: "center",
      fontSize: "0.85rem",
      color: "#6c757d"
    }}>
      <p style={{ margin: 0 }}>
        &copy; {currentYear} RevTickets. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
