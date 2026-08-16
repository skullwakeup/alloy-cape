import { useState } from "react";
import { Plus, Trash2, Mail } from "lucide-react";
import { useIssue } from "../../context/IssueContext";

export default function RecipientCard() {
  const [email, setEmail] = useState("");

  const {
    recipients,
    setRecipients,
  } = useIssue();


  function addRecipientHandler() {
    const value = email.trim().toLowerCase();

    if (!value) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      alert("Please enter a valid email.");
      return;
    }

    if (recipients.includes(value)) {
      alert("Recipient already exists.");
      return;
    }

    setRecipients([...recipients, value]);

    setEmail("");
  }

  function removeRecipient(index) {
    setRecipients(
      recipients.filter((_, i) => i !== index)
    );
  }

  return (
    <div className="bg-[#16213A] border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Recipients
      </h2>

      <div className="flex gap-2 mb-6">

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="recipient@email.com"
          className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-400"
        />

        <button
          onClick={addRecipientHandler}
          className="bg-yellow-400 text-black rounded-xl px-4 hover:scale-105 transition"
        >
          <Plus size={20} />
        </button>

      </div>

      <div className="space-y-3">

        {recipients.map((recipient, index) => (

          <div
            key={index}
            className="flex justify-between items-center bg-[#0F172A] rounded-xl px-4 py-3"
          >

            <div className="flex items-center gap-3">

              <Mail
                size={18}
                className="text-yellow-400"
              />

              <span>{recipient}</span>

            </div>

            <button
              onClick={() => removeRecipient(index)}
            >

              <Trash2
                size={18}
                className="text-red-400"
              />

            </button>

          </div>

        ))}

      </div>

    </div>
  );
}