import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Home.module.css";
import UserPool from "@/lib/cognito";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Battery {
  PowerUnitId: string;
}

interface BatteryDetails {
  PowerUnitId: string;
  PackTemperatureScore: number;
  ChargeRateScore: number;
  DischargeRateScore: number;
  TimeAtSOCScore: number;
  BatteryCycleCount: number;
  OEMMaxCycleCount: number;
  StateOfHealth: number;
}

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<BatteryDetails | null>(null);
  const [hoverBattery, setHoverBattery] = useState<BatteryDetails | null>(null);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  useEffect(() => {
    const user: CognitoUser | null = UserPool.getCurrentUser();
    if (user) {
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (!err && session && session.isValid()) {
          setIsLoggedIn(true);
        } else {
          router.push("/");
        }
      });
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    fetch("/api/batteries")
      .then((res) => res.json())
      .then((data: Battery[]) => {
        setBatteries(data);
        if (data.length > 0) {
          handleBatterySelect(data[0].PowerUnitId, true);
        }
      })
      .catch((error) => console.error("Error fetching battery data:", error));
  }, []);

  const handleBatterySelect = (powerUnitId: string, isDefault = false) => {
    fetch(`/api/batteries?powerUnitId=${powerUnitId}`)
      .then((res) => res.json())
      .then((data: BatteryDetails) => {
        if (isDefault) {
          setSelectedBattery(data);
        } else {
          setHoverBattery(data);
        }
        setHeatmapData([
          {
            z: [[data.StateOfHealth]],
            type: "heatmap",
            colorscale: [
              [0, "red"], 
              [0.5, "yellow"], 
              [1, "green"],
            ],
            colorbar: {
              title: "State of Health (%)",
              titleside: "right",
              tickmode: "array",
              tickvals: [0, data.StateOfHealth, 100],
              ticktext: ["0%", `${data.StateOfHealth}%`, "100%"],
            },
          },
        ]);
      })
      .catch((error) => console.error("Error fetching battery details:", error));
  };

  const displayedBattery = hoverBattery || selectedBattery;

  return isLoggedIn ? (
    <div className={styles.container}>
      <Sidebar onLogout={() => UserPool.getCurrentUser()?.signOut() || router.push("/")} />
      <div className={styles.main} style={{ display: "flex", flexDirection: "row", gap: "20px", alignItems: "flex-start" }}>
        
        {/* Battery List */}
        <div className={styles.section} style={{ width: "200px", textAlign: "left", overflowY: "auto", maxHeight: "500px" }}>
          <h2>Battery List</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "black" }}>
            <thead>
              <tr style={{ backgroundColor: "#ddd" }}>
                <th style={{ padding: "10px", border: "1px solid black" }}>Battery Number</th>
              </tr>
            </thead>
            <tbody>
              {batteries.map((battery) => (
                <tr key={battery.PowerUnitId}>
                  <td style={{ padding: "10px", border: "1px solid black" }}>
                    <button
                      style={{ width: "100%", padding: "8px", cursor: "pointer", backgroundColor: "#f0f0f0", border: "none" }}
                      onClick={() => handleBatterySelect(battery.PowerUnitId, true)}
                    >
                      {battery.PowerUnitId}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Battery Details */}
        <div className={styles.section} style={{ width: "300px", textAlign: "left" }}>
          <h2>Battery Details</h2>
          {displayedBattery ? (
            <div>
              {["PackTemperatureScore", "ChargeRateScore", "DischargeRateScore", "TimeAtSOCScore"].map((score) => (
                <div key={score} style={{ marginBottom: "10px" }}>
                  <p>{score.replace(/([A-Z])/g, " $1")}: {displayedBattery[score as keyof BatteryDetails]}%</p>
                  <div style={{ width: "100%", height: "10px", backgroundColor: "#ddd" }}>
                    <div style={{
                      width: `${displayedBattery[score as keyof BatteryDetails]}%`,
                      height: "100%",
                      backgroundColor: "green"
                    }}></div>
                  </div>
                </div>
              ))}
              <h3>Battery Cycles</h3>
              <Plot
                data={[
                  {
                    values: [displayedBattery.BatteryCycleCount, displayedBattery.OEMMaxCycleCount - displayedBattery.BatteryCycleCount],
                    labels: ["Used", "Remaining"],
                    type: "pie",
                    marker: { colors: ["#ff6666", "#66b3ff"] },
                  },
                ]}
                layout={{ title: "Cycle Usage", showlegend: true }}
                style={{ width: "100%", height: "500px" }}
              />
            </div>
          ) : (
            <p>Select a battery to view details.</p>
          )}
        </div>

        {/* Heatmap */}
        <div className={styles.section} style={{ flex: 8, textAlign: "left" }}>
          <h2>State of Battery Health</h2>
          {displayedBattery && (
            <Plot
              data={heatmapData}
              layout={{ title: "State of Health", dragmode: false, autosize: true }}
              style={{ width: "100%", height: "500px" }}
            />
          )}
        </div>
      </div>
    </div>
  ) : null;
}
