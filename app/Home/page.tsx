"use client"

import Bar from "@/components/Bar";
import Streak from "@/components/streak";
import Wellness from "@/components/wellness";
import Breath from "@/components/breath";
import Mindful from "@/components/mindful";
import Week from "@/components/week";
import "./Home.css"

export default function Home() {
    return (
        <div className="home-page">
            <div className="home-navbar">
                <Bar />
            </div>

            <main className="home-content">
                <section className="home-top">
                    <div className="home-title">
                        <h1>HEY!</h1>
                        <p>How are you feeling today?</p>
                    </div>

                    <div className="home-top-cards">
                        <Streak />
                        <Wellness />
                    </div>
                </section>

                <section className="home-recommend">
                    <h2 className="section-title">Recommended for you</h2>
                    <div className="recommend-cards">
                        <Mindful />
                        <Breath />
                    </div>
                </section>

                <section className="home-mood">
                    <h2 className="section-title">This week's mood</h2>
                    <Week />
                </section>
            </main>
        </div>
    )
}