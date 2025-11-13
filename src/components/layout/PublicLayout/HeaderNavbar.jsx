import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoMain from "../../../assets/images/SJDLogo.png";
import logoGov1 from "../../../assets/images/India_government_emblem.png";
import logoGov2 from "../../../assets/images/India_government_emblem.png";

export default function HeaderNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hideTop, setHideTop] = useState(false);

  // 🧠 Scroll listener (optional smooth hide)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHideTop(true);
      } else {
        setHideTop(false);
      }
      lastScrollY = window.scrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Track", path: "/track" },
    { label: "Contact", path: "/contact" },
    { label: "Login", path: "/login" },
  ];

  return (
    <header
      style={{
        width: "100%",
        zIndex: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {/* 🔶 Top Section (Header Bar) */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)",
          color: "#0f172a",
          px: { xs: 2, md: 5 },
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          borderBottom: "1px solid #e2e8f0",
          transform: hideTop ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.5s ease",
          willChange: "transform",
        }}
      >
        {/* Left: Main Logo + Text */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.8,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")} // 🏠 Redirect to Home
          title="Go to Home"
        >
          <img
            src={logoMain}
            alt="SJD Portal Logo"
            style={{
              width: "70px",
              height: "70px",
              padding: "5px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <Box sx={{ lineHeight: 1.1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.1rem", md: "1.4rem" },
                color: "#0f172a",
              }}
            >
              जनता दरबार
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.9rem",
                color: "#475569",
                letterSpacing: "0.4px",
              }}
            >
              SJD-Portal — Smart Governance Platform
            </Typography>
          </Box>
        </Box>

        {/* Right: Government Partner Logos (Clickable External Links) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: { xs: 2, md: 0 },
          }}
        >
          <a
            href="https://www.india.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Government of India Portal"
          >
            <img
              src={logoGov1}
              alt="Government of India"
              style={{
                height: "48px",
                width: "auto",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                padding: "5px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </a>

          <a
            href="https://www.mygov.in/"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit MyGov India"
          >
            <img
              src={logoGov2}
              alt="MyGov India"
              style={{
                height: "48px",
                width: "auto",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                padding: "5px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </a>
        </Box>
      </Box>

      {/* 🔷 Bottom Navigation Section */}
      <Navbar
        expand="md"
        variant="dark"
        style={{
          background:
            "linear-gradient(90deg, #0f172a 0%, #1e3a8a 40%, #fbbf24 100%)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Container>
          <Navbar.Toggle
            aria-controls="main-navbar"
            style={{
              borderColor: "rgba(255,255,255,0.6)",
              color: "white",
            }}
          />
          <Navbar.Collapse id="main-navbar" className="justify-content-center">
            <Nav
              className="align-items-center"
              style={{
                gap: "1.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {navLinks.map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  style={{
                    color:
                      location.pathname === item.path
                        ? "#fbbf24"
                        : "rgba(255,255,255,0.9)",
                    position: "relative",
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                    transition: "0.3s ease",
                  }}
                >
                  {item.label}
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      height: "2px",
                      width:
                        location.pathname === item.path ? "100%" : "0%",
                      background: "#fbbf24",
                      transition: "width 0.3s ease",
                    }}
                  ></span>
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
