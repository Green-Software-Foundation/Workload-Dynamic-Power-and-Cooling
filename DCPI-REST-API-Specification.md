# DCPI REST API Specification v1.0

## Authentication

### POST /auth/token
Obtain JWT access token using mTLS client certificate authentication.

**Request Headers:**
```http
Content-Type: application/json
X-Client-Certificate-CN: workload-scheduler-01.example.com
```

**Request Body:**
```json
{
  "client_id": "workload-scheduler-01",
  "scope": ["workload:announce", "power:read", "thermal:read"],
  "facility_id": "datacenter-campus-primary"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": ["workload:announce", "power:read", "thermal:read"],
  "facility_id": "datacenter-campus-primary"
}
```

### POST /auth/refresh
Refresh expired access token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token_string"
}
```

---

## Workload Management

### POST /workloads/announce
Announce new computational workload with power and thermal requirements.

**Required Scope:** `workload:announce`

**Request Body:**
```json
{
  "workload_id": "ai-training-job-12345",
  "workload_type": "ai_training",
  "classification": {
    "category": "machine_learning",
    "subcategory": "transformer_training",
    "model_size": "175B_parameters"
  },
  "power_profile": {
    "peak_power_mw": 180.5,
    "baseline_power_mw": 20.0,
    "average_power_mw": 145.2,
    "ramp_rate_mw_per_sec": 45.0,
    "duration_estimate_sec": 3600,
    "power_schedule": [
      {
        "timestamp": "2025-06-04T15:00:00Z",
        "power_mw": 20.0,
        "phase": "data_loading"
      },
      {
        "timestamp": "2025-06-04T15:05:00Z", 
        "power_mw": 180.5,
        "phase": "forward_pass"
      },
      {
        "timestamp": "2025-06-04T15:10:00Z",
        "power_mw": 200.0,
        "phase": "backward_pass"
      }
    ]
  },
  "thermal_profile": {
    "heat_generation_mw": 175.0,
    "preferred_coolant_temp_c": 65.0,
    "max_silicon_temp_c": 85.0,
    "critical_temp_c": 95.0,
    "heat_distribution": {
      "gpu_percent": 80,
      "cpu_percent": 15,
      "memory_percent": 5
    }
  },
  "flexibility": {
    "can_delay": true,
    "max_delay_sec": 1800,
    "can_throttle": true,
    "min_power_mw": 90.0,
    "can_pause": true,
    "max_pause_duration_sec": 900,
    "can_migrate": false
  },
  "timing_constraints": {
    "priority": "high",
    "deadline": "2025-06-05T08:00:00Z",
    "earliest_start": "2025-06-04T15:00:00Z",
    "latest_start": "2025-06-04T18:00:00Z",
    "business_criticality": "research_training",
    "preemption_allowed": false
  },
  "dependencies": [
    "data-preprocessing-job-11223"
  ],
  "resource_requirements": {
    "compute_nodes": 64,
    "gpu_count": 512,
    "memory_gb": 40960,
    "storage_tb": 50
  }
}
```

**Response (202 Accepted):**
```json
{
  "workload_id": "ai-training-job-12345",
  "status": "pending_approval",
  "request_id": "req-789012",
  "estimated_response_time_sec": 5,
  "message": "Workload announcement received and under evaluation"
}
```

### GET /workloads/{workload_id}/status
Get current status of announced workload.

**Response (200 OK):**
```json
{
  "workload_id": "ai-training-job-12345",
  "status": "approved_with_conditions",
  "approval_timestamp": "2025-06-04T14:30:05Z",
  "conditions": {
    "start_time": "2025-06-04T15:05:00Z",
    "max_power_mw": 150.0,
    "duration_limit_sec": 3000
  },
  "infrastructure_allocation": {
    "cooling_loop": "liquid_cooling_loop_a",
    "power_circuit": "circuit_7",
    "thermal_capacity_mw": 145.0
  },
  "grid_status": {
    "green_energy_available": true,
    "carbon_intensity_g_co2_kwh": 45,
    "grid_stability": "normal"
  }
}
```

### PUT /workloads/{workload_id}/control
Control running workload (throttle, pause, resume, terminate).

**Required Scope:** `workload:control`

**Request Body:**
```json
{
  "action": "throttle",
  "parameters": {
    "target_power_mw": 120.0,
    "ramp_rate_mw_per_sec": 10.0,
    "reason": "grid_stability_request"
  }
}
```

---

## Power Management

### GET /power/realtime
Get real-time power measurements with sub-second resolution.

**Required Scope:** `power:read`

**Query Parameters:**
- `resolution_ms`: Temporal resolution (100-1000ms, default: 100)
- `duration_sec`: Measurement window (1-300sec, default: 60)

**Response (200 OK):**
```json
{
  "facility_id": "datacenter-campus-primary",
  "measurement_timestamp": "2025-06-04T14:35:00.100Z",
  "total_power_mw": 145.7,
  "power_quality": {
    "thd_percent": 2.1,
    "power_factor": 0.97,
    "voltage_stability": "normal"
  },
  "power_breakdown": {
    "compute_load_mw": 125.5,
    "cooling_systems_mw": 15.2,
    "infrastructure_mw": 5.0
  },
  "measurements": [
    {
      "timestamp": "2025-06-04T14:35:00.000Z",
      "power_mw": 145.7,
      "voltage_v": 480.2,
      "current_a": 175.1,
      "frequency_hz": 60.0
    }
  ]
}
```

### POST /power/control
Execute power management control commands.

**Required Scope:** `power:control`

**Request Body:**
```json
{
  "commands": [
    {
      "target": "battery_system_1",
      "action": "discharge",
      "parameters": {
        "power_mw": 75.0,
        "duration_sec": 1800,
        "ramp_rate_mw_per_sec": 25.0
      }
    },
    {
      "target": "grid_interface",
      "action": "signal_load_change",
      "parameters": {
        "delta_power_mw": 50.0,
        "notification_time_sec": 300
      }
    }
  ]
}
```

### GET /power/forecast
Get power consumption forecast with confidence intervals.

**Required Scope:** `power:read`

**Query Parameters:**
- `horizon_hours`: Forecast horizon (1-48 hours, default: 24)
- `resolution_minutes`: Temporal resolution (1-60 minutes, default: 15)

**Response (200 OK):**
```json
{
  "forecast_generated": "2025-06-04T14:00:00Z",
  "forecast_horizon_hours": 24,
  "baseline_load_mw": 95.0,
  "forecast_accuracy": {
    "fifteen_min_percent": 85,
    "one_hour_percent": 78
  },
  "forecast_data": [
    {
      "timestamp": "2025-06-04T15:00:00Z",
      "predicted_load_mw": 145.0,
      "confidence_percent": 85,
      "confidence_interval": {
        "lower_bound_mw": 135.0,
        "upper_bound_mw": 155.0
      },
      "flexibility": {
        "up_mw": 45.0,
        "down_mw": 25.0,
        "response_time_sec": 30
      },
      "workload_composition": {
        "ai_training_mw": 85.0,
        "inference_serving_mw": 35.0,
        "traditional_compute_mw": 25.0
      }
    }
  ]
}
```

---

## Thermal Management

### GET /thermal/status
Get real-time thermal system status.

**Required Scope:** `thermal:read`

**Response (200 OK):**
```json
{
  "facility_id": "datacenter-campus-primary",
  "measurement_timestamp": "2025-06-04T14:35:00Z",
  "cooling_systems": [
    {
      "system_id": "liquid_cooling_loop_a",
      "type": "single_phase",
      "status": "operational",
      "inlet_temp_c": 12.1,
      "outlet_temp_c": 18.7,
      "flow_rate_lpm": 2500,
      "pressure_bar": 3.2,
      "heat_load_mw": 120.5,
      "efficiency_percent": 92.1
    },
    {
      "system_id": "two_phase_cooling_b",
      "type": "two_phase", 
      "status": "operational",
      "phase_change_detected": true,
      "vapor_quality_percent": 15.2,
      "condensation_temp_c": 78.5,
      "heat_recovery_mw": 95.0
    }
  ],
  "heat_recovery": {
    "municipal_interface_active": true,
    "heat_delivered_mw": 95.0,
    "supply_temp_c": 82.1,
    "return_temp_c": 65.3,
    "municipal_demand_mw": 120.0
  }
}
```

### POST /thermal/control
Execute thermal management control commands.

**Required Scope:** `thermal:control`

**Request Body:**
```json
{
  "system_id": "liquid_cooling_loop_a",
  "commands": [
    {
      "parameter": "flow_rate",
      "target_value": 3000,
      "unit": "lpm",
      "ramp_rate_per_sec": 100
    },
    {
      "parameter": "inlet_temperature",
      "target_value": 10.0,
      "unit": "celsius",
      "tolerance": 0.2
    }
  ],
  "coordination": {
    "prepare_for_workload": "ai-training-job-12345",
    "estimated_heat_load_mw": 175.0,
    "preparation_time_sec": 120
  }
}
```

### GET /thermal/sensors
Get detailed sensor readings from thermal monitoring systems.

**Required Scope:** `thermal:read`

**Query Parameters:**
- `system_id`: Specific cooling system (optional)
- `sensor_type`: Temperature, flow, pressure (optional)
- `resolution_sec`: Sampling resolution (1-60sec, default: 1)

**Response (200 OK):**
```json
{
  "sensors": [
    {
      "sensor_id": "temp_inlet_001",
      "type": "temperature",
      "location": "coolant_inlet",
      "value": 12.1,
      "unit": "celsius",
      "accuracy": 0.1,
      "timestamp": "2025-06-04T14:35:00Z",
      "status": "normal"
    },
    {
      "sensor_id": "flow_main_001", 
      "type": "flow_rate",
      "location": "main_circulation",
      "value": 2500,
      "unit": "lpm",
      "accuracy": 25,
      "timestamp": "2025-06-04T14:35:00Z",
      "status": "normal"
    }
  ]
}
```

---

## Grid Integration

### POST /grid/forecast
Submit load forecast to grid operators.

**Required Scope:** `grid:communicate`

**Request Body:**
```json
{
  "facility_id": "datacenter-campus-primary",
  "forecast_horizon_hours": 24,
  "baseline_load_mw": 95.0,
  "forecast_data": [
    {
      "timestamp": "2025-06-04T15:00:00Z",
      "predicted_load_mw": 145.0,
      "confidence_percent": 85,
      "flexibility_up_mw": 45.0,
      "flexibility_down_mw": 25.0,
      "response_time_sec": 30
    }
  ]
}
```

### GET /grid/status
Get current grid conditions and renewable energy availability.

**Required Scope:** `grid:read`

**Response (200 OK):**
```json
{
  "grid_operator": "utility-company-west",
  "timestamp": "2025-06-04T14:35:00Z",
  "grid_frequency_hz": 60.001,
  "stability_status": "normal",
  "carbon_intensity_g_co2_kwh": 45,
  "renewable_generation": {
    "total_available_mw": 500,
    "wind_mw": 325,
    "solar_mw": 150,
    "hydro_mw": 25,
    "percentage_of_total": 78
  },
  "electricity_pricing": {
    "current_price_per_mwh": 45.50,
    "next_hour_forecast": 42.30,
    "peak_time_active": false
  },
  "demand_response_active": false
}
```

### POST /grid/demand-response
Respond to grid operator demand response request.

**Required Scope:** `grid:respond`

**Request Body:**
```json
{
  "event_id": "dr-event-2025-154",
  "response": "accept",
  "commitment": {
    "load_reduction_mw": 75.0,
    "duration_hours": 2,
    "response_time_sec": 300,
    "affected_workloads": [
      "ai-training-job-12345",
      "research-simulation-67890"
    ]
  }
}
```

---

## Municipal Heat Integration

### GET /heat/municipal/status
Get status of municipal heat network integration.

**Required Scope:** `heat:read`

**Response (200 OK):**
```json
{
  "municipal_partner": "berlin-district-heating",
  "connection_status": "active",
  "heat_delivery": {
    "current_output_mw": 95.0,
    "supply_temperature_c": 82.1,
    "return_temperature_c": 65.3,
    "flow_rate_m3h": 1200,
    "heat_quality": "district_heating_grade"
  },
  "municipal_demand": {
    "current_request_mw": 120.0,
    "peak_demand_forecast_mw": 150.0,
    "seasonal_profile": "winter_heating"
  },
  "economic_metrics": {
    "heat_price_eur_per_mwh": 25.00,
    "carbon_offset_tons_co2": 45.2,
    "revenue_today_eur": 2280.50
  }
}
```

### POST /heat/municipal/availability
Signal heat availability to municipal heat network.

**Required Scope:** `heat:communicate`

**Request Body:**
```json
{
  "availability_window": {
    "start_time": "2025-06-04T15:00:00Z",
    "end_time": "2025-06-04T21:00:00Z"
  },
  "heat_profile": {
    "available_heat_mw": 120.0,
    "supply_temperature_c": 85.0,
    "maximum_flow_rate_m3h": 1500,
    "reliability_percent": 95
  },
  "coordination": {
    "workload_dependent": true,
    "affected_workloads": ["ai-training-job-12345"],
    "flexibility_mw": 30.0
  }
}
```

---

## System Monitoring

### GET /system/health
Get overall DCPI system health status.

**Required Scope:** `system:read`

**Response (200 OK):**
```json
{
  "overall_status": "healthy",
  "timestamp": "2025-06-04T14:35:00Z",
  "subsystems": {
    "power_management": {
      "status": "operational",
      "response_time_ms": 75,
      "accuracy_percent": 99.2
    },
    "thermal_management": {
      "status": "operational", 
      "cooling_efficiency_percent": 92.1,
      "sensor_availability_percent": 98.5
    },
    "grid_integration": {
      "status": "operational",
      "last_communication": "2025-06-04T14:34:30Z",
      "forecast_accuracy_percent": 85.2
    },
    "security": {
      "status": "secure",
      "certificate_expiry": "2025-12-04T14:35:00Z",
      "intrusion_attempts": 0
    }
  },
  "performance_metrics": {
    "api_response_time_ms": 125,
    "uptime_percent": 99.97,
    "error_rate_percent": 0.03
  }
}
```

### GET /system/metrics
Get detailed system performance metrics.

**Required Scope:** `system:read`

**Query Parameters:**
- `metric_type`: power, thermal, grid, security (optional)
- `time_range`: 1h, 24h, 7d (default: 1h)

**Response (200 OK):**
```json
{
  "metrics_window": {
    "start_time": "2025-06-04T13:35:00Z",
    "end_time": "2025-06-04T14:35:00Z",
    "resolution": "1_minute"
  },
  "power_metrics": {
    "average_load_mw": 142.5,
    "peak_load_mw": 185.2,
    "load_factor": 0.77,
    "power_quality_score": 0.95
  },
  "thermal_metrics": {
    "cooling_efficiency": 0.921,
    "heat_recovery_rate": 0.68,
    "temperature_stability": 0.98
  },
  "coordination_metrics": {
    "workload_approval_rate": 0.94,
    "forecast_accuracy": 0.85,
    "response_time_compliance": 0.99
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "INSUFFICIENT_COOLING_CAPACITY",
    "message": "Requested workload exceeds available thermal management capacity",
    "details": {
      "requested_heat_mw": 200.0,
      "available_capacity_mw": 150.0,
      "suggested_alternatives": [
        "Reduce workload power consumption to 135MW",
        "Delay start time by 45 minutes"
      ]
    },
    "timestamp": "2025-06-04T14:35:00Z",
    "request_id": "req-789012"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `INVALID_WORKLOAD_PROFILE` | 400 | Workload power profile contains invalid data |
| `INSUFFICIENT_POWER_CAPACITY` | 409 | Requested power exceeds available infrastructure capacity |
| `INSUFFICIENT_COOLING_CAPACITY` | 409 | Thermal requirements exceed cooling system capacity |
| `GRID_STABILITY_CONSTRAINT` | 409 | Workload would create grid stability issues |
| `AUTHENTICATION_FAILED` | 401 | Invalid or expired authentication credentials |
| `AUTHORIZATION_DENIED` | 403 | Insufficient permissions for requested operation |
| `RESOURCE_NOT_FOUND` | 404 | Specified workload or resource does not exist |
| `RATE_LIMIT_EXCEEDED` | 429 | API rate limit exceeded |
| `SYSTEM_MAINTENANCE` | 503 | DCPI system temporarily unavailable |

---

## Rate Limiting

### Standard Rate Limits

| Endpoint Category | Requests per minute | Burst limit |
|---|---|---|
| Authentication | 10 | 20 |
| Workload operations | 60 | 100 |
| Real-time monitoring | 600 | 1000 |
| Control operations | 30 | 50 |
| Grid communications | 20 | 40 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1638360000
```

---

## WebSocket Endpoints

### WSS /stream/power/realtime
Real-time power monitoring stream with sub-second updates.

**Connection:**
```javascript
const ws = new WebSocket('wss://dcpi-controller.example.com/api/v1/stream/power/realtime');
ws.addEventListener('message', (event) => {
  const powerData = JSON.parse(event.data);
  console.log(powerData);
});
```

**Message Format:**
```json
{
  "timestamp": "2025-06-04T14:35:00.100Z",
  "power_mw": 145.7,
  "power_quality": {
    "thd_percent": 2.1,
    "power_factor": 0.97
  },
  "workload_breakdown": {
    "ai-training-job-12345": 85.2,
    "inference-cluster-01": 35.8,
    "baseline_infrastructure": 24.7
  }
}
```

### WSS /stream/thermal/realtime
Real-time thermal monitoring stream.

**Message Format:**
```json
{
  "timestamp": "2025-06-04T14:35:00Z",
  "cooling_systems": [
    {
      "system_id": "liquid_cooling_loop_a",
      "inlet_temp_c": 12.1,
      "outlet_temp_c": 18.7,
      "flow_rate_lpm": 2500,
      "heat_load_mw": 120.5
    }
  ]
}
```

### WSS /stream/grid/events
Grid operator event notifications and demand response requests.

**Message Format:**
```json
{
  "event_type": "demand_response_request",
  "timestamp": "2025-06-04T14:35:00Z",
  "event_id": "dr-event-2025-154",
  "parameters": {
    "requested_reduction_mw": 75.0,
    "duration_hours": 2,
    "response_deadline": "2025-06-04T14:40:00Z",
    "compensation_rate": 150.00
  }
}
```

---

## Implementation Notes

### Security Requirements
- All endpoints require mTLS authentication with valid client certificates
- JWT tokens must be included in Authorization header: `Bearer <token>`
- All communications must use TLS 1.3 or higher
- Rate limiting enforced per client certificate

### Performance Requirements
- API response times must not exceed 1 second for control operations
- Real-time monitoring endpoints must respond within 100ms
- WebSocket streams must provide sub-second updates with <10ms jitter

### Data Validation
- All timestamps must be in ISO 8601 format with UTC timezone
- Power values must be non-negative and within facility capacity limits
- Temperature values must be within sensor operating ranges
- All numeric values must include appropriate precision and units

### Backward Compatibility
- API versioning in URL path ensures compatibility during upgrades
- Deprecated endpoints will be supported for minimum 12 months
- New optional fields may be added without version changes
- Breaking changes require new API version
