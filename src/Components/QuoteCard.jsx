
import { useEffect, useState } from "react";

const fallbackQuote = {
  text: "The next small action is more useful than the perfect plan.",
  author: "Winter Arc",
};

const QuoteCard = ({ dateKey }) => {
  const [quote, setQuote] = useState(fallbackQuote);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuote = async () => {
      try {
        const response = await fetch(`/api/quote?date=${encodeURIComponent(dateKey)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Quote request failed.");
        const data = await response.json();
        if (data.quote?.text) setQuote(data.quote);
      } catch (error) {
        if (error.name !== "AbortError") setQuote(fallbackQuote);
      }
    };

    loadQuote();
    return () => controller.abort();
  }, [dateKey]);

  return (
    <section className="quote-card">
      <div className="quote-mark">"</div>
      <p className="quote-text">
        {quote.text}
      </p>
      {quote.author && <p className="quote-author">— {quote.author}</p>}
    </section>
  )
}

export default QuoteCard
