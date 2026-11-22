import "@/styles/mindful.css";

export default function Mindful() {
  return (
    <div className="card">
      <div className="card-image-box">
        <img src="/mind.png" alt="mindful" />
      </div>

      <div className="text">
        <a
          className="title"
          href="https://youtu.be/sG7DBA-mgFY?si=DYK1qcYPBbFLpK6L"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mindfulness
        </a>
        <span className="desc">10-min guided awareness session</span>
      </div>
    </div>
  );
}