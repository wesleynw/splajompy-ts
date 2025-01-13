type Props = {
  code: string;
};

export default function VerificationCodeTemplate({ code }: Readonly<Props>) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "400px",
        // margin: "auto",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          margin: "0 0 20px",
          color: "#222",
        }}
      >
        Verification Code
      </h2>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "4px",
          display: "inline-block",
          letterSpacing: "0.1em",
          marginBottom: "20px",
        }}
      >
        {code}
      </div>
      <p
        style={{
          fontSize: "16px",
          margin: "0",
          color: "#555",
        }}
      >
        This code will expire in <strong>5 minutes</strong>.
      </p>
    </div>
  );
}
