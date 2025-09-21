export const assessmentConfig = {
  "as_hr_02": {
    name: "Health & Fitness Assessment Report",
    sections: [
      {
        name: "Key Body Vitals",
        fields: [
          {
            label: "Heart Rate",
            path: "vitalsMap.vitals.heart_rate",
            unit: "bpm",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Low", color: "#3498db" },
                { min: 60, max: 100, label: "Normal", color: "#2ecc71" },
                { min: 100, max: 1000, label: "High", color: "#e74c3c" }
              ]
            }
          },
          {
            label: "Blood Pressure",
            path: ["vitalsMap.vitals.bp_sys", "vitalsMap.vitals.bp_dia"],
            unit: "mmHg",
            format: (sys, dia) => `${sys} / ${dia}`,
            classification: {
              ranges: [
                { min: 0, max: 90, label: "Low", color: "#3498db" },
                { min: 90, max: 120, label: "Normal", color: "#2ecc71" },
                { min: 120, max: 140, label: "Elevated", color: "#f39c12" },
                { min: 140, max: 1000, label: "High", color: "#e74c3c" }
              ]
            }
          },
          {
            label: "Oxygen Saturation",
            path: "vitalsMap.vitals.oxy_sat_prcnt",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 90, label: "Low", color: "#e74c3c" },
                { min: 90, max: 95, label: "Moderate", color: "#f39c12" },
                { min: 95, max: 100, label: "Normal", color: "#2ecc71" }
              ]
            }
          },
          {
            label: "Respiratory Rate",
            path: "vitalsMap.vitals.resp_rate",
            unit: "breaths/min",
            classification: {
              ranges: [
                { min: 0, max: 12, label: "Low", color: "#3498db" },
                { min: 12, max: 20, label: "Normal", color: "#2ecc71" },
                { min: 20, max: 100, label: "High", color: "#e74c3c" }
              ]
            }
          }
        ]
      },
      {
        name: "Heart Health",
        fields: [
          {
            label: "Heart Rate Variability (SDNN)",
            path: "vitalsMap.metadata.heart_scores.sdnn",
            unit: "ms",
            classification: {
              ranges: [
                { min: 0, max: 50, label: "Low", color: "#e74c3c" },
                { min: 50, max: 100, label: "Normal", color: "#2ecc71" },
                { min: 100, max: 1000, label: "High", color: "#3498db" }
              ]
            }
          },
          {
            label: "Stress Index",
            path: "vitalsMap.metadata.heart_scores.stress_index",
            unit: "",
            classification: {
              ranges: [
                { min: 0, max: 1.5, label: "Low", color: "#2ecc71" },
                { min: 1.5, max: 3, label: "Moderate", color: "#f39c12" },
                { min: 3, max: 100, label: "High", color: "#e74c3c" }
              ]
            }
          }
        ]
      },
      {
        name: "Fitness Levels",
        fields: [
          {
            label: "VO2 Max",
            path: "vitalsMap.metadata.physiological_scores.vo2max",
            unit: "mL/kg/min",
            classification: {
              ranges: [
                { min: 0, max: 30, label: "Poor", color: "#e74c3c" },
                { min: 30, max: 40, label: "Fair", color: "#f39c12" },
                { min: 40, max: 50, label: "Good", color: "#f1c40f" },
                { min: 50, max: 60, label: "Excellent", color: "#2ecc71" },
                { min: 60, max: 100, label: "Superior", color: "#3498db" }
              ]
            }
          },
          {
            label: "Cardiovascular Endurance",
            path: "exercises[?(@.id==235)].setList[0].time",
            unit: "seconds",
            classification: {
              ranges: [
                { min: 0, max: 30, label: "Poor", color: "#e74c3c" },
                { min: 30, max: 45, label: "Fair", color: "#f39c12" },
                { min: 45, max: 60, label: "Good", color: "#f1c40f" },
                { min: 60, max: 1000, label: "Excellent", color: "#2ecc71" }
              ]
            }
          }
        ]
      },
      {
        name: "Body Composition",
        fields: [
          {
            label: "BMI",
            path: "bodyCompositionData.BMI",
            unit: "kg/m²",
            classification: {
              ranges: [
                { min: 0, max: 18.5, label: "Underweight", color: "#3498db" },
                { min: 18.5, max: 25, label: "Normal", color: "#2ecc71" },
                { min: 25, max: 30, label: "Overweight", color: "#f39c12" },
                { min: 30, max: 100, label: "Obese", color: "#e74c3c" }
              ]
            }
          },
          {
            label: "Body Fat Percentage",
            path: "bodyCompositionData.BFC",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 15, label: "Low", color: "#3498db" },
                { min: 15, max: 20, label: "Normal", color: "#2ecc71" },
                { min: 20, max: 25, label: "Elevated", color: "#f39c12" },
                { min: 25, max: 100, label: "High", color: "#e74c3c" }
              ]
            }
          },
          {
            label: "Lean Muscle Mass",
            path: "bodyCompositionData.LM",
            unit: "kg",
            classification: {
              ranges: [
                { min: 0, max: 40, label: "Low", color: "#e74c3c" },
                { min: 40, max: 60, label: "Moderate", color: "#f39c12" },
                { min: 60, max: 80, label: "Good", color: "#f1c40f" },
                { min: 80, max: 1000, label: "Excellent", color: "#2ecc71" }
              ]
            }
          }
        ]
      },
      {
        name: "Posture Analysis",
        fields: [
          {
            label: "Frontal Posture Score",
            path: "exercises[?(@.id==73)].analysisScore",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Poor", color: "#e74c3c" },
                { min: 60, max: 75, label: "Fair", color: "#f39c12" },
                { min: 75, max: 90, label: "Good", color: "#f1c40f" },
                { min: 90, max: 100, label: "Excellent", color: "#2ecc71" }
              ]
            }
          },
          {
            label: "Lateral Posture Score",
            path: "exercises[?(@.id==74)].analysisScore",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Poor", color: "#e74c3c" },
                { min: 60, max: 75, label: "Fair", color: "#f39c12" },
                { min: 75, max: 90, label: "Good", color: "#f1c40f" },
                { min: 90, max: 100, label: "Excellent", color: "#2ecc71" }
              ]
            }
          }
        ]
      },
      {
        name: "Overall Assessment",
        fields: [
          {
            label: "Overall Health Score",
            path: "accuracy",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Poor", color: "#e74c3c" },
                { min: 60, max: 75, label: "Fair", color: "#f39c12" },
                { min: 75, max: 90, label: "Good", color: "#f1c40f" },
                { min: 90, max: 100, label: "Excellent", color: "#2ecc71" }
              ]
            }
          },
          {
            label: "Wellness Score",
            path: "vitalsMap.wellness_score",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Poor", color: "#e74c3c" },
                { min: 60, max: 75, label: "Fair", color: "#f39c12" },
                { min: 75, max: 90, label: "Good", color: "#f1c40f" },
                { min: 90, max: 100, label: "Excellent", color: "#2ecc71" }
              ]
            }
          },
          {
            label: "Health Risk Score",
            path: "vitalsMap.health_risk_score",
            unit: "",
            classification: {
              ranges: [
                { min: 0, max: 10, label: "Low", color: "#2ecc71" },
                { min: 10, max: 20, label: "Moderate", color: "#f39c12" },
                { min: 20, max: 100, label: "High", color: "#e74c3c" }
              ]
            }
          }
        ]
      }
    ]
  },
  
  "as_card_01": {
    name: "Cardiac Health Assessment Report",
    sections: [
      {
        name: "Key Body Vitals",
        fields: [
          {
            label: "Heart Rate",
            path: "vitalsMap.vitals.heart_rate",
            unit: "bpm",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Low", color: "#3498db" },
                { min: 60, max: 100, label: "Normal", color: "#2ecc71" },
                { min: 100, max: 1000, label: "High", color: "#e74c3c" }
              ]
            }
          },
          {
            label: "Blood Pressure",
            path: ["vitalsMap.vitals.bp_sys", "vitalsMap.vitals.bp_dia"],
            unit: "mmHg",
            format: (sys, dia) => `${sys} / ${dia}`,
            classification: {
              ranges: [
                { min: 0, max: 90, label: "Low", color: "#3498db" },
                { min: 90, max: 120, label: "Normal", color: "#2ecc71" },
                { min: 120, max: 140, label: "Elevated", color: "#f39c12" },
                { min: 140, max: 1000, label: "High", color: "#e74c3c" }
              ]
            }
          },
          {
            label: "Oxygen Saturation",
            path: "vitalsMap.vitals.oxy_sat_prcnt",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 90, label: "Low", color: "#e74c3c" },
                { min: 90, max: 95, label: "Moderate", color: "#f39c12" },
                { min: 95, max: 100, label: "Normal", color: "#2ecc71" }
              ]
            }
          }
        ]
      },
      {
        name: "Cardiovascular Metrics",
        fields: [
          {
            label: "Cardiac Output",
            path: "vitalsMap.metadata.cardiovascular.cardiac_out",
            unit: "L/min",
            classification: {
              ranges: [
                { min: 0, max: 4, label: "Low", color: "#e74c3c" },
                { min: 4, max: 6, label: "Normal", color: "#2ecc71" },
                { min: 6, max: 100, label: "High", color: "#3498db" }
              ]
            }
          },
          {
            label: "Mean Arterial Pressure",
            path: "vitalsMap.metadata.cardiovascular.map",
            unit: "mmHg",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Low", color: "#e74c3c" },
                { min: 60, max: 100, label: "Normal", color: "#2ecc71" },
                { min: 100, max: 200, label: "High", color: "#f39c12" }
              ]
            }
          },
          {
            label: "Jog Test Performance",
            path: "exercises[?(@.id==235)].setList[0].additionalFields[?(@.fieldName=='accuracy')].fieldValue",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 20, label: "Poor", color: "#e74c3c" },
                { min: 20, max: 40, label: "Fair", color: "#f39c12" },
                { min: 40, max: 60, label: "Good", color: "#f1c40f" },
                { min: 60, max: 80, label: "Very Good", color: "#2ecc71" },
                { min: 80, max: 100, label: "Excellent", color: "#3498db" }
              ]
            }
          }
        ]
      },
      {
        name: "Heart Rate Analysis",
        fields: [
          {
            label: "Heart Rate Recovery",
            path: "vitalsMap.metadata.heart_scores.HRR",
            unit: "bpm",
            classification: {
              ranges: [
                { min: 0, max: 12, label: "Poor", color: "#e74c3c" },
                { min: 12, max: 20, label: "Fair", color: "#f39c12" },
                { min: 20, max: 30, label: "Good", color: "#f1c40f" },
                { min: 30, max: 1000, label: "Excellent", color: "#2ecc71" }
              ]
            }
          },
          {
            label: "Maximum Heart Rate",
            path: "vitalsMap.metadata.heart_scores.HRMax",
            unit: "bpm",
            classification: {
              ranges: [
                { min: 0, max: 100, label: "Low", color: "#3498db" },
                { min: 100, max: 180, label: "Normal", color: "#2ecc71" },
                { min: 180, max: 220, label: "High", color: "#f39c12" }
              ]
            }
          }
        ]
      },
      {
        name: "Body Composition",
        fields: [
          {
            label: "BMI",
            path: "bodyCompositionData.BMI",
            unit: "kg/m²",
            classification: {
              ranges: [
                { min: 0, max: 18.5, label: "Underweight", color: "#3498db" },
                { min: 18.5, max: 25, label: "Normal", color: "#2ecc71" },
                { min: 25, max: 30, label: "Overweight", color: "#f39c12" },
                { min: 30, max: 100, label: "Obese", color: "#e74c3c" }
              ]
            }
          }
        ]
      },
      {
        name: "Overall Assessment",
        fields: [
          {
            label: "Assessment Accuracy",
            path: "accuracy",
            unit: "%",
            classification: {
              ranges: [
                { min: 0, max: 20, label: "Poor", color: "#e74c3c" },
                { min: 20, max: 40, label: "Fair", color: "#f39c12" },
                { min: 40, max: 60, label: "Good", color: "#f1c40f" },
                { min: 60, max: 80, label: "Very Good", color: "#2ecc71" },
                { min: 80, max: 100, label: "Excellent", color: "#3498db" }
              ]
            }
          },
          {
            label: "Health Risk Score",
            path: "vitalsMap.health_risk_score",
            unit: "",
            classification: {
              ranges: [
                { min: 0, max: 10, label: "Low", color: "#2ecc71" },
                { min: 10, max: 20, label: "Moderate", color: "#f39c12" },
                { min: 20, max: 100, label: "High", color: "#e74c3c" }
              ]
            }
          }
        ]
      }
    ]
  }
};