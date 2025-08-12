import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

const NutritionChart = ({ dataHistory: propDataHistory }) => {
    const [dataHistory, setDataHistory] = useState(propDataHistory || []);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/nutrition/demoUser/history');
                setDataHistory(res.data);
            } catch (err) {
                setDataHistory([]);
            }
        };
        fetchHistory();
    }, []);

    const labels = dataHistory.map((entry, index) => `Day ${index + 1}`);
    const calories = dataHistory.map(entry => Number(entry.calories));
    const protein = dataHistory.map(entry => Number(entry.protein));
    const carbs = dataHistory.map(entry => Number(entry.carbs));
    const fat = dataHistory.map(entry => Number(entry.fat));

    const chartData = {
        labels,
        datasets: [
            {
                label: "Calories",
                data: calories,
                backgroundColor: "#ff6b81",
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
            },
            {
                label: "Protein (g)",
                data: protein,
                backgroundColor: "#3b82f6",
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
            },
            {
                label: "Carbs (g)",
                data: carbs,
                backgroundColor: "#fbbf24",
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
            },
            {
                label: "Fat (g)",
                data: fat,
                backgroundColor: "#10b981",
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 14, family: "Inter, sans-serif" },
                    color: "#b91c1c"
                }
            },
            title: {
                display: true,
                text: "Weekly Nutrition Bar Chart",
                font: { size: 18, family: "Inter, sans-serif" },
                color: "#b91c1c"
            },
            tooltip: {
                backgroundColor: "#fff0f6",
                titleColor: "#b91c1c",
                bodyColor: "#b91c1c",
                borderColor: "#ff6b81",
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: { color: "#ffe0e0" },
                ticks: { color: "#b91c1c", font: { size: 13 } }
            },
            y: {
                grid: { color: "#ffe0e0" },
                ticks: { color: "#b91c1c", font: { size: 13 } }
            }
        }
    };

    // Clear nutrition history from backend
    const handleClearHistory = async () => {
        try {
            await axios.delete('/api/nutrition/demoUser/history');
            setDataHistory([]);
            window.location.reload();
        } catch (err) {
            // handle error
        }
    };

    return (
        <section style={{ marginTop: "2rem", background: "linear-gradient(135deg, #fff0f6 0%, #ffe0e0 100%)", borderRadius: "1.5rem", boxShadow: "0 4px 16px rgba(255,182,193,0.12)", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#b91c1c", fontWeight: 700, fontSize: "1.4rem", margin: 0 }}>Weekly Nutrition Bar Chart</h3>
                <button
                    className="btn-primary"
                    style={{ padding: "0.5rem 1.2rem", fontSize: "1rem", borderRadius: "0.75rem", background: "linear-gradient(135deg, #ff6b81 0%, #b91c1c 100%)", color: "#fff", border: "none", cursor: "pointer" }}
                    onClick={handleClearHistory}
                    aria-label="Clear Nutrition History"
                >
                    🗑️ Clear History
                </button>
            </div>
            <Bar data={chartData} options={options} />
        </section>
    );
};

export default NutritionChart;
