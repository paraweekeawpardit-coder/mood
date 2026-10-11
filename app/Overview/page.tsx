"use client";

import TopMood from "@/components/top";
import Trend from "@/components/trend";
import Distribution from "@/components/distribution";
import HeatMap from "@/components/heatmap";
import Score from "@/components/score";
import Lesson from "@/components/Lesson";
import Praise from "@/components/praise";
import Bar from "@/components/Bar";
import "./Overview.css";

export default function Overview() {

    return (

        <div className="overview-page">

            <div className="overview-navbar">
                <Bar />
            </div>

            <div className="overview-content">

                <div className="overview-left">
                    <Distribution />
                    <Score />
                    <TopMood />
                </div>

                <div className="overview-center">
                    <HeatMap />
                    <Trend />
                </div>

                <div className="overview-right">
                    <Lesson />
                    <Praise />
                </div>

            </div>

        </div>
    )
}