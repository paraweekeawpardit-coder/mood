import "@/styles/Breath.css";

export default function Breath(){

    return(
        <div className="breath-card">
            <div className="breath-image-box">
                <img
                    className="breath-image"
                    src="/breath.png"
                    alt="breath"
                />
            </div>
            <div className="breath-content">
                <span className="breath-title">
                    Breathing Exercise
                </span>
                <span className="breath-description">
                    Ease tension with a 4-7-8 breathing session — just 5 minutes
                </span>
            </div>
        </div>
    )
}