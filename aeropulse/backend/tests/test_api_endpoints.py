"""
Integration tests for FastAPI endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["app"] == "AeroPulse Bengaluru"

def test_current_aqi():
    res = client.get("/api/aqi/current")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "Bengaluru"
    assert "city_composite" in data
    assert data["city_composite"]["aqi"] > 0

def test_stations_list():
    res = client.get("/api/stations")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 14
    assert len(data["stations"]) >= 14

def test_single_station():
    res = client.get("/api/stations/BLR_ST01")
    assert res.status_code == 200
    data = res.json()
    assert data["station_name"] == "Silk Board Junction"
    assert len(data["history_24h"]) > 0

def test_aqi_forecast():
    res = client.get("/api/aqi/forecast?station_id=BLR_ST01")
    assert res.status_code == 200
    data = res.json()
    assert len(data["short_term_forecast"]) >= 8
    assert len(data["long_term_projections"]) >= 4

def test_chat_endpoint():
    res = client.post("/api/chat", json={
        "query": "Can I go running today?",
        "station_name": "Silk Board Junction",
        "current_aqi": 186
    })
    assert res.status_code == 200
    data = res.json()
    assert "response" in data
    assert "suggested_followups" in data

def test_export_datasets_catalog():
    res = client.get("/api/export/datasets")
    assert res.status_code == 200
    data = res.json()
    assert data["dataset_count"] >= 15
