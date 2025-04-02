import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "@/styles/Dashboard.module.css";

// ✅ Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface EVData {
  StateOfHealth: number;
  RemainingUsefulLife: number;
  BatteryCycleCount: number;
  OEMMaxCycleCount: number;
  BatteryAge: number;
  ChargeRateScore: number;
  DischargeRateScore: number;
  timestamp: string;
}

export default function EVDashboard() {
  const [evData, setEvData] = useState<EVData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEVData = async () => {
      try {
        const response = await fetch("/api/ev-dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch EV data");
        }
        const data = await response.json();
        
        // ✅ Pick one random row
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setEvData(data[randomIndex]);
        } else {
          setError("No data available");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEVData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;
  if (!evData) return <p>No data available</p>;

  // ✅ Pie chart data
  const pieData = {
    labels: ["Battery Cycle Count", "Remaining OEM Max Cycle Count"],
    datasets: [
      {
        data: [evData.BatteryCycleCount, evData.OEMMaxCycleCount - evData.BatteryCycleCount],
        backgroundColor: ["rgb(255, 217, 0)", "rgba(40, 167, 69, 0.6)"],
      },
    ],
  };

  // ✅ Calculate percentage
  const batteryCyclePercentage = ((evData.BatteryCycleCount / evData.OEMMaxCycleCount) * 100).toFixed(2);

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Electric Vehicle Battery Dashboard</h2>

      {/* ✅ Pie Chart: BatteryCycleCount vs. OEMMaxCycleCount */}
      <div className={styles.chartContainer}>
        <Pie data={pieData} />
        <p className={styles.percentageText}>
          Battery Cycle Count: {evData.BatteryCycleCount} ({batteryCyclePercentage}% of {evData.OEMMaxCycleCount})
        </p>
      </div>

      {/* ✅ Single row in the table */}
      <table className={styles.evTable}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>State of Health</th>
            <th>Remaining Useful Life</th>
            <th>Battery Cycle Count</th>
            <th>OEM Max Cycle Count</th>
            <th>Battery Age</th>
            <th>Charge Rate Score</th>
            <th>Discharge Rate Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{evData.timestamp}</td>
            <td>{evData.StateOfHealth}</td>
            <td>{evData.RemainingUsefulLife}</td>
            <td>{evData.BatteryCycleCount}</td>
            <td>{evData.OEMMaxCycleCount}</td>
            <td>{evData.BatteryAge}</td>
            <td>{evData.ChargeRateScore}</td>
            <td>{evData.DischargeRateScore}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
