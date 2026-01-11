import React from "react";
const PageNotFound = () => {


  return (
    <div style={styles.wrapper}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.text}>
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "var(--bg-main)",
    color: "var(--text-primary)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "24px",
  },
  code: {
    fontSize: "96px",
    fontWeight: "800",
    color: "var(--color-primary)",
    marginBottom: "8px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "12px",
  },
  text: {
    fontSize: "16px",
    color: "var(--text-muted)",
    maxWidth: "420px",
    marginBottom: "24px",
  }
};

export default PageNotFound;
