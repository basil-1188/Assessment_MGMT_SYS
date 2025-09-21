Configuration System Documentation
Overview
The configuration system for the Assessment Management System defines the structure and behavior of assessment reports, such as the as_hr_02 (Health & Fitness Assessment Report) and as_card_01 (Cardiac Health Assessment Report). Located in server/config/config.js, this system uses a modular JSON-like structure to map session data to report sections, fields, and classifications. It leverages the getValueByPath function for flexible data access, including array filtering and nested paths.
Design Principles

Modularity: Each assessment type is a self-contained object with sections, fields, and classifications.
Flexibility: Supports complex paths (e.g., exercises[?(@.id==235)]) and formatted outputs (e.g., Blood Pressure as ${sys} / ${dia}).
Extensibility: New assessment types, fields, and ranges can be added without core logic changes.

Key Components

Assessment Config (assessmentConfig): Maps assessment IDs to their configurations.
Sections: Groups of related fields (e.g., "Key Body Vitals", "Fitness Levels").
Fields: Includes label, path, unit, format (optional), and classification for each metric.
Classification: Defines ranges with min, max, label, and color (e.g., #2ecc71 for green) for visual categorization.
Path Resolution: The getValueByPath function handles dynamic data extraction from healthDatasets.

Integration

The configuration is imported in server/controller/reportController.js to generate HTML for PDF reports.
Fields with format (e.g., Blood Pressure) combine multiple values, while classification applies color-coded labels based on ranges.

How to Add New Assessment Types
To introduce a new assessment type:

Open server/config/config.js.
Add a New Assessment Object:

Use a unique assessment_id (e.g., "as_resp_01").
Define name and sections with relevant fields.
Example:
"as_resp_01": {
  name: "Respiratory Health Assessment Report",
  sections: [
    {
      name: "Lung Function",
      fields: [
        {
          label: "FEV1",
          path: "vitalsMap.lung.fev1",
          unit: "L",
          classification: {
            ranges: [
              { min: 0, max: 2, label: "Low", color: "#e74c3c" },
              { min: 2, max: 4, label: "Normal", color: "#2ecc71" },
              { min: 4, max: 10, label: "High", color: "#3498db" }
            ]
          }
        }
      ]
    }
  ]
}



Update Data: Add sessions in server/data/data.js with assessment_id: "as_resp_01" and matching path data (e.g., vitalsMap.lung.fev1: 3.5).
Test: Restart the server and generate a report to verify the new assessment.

How to Modify Data Field Mappings
To adjust data mappings:

Locate the Field: Find the target field in the sections array (e.g., "Heart Rate" in "as_hr_02").
Adjust the path:

Update the path to match new data locations.
Example: Change vitalsMap.vitals.heart_rate to vitalsMap.new_vitals.heart_rate:
{
  label: "Heart Rate",
  path: "vitalsMap.new_vitals.heart_rate",
  unit: "bpm",
  classification: {
    ranges: [
      { min: 0, max: 60, label: "Low", color: "#3498db" },
      { min: 60, max: 100, label: "Normal", color: "#2ecc71" },
      { min: 100, max: 1000, label: "High", color: "#e74c3c" }
    ]
  }
}



Update Session Data: Ensure healthDatasets reflects the new path.
Verify: Test report generation to confirm the new path resolves correctly.

How to Update Classification Ranges
To modify how values are categorized:

Find the Classification: Locate the classification.ranges for the field (e.g., "VO2 Max" in "as_hr_02").
Modify Ranges:

Adjust min, max, label, and color values.
Example: Update "VO2 Max" for finer granularity:
classification: {
  ranges: [
    { min: 0, max: 30, label: "Poor", color: "#e74c3c" },
    { min: 30, max: 40, label: "Fair", color: "#f39c12" },
    { min: 40, max: 50, label: "Good", color: "#f1c40f" },
    { min: 50, max: 60, label: "Excellent", color: "#2ecc71" },
    { min: 60, max: 70, label: "Superior", color: "#3498db" },
    { min: 70, max: 100, label: "Elite", color: "#9b59b6" }
  ]
}



Test: Generate a report and check that classifications align with the new ranges.

Examples of Configuration Files/Structures
Current as_hr_02 Example
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
        }
      ]
    }
  ]
}

Description: Includes "Heart Rate" and "Blood Pressure" with formatted output and color-coded classifications.

Current as_card_01 Example
"as_card_01": {
  name: "Cardiac Health Assessment Report",
  sections: [
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
    }
  ]
}

Description: Features "Cardiac Output" and a complex path for "Jog Test Performance" with nested array filtering.

New Assessment Example
"as_resp_01": {
  name: "Respiratory Health Assessment Report",
  sections: [
    {
      name: "Lung Capacity",
      fields: [
        {
          label: "Peak Expiratory Flow",
          path: "vitalsMap.lung.pef",
          unit: "L/min",
          classification: {
            ranges: [
              { min: 0, max: 200, label: "Low", color: "#e74c3c" },
              { min: 200, max: 400, label: "Normal", color: "#2ecc71" },
              { min: 400, max: 800, label: "High", color: "#3498db" }
            ]
          }
        }
      ]
    }
  ]
}

Description: A new assessment for respiratory health with a simple path and classification.

Modified Field Mapping Example
{
  label: "Oxygen Saturation",
  path: "vitalsMap.new_vitals.oxy_sat_prcnt",
  unit: "%",
  classification: {
    ranges: [
      { min: 0, max: 90, label: "Low", color: "#e74c3c" },
      { min: 90, max: 95, label: "Moderate", color: "#f39c12" },
      { min: 95, max: 100, label: "Normal", color: "#2ecc71" }
    ]
  }
}

Description: Relocates "Oxygen Saturation" to a new path while preserving its classification.

Best Practices

Consistency: Ensure path values align with healthDatasets structure.
Validation: Test new configurations with sample data to prevent errors.
Color Usage: Use distinct HEX colors (e.g., #3498db, #2ecc71) for readability across themes.
