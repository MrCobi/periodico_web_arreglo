"use client";
import { useSession, signOut } from "next-auth/react";
import { Button, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import React from "react";

const AuthButton = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
  };

  if (session) {
    return (
      <>
        <Button
          sx={{ color: "white" }} // Usa sx para aplicar estilos
          className="mr-4"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          {session.user?.name || "Account"}
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Link className="mr-4 text-white" href="/api/auth/signin">
        Login
      </Link>
      <Link className="mr-4 text-white" href="/api/auth/signup">
        Sign Up
      </Link>
    </>
  );
};

export default AuthButton;
