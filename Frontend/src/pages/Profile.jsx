import { useState } from "react";
import { UserProfile } from "@clerk/react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@clerk/react";
import { api } from "@/lib/apiClient";

function EmailSendForm() {
  const { user: authUser } = useAuthContext();
  const { user: clerkUser } = useUser();

  const senderEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    authUser?.email ||
    "";

  const [toEmail, setToEmail]   = useState("");
  const [subject, setSubject]   = useState("");
  const [message, setMessage]   = useState("");
  const [sending, setSending]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!toEmail || !subject || !message || sending) return;
    setSending(true);
    setSuccess(false);
    setError(null);
    try {
      await api.post("/api/v1/email/send", {
        to_email: toEmail,
        subject,
        message,
      });
      setSuccess(true);
      setToEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-border shadow-crisp p-6 mt-8 max-w-2xl">
      <h2 className="text-base font-sans font-semibold text-foreground mb-1">Send Email</h2>
      <p className="text-xs text-muted-foreground mb-5 font-mono">
        Send an email notification to any address. Delivered via SupplyLens mail service.
      </p>

      <form onSubmit={handleSend} className="space-y-4">
        {/* From — read-only */}
        <div>
          <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">
            From
          </label>
          <input
            type="text"
            readOnly
            value={senderEmail || "—"}
            className="w-full h-9 px-3 border border-border rounded text-sm font-mono bg-muted/30 text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* To */}
        <div>
          <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">
            To <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="recipient@example.com"
            value={toEmail}
            onChange={(e) => { setToEmail(e.target.value); setSuccess(false); setError(null); }}
            className="w-full h-9 px-3 border border-border rounded text-sm font-mono bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">
            Subject <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Email subject"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setSuccess(false); setError(null); }}
            className="w-full h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            required
            rows={5}
            placeholder="Type your message here…"
            value={message}
            onChange={(e) => { setMessage(e.target.value); setSuccess(false); setError(null); }}
            className="w-full px-3 py-2 border border-border rounded text-sm font-sans bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Feedback */}
        {success && (
          <div className="flex items-center gap-2 text-xs text-success font-mono bg-success/10 border border-success/30 px-3 py-2 rounded">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            Email queued for delivery.
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive font-mono bg-destructive/10 border border-destructive/30 px-3 py-2 rounded">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !toEmail || !subject || !message}
          className="inline-flex items-center gap-2 h-9 px-5 bg-primary text-primary-foreground text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Send Email
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function Profile() {
  return (
    <div className="p-8">
      <div className="flex justify-center">
        <UserProfile routing="path" path="/profile" />
      </div>
      <div className="flex justify-center">
        <EmailSendForm />
      </div>
    </div>
  );
}
