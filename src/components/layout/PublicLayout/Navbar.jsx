import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import logoMain from "../../../assets/images/SJDLogo.png";
import logoGov1 from "../../../assets/images/India_government_emblem.png";
import logoGov2 from "../../../assets/images/India_government_emblem.png";

export default function HeaderNavbar() {
  const location = useLocation();
  const [hideTop, setHideTop] = useState(false);

  // 🧠 Scroll listener (still active for animation)
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
        background: "#ffffff",
        width: "100%",
        zIndex: 10,
        boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
      }}
    >
      {/* 🔶 Top Section (White Background) */}
      <Box
        sx={{
          background: "#ffffff",
          color: "#0f172a",
          px: { xs: 2, md: 5 },
          py: 1.2,
          boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          transform: hideTop ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.5s ease",
          willChange: "transform",
        }}
      >
        {/* Left: Logo + Text */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <img
            src={logoMain}
            alt="Logo"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#fbbf24",
              padding: "4px",
            }}
          />
          <Box sx={{ lineHeight: 1.1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1rem", md: "1.3rem" },
                color: "#1e293b",
              }}
            >
              जनता दरबार
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.9rem",
                color: "#64748b",
                letterSpacing: "0.5px",
              }}
            >
              SJD-Portal
            </Typography>
          </Box>
        </Box>

        {/* Right: Partner Logos */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: { xs: 2, md: 0 },
          }}
        >
          <img
            src={logoGov1}
            alt="Gov Partner 1"
            style={{
              height: "45px",
              width: "auto",
              background: "#fff",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              padding: "4px",
            }}
          />
          <img
            src={logoGov2}
            alt="Gov Partner 2"
            style={{
              height: "45px",
              width: "auto",
              background: "#fff",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              padding: "4px",
            }}
          />
        </Box>
      </Box>

      {/* 🔷 Bottom Section (Gradient Menu Bar) */}
      <Navbar
        expand="md"
        variant="dark"
        style={{
          background:
            "linear-gradient(90deg, #0f172a 0%, #1e3a8a 40%, #fbbf24 100%)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          transition: "background 0.3s ease",
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
                        : "rgba(255,255,255,0.92)",
                    position: "relative",
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                    transition: "0.3s",
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
