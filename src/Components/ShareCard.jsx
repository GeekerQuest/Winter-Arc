import { useState } from "react";

const ShareCard = ({ completedTasks, totalTasks }) => {
  const [message, setMessage] = useState("");

  const shareProgress = async () => {
    const text = `I completed ${completedTasks} of ${totalTasks} Winter Arc tasks today. One day at a time. 🌱`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "My Winter Arc progress", text });
      } else {
        await navigator.clipboard.writeText(text);
        setMessage("Progress copied to clipboard");
      }
    } catch (error) {
      if (error.name !== "AbortError") setMessage("Could not share right now");
    }
  };

  return (
    <section className="share-card" aria-label="Share your progress">
      <div className="share-copy">
        <h2>Share your progress</h2>
        <p aria-live="polite">{message || "A little progress is still progress."}</p>
      </div>
      <button className="share-button" type="button" onClick={shareProgress}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        Share
      </button>
    </section>
  );
};

export default ShareCard;
