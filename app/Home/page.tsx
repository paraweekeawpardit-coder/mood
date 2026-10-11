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

            <div className="home-content">
                <div className="home-top">

                    <div className="home-title">
                        <h1>
                            HEY !
                        </h1>
                        <p>
                            How are you feeling today?
                        </p>
                    </div>

                    <div className="home-top-cards">
                        <Streak />
                        <Wellness />
                    </div>

                </div>

                <div className="home-recommend">
                    <p className="section-title">
                        Recommended for you
                    </p>

                    <div className="recommend-cards">
                        <Mindful />
                        <Breath />
                    </div>

                </div>

                <div className="home-mood">
                    <p className="section-title">
                        This week's mood
                    </p>
                    <Week />
                </div>

            </div>

        </div>
    )
}