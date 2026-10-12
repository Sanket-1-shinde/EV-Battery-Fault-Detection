import streamlit as st
import joblib
import pandas as pd
import numpy as np

@st.cache_resource
def load_model():
    return joblib.load("battery_fault_model.pkl")

model = load_model()

FEATURE_COLUMNS = [
    'Time (ms)',
    'Voltage (V)',
    'Current (A)',
    'Temperature (°C)',
    'Motor Speed (RPM)',
    'Hall Code',
    'Estimated SOC (%)',
    'Ground Truth SOC (%)',
    'Residual (%)'
]

FAULT_MAP = {
    0: "Normal Operation",
    1: "Overheating Fault",
    2: "Voltage Imbalance Fault"
}

st.set_page_config(page_title="EV Battery Fault Diagnosis", layout="centered")
st.title("🔋 EV Battery Fault Diagnosis System")

time_ms = st.number_input("Time (ms)", min_value=0.0, value=0.0)
voltage = st.number_input("Voltage (V)", min_value=0.0, value=3.65)
current = st.number_input("Current (A)", value=3.74)
temperature = st.number_input("Temperature (°C)", value=21.5)
speed = st.number_input("Motor Speed (RPM)", min_value=0.0, value=1350.0)
hall = st.selectbox("Hall Code", [111, 110, 101, 100, 11, 10, 1])
est_soc = st.number_input("Estimated SOC (%)", 0.0, 100.0, value=88.7)
gt_soc = st.number_input("Ground Truth SOC (%)", 0.0, 100.0, value=87.7)
residual = st.number_input("Residual (%)", value=1.0)

if st.button("🔍 Predict Fault"):
    input_df = pd.DataFrame(
        [[time_ms, voltage, current, temperature,
          speed, hall, est_soc, gt_soc, residual]],
        columns=FEATURE_COLUMNS
    )

prediction = model.predict(input_df)[0]
probabilities = model.predict_proba(input_df)[0]

st.success(
    f"### Predicted Fault: **{FAULT_MAP.get(prediction, prediction)}**"
)

st.write("### Fault Probabilities")
for cls, prob in zip(model.classes_, probabilities):
    st.write(f"- **{FAULT_MAP.get(cls, cls)}** : {prob * 100:.2f}%")