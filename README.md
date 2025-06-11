# Power Source to Workload Dynamics (PSWD)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green.svg)](https://swagger.io/specification/)
[![ISO Standard](https://img.shields.io/badge/ISO-TS%20Draft-blue.svg)](https://www.iso.org/)

> Intelligent coordination between computational workloads and energy infrastructure systems

## Overview

PSWD is a technical specification and API framework that transforms data centers from passive power consumers into intelligent grid assets. It addresses the critical challenge of AI workloads creating 200+ MW power swings within 40ms intervals that can destabilize electrical grids.

### Key Problems Solved
- **Grid Destabilization**: AI training workloads causing massive power fluctuations
- **Energy Inefficiency**: Reactive infrastructure management and parasitic power consumption  
- **Limited Renewable Integration**: Poor coordination between compute scheduling and green energy availability
- **Waste Heat Recovery**: Lack of standardized interfaces for municipal heating integration

## Features

🔋 **Real-time Power Management**
- Sub-second power monitoring (100ms resolution)
- Battery coordination for load smoothing (<250ms response)
- Grid-compatible demand response

⚡ **Intelligent Workload Coordination** 
- Event-driven workload signaling (<500ms response)
- Predictive infrastructure preparation
- Flexible throttling and migration support

🌡️ **Advanced Thermal Management**
- Liquid cooling system integration (single/two-phase)
- Municipal waste heat recovery (70-90°C delivery)
- Predictive thermal preparation

🌱 **Grid Integration & Sustainability**
- Renewable energy optimization
- Carbon intensity-aware scheduling
- Municipal heat network coordination

🔒 **Enterprise Security**
- X.509 certificate-based authentication
- Role-based access control
- Network segmentation and intrusion detection

## Architecture

```mermaid
graph TD
    %% External Systems
    GRID[Grid Operators<br/>Load Forecasting<br/>Demand Response]
    MUNICIPAL[Municipal Utilities<br/>District Heating<br/>Waste Heat Recovery]
    RENEWABLE[Renewable Sources<br/>Solar/Wind<br/>Carbon Intensity]

    %% External Integration Layer
    subgraph EIL[External Integration Layer]
        GRID_API[Grid Integration API<br/>IEC 61850-90-4]
        CARBON_TRACK[Carbon Tracking<br/>Renewable Optimization]
        HEAT_COORD[Heat Coordination<br/>Municipal Integration]
    end

    %% Infrastructure Control Layer  
    subgraph ICL[Infrastructure Control Layer]
        POWER_MGT[Power Management<br/>Load Balancing<br/>Peak Shaving]
        BATTERY_SYS[Battery Systems<br/>Energy Storage<br/>Load Smoothing]
        THERMAL_MGT[Thermal Management<br/>Cooling Control<br/>Heat Recovery]
        PREDICT_ENG[Predictive Engine<br/>Load Analytics<br/>Optimization]
    end

    %% Hardware Abstraction Layer
    subgraph HAL[Hardware Abstraction Layer]
        BMC[Enhanced BMC<br/>Redfish API<br/>Sub-second Monitoring]
        POWER_MON[Power Monitoring<br/>100ms Resolution<br/>±0.5% Accuracy]
        THERMAL_SEN[Thermal Sensors<br/>±0.1°C Temperature<br/>±1% Flow Accuracy]
    end

    %% Workload Interface Layer
    subgraph WIL[Workload Interface Layer]
        WORKLOAD_API[Workload API<br/>Event-driven Messaging<br/>Sub-500ms Response]
        SCHEDULER[Scheduler Integration<br/>Kubernetes<br/>Resource Managers]
        FLEXIBILITY[Flexibility Management<br/>Throttling<br/>Migration]
    end

    %% Computational Workloads
    AI_TRAINING[AI Training<br/>200+ MW Swings<br/>40ms Transitions]
    AI_INFERENCE[AI Inference<br/>Real-time Serving<br/>Variable Load]
    HPC[HPC Applications<br/>Scientific Computing<br/>Batch Processing]
    TRADITIONAL[Traditional Compute<br/>Web Services<br/>Steady State]

    %% External Connections
    GRID --> GRID_API
    MUNICIPAL --> HEAT_COORD
    RENEWABLE --> CARBON_TRACK

    %% Infrastructure Control Layer Connections
    GRID_API --> POWER_MGT
    CARBON_TRACK --> PREDICT_ENG
    HEAT_COORD --> THERMAL_MGT
    POWER_MGT --> BATTERY_SYS
    PREDICT_ENG --> POWER_MGT
    PREDICT_ENG --> THERMAL_MGT

    %% Hardware and Workload Connections
    BMC --> POWER_MGT
    POWER_MON --> PREDICT_ENG
    THERMAL_SEN --> THERMAL_MGT
    WORKLOAD_API --> POWER_MGT
    WORKLOAD_API --> THERMAL_MGT
    SCHEDULER --> WORKLOAD_API
    
    AI_TRAINING --> WORKLOAD_API
    AI_INFERENCE --> WORKLOAD_API
    HPC --> WORKLOAD_API
    TRADITIONAL --> WORKLOAD_API

    %% Critical Path Styling
    style AI_TRAINING fill:#ffcccc
    style POWER_MON fill:#ffcccc
    style BATTERY_SYS fill:#ffcccc
    style WORKLOAD_API fill:#ccffcc
    style BMC fill:#ccffcc
    style GRID fill:#ccccff
    style MUNICIPAL fill:#ccccff
```

## Quick Start

### 1. Install Dependencies
```bash
npm install @pswd/api-client
# or
pip install pswd-python-client
```

### 2. Authenticate
```javascript
const { PSWDClient } = require('@pswd/api-client');

const client = new PSWDClient({
  baseURL: 'https://api.pswd.example.com/v1',
  apiKey: 'your-api-key'
});

await client.authenticate({
  username: 'infrastructure_manager',
  password: 'secure_password',
  role: 'infrastructure_manager'
});
```

### 3. Announce Workload
```javascript
const workloadResponse = await client.workload.announce({
  workload_id: 'ai_training_001',
  workload_type: 'ai_training',
  power_profile: {
    peak_power_mw: 150.5,
    baseline_power_mw: 50.2,
    ramp_rate_mw_per_sec: 25.0,
    duration_estimate_sec: 7200
  },
  flexibility_parameters: {
    throttling_capability: true,
    delay_tolerance_sec: 300,
    priority_level: 'high'
  }
});
```

### 4. Monitor Real-time Power
```javascript
const powerData = await client.power.getRealtime({
  duration_seconds: 60,
  resolution_ms: 100
});
```

## API Reference

### Core Endpoints
- `POST /workload/announce` - Announce computational workload
- `GET /power/realtime` - Real-time power measurements  
- `POST /battery/control` - Battery system coordination
- `GET /thermal/status` - Thermal system monitoring
- `POST /grid/signal` - Grid operator communication
- `GET /municipal/heat/status` - Municipal heat integration

### Performance Requirements
| Operation | Max Response Time |
|-----------|-------------------|
| Workload signaling | 500ms |
| Power monitoring | 100ms |
| Battery coordination | 250ms |
| Thermal control | 1s |
| Grid coordination | 5s |

Full API documentation: [OpenAPI Specification](./openapi.yaml)

## Technical Specifications

### Standards Compliance
- **IEC 61850-90-4** - Grid operator communication
- **IEC 62443-3-3** - Industrial network security  
- **IEEE 1547.1** - Grid interconnection testing
- **ISO/IEC 27001** - Information security management
- **DMTF Redfish** - Hardware management APIs

### Measurement Accuracy
| Type | Accuracy | Range |
|------|----------|-------|
| Power | ±0.5% | 1 kW - 1000 MW |
| Temperature | ±0.1°C | -10°C - 125°C |
| Flow rate | ±1.0% | 0 - 5000 L/min |

## Installation

### Docker Deployment
```bash
docker run -d \
  --name pswd-api \
  -p 8080:8080 \
  -e PSWD_DB_URL=postgresql://user:pass@db:5432/pswd \
  pswd/api-server:latest
```

### Kubernetes
```bash
kubectl apply -f https://raw.githubusercontent.com/pswd/pswd/main/k8s/deployment.yaml
```

### Configuration
```yaml
# config.yaml
server:
  port: 8080
  
security:
  jwt_secret: "your-jwt-secret"
  certificate_path: "/etc/certs/server.crt"
  
database:
  url: "postgresql://user:pass@localhost:5432/pswd"
  
grid_integration:
  enabled: true
  operator_endpoint: "https://grid-operator.example.com/api"
  
thermal:
  municipal_heat_enabled: true
  max_supply_temperature: 90
```

## Use Cases

### AI Training Workload Coordination
```javascript
// Large AI model training with grid coordination
await client.workload.announce({
  workload_type: 'ai_training',
  power_profile: { peak_power_mw: 250 },
  timing_constraints: {
    earliest_start_time: '2025-06-11T02:00:00Z', // Low carbon intensity
    deadline: '2025-06-11T08:00:00Z'
  }
});
```

### Municipal Heat Recovery
```javascript
// Enable waste heat delivery to municipal network
await client.municipal.heat.control({
  command_type: 'enable_delivery',
  target_temperature_c: 85,
  target_flow_rate_l_per_min: 1000
});
```

### Grid Demand Response
```javascript
// Participate in grid demand response event
await client.grid.signal({
  signal_type: 'demand_response',
  demand_response: {
    available_reduction_mw: 50,
    response_time_sec: 300,
    duration_hours: 2
  }
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup
```bash
git clone https://github.com/pswd/pswd.git
cd pswd
npm install
npm run dev
```

### Running Tests
```bash
npm test                    # Unit tests
npm run test:integration   # Integration tests
npm run test:performance   # Performance benchmarks
```

## Roadmap

- [ ] **Phase 1**: Basic power signaling and battery load smoothing
- [ ] **Phase 2**: Advanced thermal management and liquid cooling integration  
- [ ] **Phase 3**: Grid services participation and municipal heat integration
- [ ] **Phase 4**: AI-driven optimization and autonomous coordination

## Community

- 💬 [Discussions](https://github.com/pswd/pswd/discussions)
- 🐛 [Issues](https://github.com/pswd/pswd/issues)
- 📧 [Mailing List](mailto:pswd-dev@example.org)
- 🗓️ [Working Group Meetings](https://calendar.example.com/pswd)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Green Software Foundation for project sponsorship
- Linux Foundation for standardization support
- Open Compute Project for hardware integration guidance
- Grid operators and municipal utilities for real-world validation

---

**Transform your data center into an intelligent grid asset with PSWD** ⚡🌱
