function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: "20px",
        padding: "12px 24px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
      }}
    >
      {children}
    </button>
  )
}

export default Button