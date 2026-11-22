import "@/styles/Breath.css";

export default function Breath() {
    return (
        <div className="breath-card">
            <div className="breath-image-box">
                <img
                    className="breath-image"
                    src="/breath.png"
                    alt="Breathing exercise"
                />
            </div>
            <div className="breath-content">
                <a
                className="title"
                href="https://youtu.be/OXjlR4mXxSk?si=RXFbKCsTPwbBJOFU"
                target="_blank"
                rel="noopener noreferrer">
                    Breathing Exercise
                </a>
                <span className="breath-description">
                    Ease tension with a 4-7-8 breathing session — just 5 minutes
                </span>
            </div>
            <svg
                className="card-arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m9 18 6-6-6-6" />
            </svg>
        </div>
    )
}