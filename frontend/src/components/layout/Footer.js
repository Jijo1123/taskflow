import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ShopMERN</h3>
          <p>Your one-stop shop for all your needs.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/cart">Cart</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@shopmern.com</p>
          <p>Phone: +1 234 567 8900</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopMERN. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

