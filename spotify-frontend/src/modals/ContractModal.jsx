import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";

const TERMS_TEXT = `
1. OWNERSHIP OF WORK
The Artist retains full copyright ownership of the uploaded recording (the "Work"), including but not limited to the composition, lyrics, master recording, and performance rights.

2. LICENSE GRANT
The Artist grants MeloVibe a worldwide, non-exclusive, non-transferable, royalty-bearing license to stream, host, and distribute the Work on the MeloVibe platform.

3. REVENUE SPLIT
Revenue generated from streams of the Work shall be split 70% to the Artist and 30% to MeloVibe (applicable in future not now), as calculated by platform accounting.

4. TERM & TERMINATION
This Agreement remains in effect until either party terminates it in writing, or until the Work is removed from the platform.

5. WARRANTIES
The Artist warrants that they have the legal right to upload the Work and that it does not infringe on any third-party rights, including but not limited to copyright, trademark, or personality rights.

6. INDEMNITY
The Artist agrees to indemnify MeloVibe against any claims arising from the Artist's breach of these warranties.

7. GOVERNING LAW
This Agreement shall be governed by the laws of India, with exclusive jurisdiction in the courts of Pune, Maharashtra.

8. DIGITAL SIGNATURE
By typing your full legal name below and checking the agreement box, you are entering into a legally binding digital contract under the Information Technology Act, 2000.
`;

const ContractModal = ({ song, closeModal, onSigned, artistName }) => {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");
  const [exclusivity, setExclusivity] = useState("non-exclusive");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError("");

    if (!agreed) {
      setError("You must accept the terms.");
      return;
    }
    if (!signature.trim()) {
      setError("Please type your full name as a digital signature.");
      return;
    }
    if (
      artistName &&
      signature.trim().toLowerCase() !== artistName.toLowerCase()
    ) {
      setError(`Signature must match your name exactly: "${artistName}"`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await makeAuthenticatedPOSTRequest("/contract/create", {
        songId: song._id,
        signature: signature.trim(),
        agreedToTerms: true,
        exclusivity,
      });

      if (res?.err) {
        setError(res.err);
        return;
      }

      onSigned && onSigned(res);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={closeModal}
    >
      <div
        className="bg-black border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "70vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:file-sign"
              className="text-purple-400"
              fontSize={26}
            />
            <h2 className="text-white text-lg font-bold">Upload Agreement</h2>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <Icon icon="mdi:close" fontSize={22} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-sm text-gray-300 min-h-0">
          {/* Song banner */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-purple-200 flex items-center gap-2">
            <Icon icon="mdi:music-note" fontSize={18} className="shrink-0" />
            <span className="truncate">
              Signing contract for:{" "}
              <span className="font-semibold text-white">{song.name}</span>
            </span>
          </div>

          {/* Terms */}
          <div>
            <h3 className="text-white font-semibold mb-2">
              Terms & Conditions
            </h3>
            <div className="bg-black/40 border border-white/10 rounded-lg p-3 max-h-56 overflow-y-auto text-xs leading-relaxed whitespace-pre-line text-gray-300">
              {TERMS_TEXT}
            </div>
          </div>

          {/* Exclusivity */}
          <div>
            <label className="text-white font-semibold block mb-1.5">
              Exclusivity
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setExclusivity("non-exclusive")}
                className={`flex-1 p-3 rounded-lg border text-left transition-colors ${
                  exclusivity === "non-exclusive"
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-white/10 hover:border-white/30 text-gray-400"
                }`}
              >
                <div className="text-sm font-semibold">Non-Exclusive</div>
                <div className="text-xs opacity-80 mt-0.5">
                  You can upload to other platforms
                </div>
              </button>
              <button
                type="button"
                onClick={() => setExclusivity("exclusive")}
                className={`flex-1 p-3 rounded-lg border text-left transition-colors ${
                  exclusivity === "exclusive"
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-white/10 hover:border-white/30 text-gray-400"
                }`}
              >
                <div className="text-sm font-semibold">Exclusive</div>
                <div className="text-xs opacity-80 mt-0.5">
                  Only available on MeloVibe
                </div>
              </button>
            </div>
          </div>

          {/* Signature */}
          <div>
            <label className="text-white font-semibold block mb-1.5">
              Digital Signature
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={`Type your full name: ${artistName || "Your Name"}`}
              className="w-full bg-[#242424] border border-white/10 focus:border-purple-500 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none font-mono"
            />
            {artistName && (
              <p className="text-xs text-gray-500 mt-1">
                Must match exactly:{" "}
                <span className="text-gray-300">{artistName}</span>
              </p>
            )}
          </div>

          {/* Agree checkbox */}
          <label className="flex items-start gap-3 cursor-pointer bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 accent-purple-500 cursor-pointer shrink-0"
            />
            <span className="text-xs text-gray-300 leading-relaxed">
              I have read and agree to the Terms & Conditions above. I confirm
              that I am the rightful owner of this recording and that the
              digital signature above constitutes a legally binding agreement.
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg px-3 py-2 flex items-start gap-2">
              <Icon
                icon="mdi:alert-circle"
                fontSize={16}
                className="shrink-0 mt-0.5"
              />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-white/10 shrink-0">
          <button
            onClick={closeModal}
            className="flex-1 bg-transparent border border-white/20 text-white font-semibold py-2.5 rounded-full hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:file-sign" fontSize={20} />
            {submitting ? "Signing..." : "Sign Contract"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContractModal;
