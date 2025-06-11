openapi: 3.0.3
info:
  title: Power Source to Workload Dynamics (PSWD) API
  description: |
    RESTful API specification for intelligent coordination between computational workloads 
    and energy infrastructure systems, based on ISO/TS PSWD Technical Specification.
    
    This API enables real-time communication between:
    - Computational workloads and infrastructure systems
    - Data center infrastructure and grid operators
    - Cooling systems and thermal management
    - Battery storage and load smoothing systems
    
    **Key Features:**
    - Sub-second response times for critical operations
    - Event-driven architecture for real-time coordination
    - Secure authentication using JWT tokens
    - Grid integration for demand response and renewable energy optimization
    - Municipal heat network coordination
  version: "1.0.0"
  contact:
    name: PSWD Technical Committee
    email: pswd-support@example.org
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.pswd.example.com/v1
    description: Production PSWD API Server
  - url: https://staging-api.pswd.example.com/v1
    description: Staging PSWD API Server

security:
  - JWT_Auth: []
  - API_Key: []

paths:
  # Authentication
  /auth/login:
    post:
      tags:
        - Authentication
      summary: Authenticate and obtain JWT token
      description: Authenticate user credentials and receive JWT token for API access
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - username
                - password
                - role
              properties:
                username:
                  type: string
                  example: "infrastructure_manager"
                password:
                  type: string
                  format: password
                  example: "secure_password_123"
                role:
                  type: string
                  enum: ["workload_operator", "infrastructure_manager", "grid_operator", "municipal_utility"]
                  example: "infrastructure_manager"
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  token_type:
                    type: string
                    example: "Bearer"
                  expires_in:
                    type: integer
                    example: 3600
                  role:
                    type: string
                    example: "infrastructure_manager"
        '401':
          description: Authentication failed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  # Workload Management
  /workload/announce:
    post:
      tags:
        - Workload Management
      summary: Announce new computational workload
      description: |
        Announce a new computational workload to infrastructure systems for 
        resource allocation and coordination. Response time: <500ms
      security:
        - JWT_Auth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorkloadAnnouncement'
      responses:
        '200':
          description: Workload announcement processed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InfrastructureResponse'
        '400':
          description: Invalid workload announcement format
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '503':
          description: Infrastructure capacity unavailable
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /workload/{workload_id}/control:
    post:
      tags:
        - Workload Management
      summary: Send control commands to active workload
      description: |
        Send real-time control commands to modify workload behavior 
        (throttle, pause, resume, terminate). Response time: <250ms
      security:
        - JWT_Auth: []
      parameters:
        - name: workload_id
          in: path
          required: true
          schema:
            type: string
          example: "wl_ai_training_001"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorkloadControl'
      responses:
        '200':
          description: Control command executed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  workload_id:
                    type: string
                  command_status:
                    type: string
                    enum: ["executed", "pending", "failed"]
                  current_power_mw:
                    type: number
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Workload not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /workload/{workload_id}/status:
    get:
      tags:
        - Workload Management
      summary: Get workload status and metrics
      description: Retrieve current status and performance metrics for active workload
      security:
        - JWT_Auth: []
      parameters:
        - name: workload_id
          in: path
          required: true
          schema:
            type: string
          example: "wl_ai_training_001"
      responses:
        '200':
          description: Workload status retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkloadStatus'

  # Power Management
  /power/realtime:
    get:
      tags:
        - Power Management
      summary: Get real-time power measurements
      description: |
        Retrieve real-time power consumption data with 100ms temporal resolution.
        Response time: <100ms
      security:
        - JWT_Auth: []
      parameters:
        - name: duration_seconds
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 3600
            default: 60
          description: Duration of historical data to retrieve (seconds)
        - name: resolution_ms
          in: query
          schema:
            type: integer
            enum: [100, 250, 500, 1000]
            default: 1000
          description: Temporal resolution in milliseconds
      responses:
        '200':
          description: Real-time power data retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PowerMeasurement'

  /power/forecast:
    get:
      tags:
        - Power Management
      summary: Get power consumption forecasts
      description: Retrieve power consumption forecasts for grid coordination
      security:
        - JWT_Auth: []
      parameters:
        - name: horizon_hours
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 48
            default: 24
          description: Forecast time horizon in hours
      responses:
        '200':
          description: Power forecast retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PowerForecast'

  # Battery Management
  /battery/control:
    post:
      tags:
        - Battery Management
      summary: Control battery energy storage system
      description: |
        Send control commands to battery system for load smoothing and peak shaving.
        Response time: <250ms
      security:
        - JWT_Auth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatteryControl'
      responses:
        '200':
          description: Battery control command executed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  command_id:
                    type: string
                  status:
                    type: string
                    enum: ["executed", "pending", "failed"]
                  current_charge_level_percent:
                    type: number
                    minimum: 0
                    maximum: 100
                  power_output_mw:
                    type: number
                  timestamp:
                    type: string
                    format: date-time

  /battery/status:
    get:
      tags:
        - Battery Management
      summary: Get battery system status
      description: Retrieve current battery system status and capacity information
      security:
        - JWT_Auth: []
      responses:
        '200':
          description: Battery status retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatteryStatus'

  # Thermal Management
  /thermal/status:
    get:
      tags:
        - Thermal Management
      summary: Get thermal system status
      description: |
        Retrieve current thermal management system status including cooling 
        system performance and heat recovery metrics
      security:
        - JWT_Auth: []
      responses:
        '200':
          description: Thermal status retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThermalStatus'

  /thermal/control:
    post:
      tags:
        - Thermal Management
      summary: Control thermal management systems
      description: |
        Send control commands to cooling systems and heat recovery infrastructure.
        Response time: <1s
      security:
        - JWT_Auth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ThermalControl'
      responses:
        '200':
          description: Thermal control command executed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  command_id:
                    type: string
                  status:
                    type: string
                    enum: ["executed", "pending", "failed"]
                  current_temperature_c:
                    type: number
                  flow_rate_l_per_min:
                    type: number
                  timestamp:
                    type: string
                    format: date-time

  # Grid Integration
  /grid/status:
    get:
      tags:
        - Grid Integration
      summary: Get grid connection status
      description: Retrieve current grid status including carbon intensity and renewable energy availability
      security:
        - JWT_Auth: []
      responses:
        '200':
          description: Grid status retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GridStatus'

  /grid/signal:
    post:
      tags:
        - Grid Integration
      summary: Send signals to grid operators
      description: |
        Send load forecasts and demand response signals to grid operators.
        Response time: <5s
      security:
        - JWT_Auth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GridSignal'
      responses:
        '200':
          description: Grid signal sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  signal_id:
                    type: string
                  acknowledgment_status:
                    type: string
                    enum: ["acknowledged", "pending", "rejected"]
                  grid_operator_response:
                    type: string
                  timestamp:
                    type: string
                    format: date-time

  # Municipal Heat Integration
  /municipal/heat/status:
    get:
      tags:
        - Municipal Integration
      summary: Get municipal heat system status
      description: Retrieve current municipal heat network integration status
      security:
        - JWT_Auth: []
      responses:
        '200':
          description: Municipal heat status retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MunicipalHeatStatus'

  /municipal/heat/control:
    post:
      tags:
        - Municipal Integration
      summary: Control municipal heat delivery
      description: Control waste heat delivery to municipal heating network
      security:
        - JWT_Auth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MunicipalHeatControl'
      responses:
        '200':
          description: Municipal heat control executed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  control_id:
                    type: string
                  delivery_status:
                    type: string
                    enum: ["active", "standby", "offline"]
                  heat_output_kw:
                    type: number
                  supply_temperature_c:
                    type: number
                  timestamp:
                    type: string
                    format: date-time

  # System Health and Monitoring
  /system/health:
    get:
      tags:
        - System Monitoring
      summary: Get system health status
      description: Retrieve overall PSWD system health and component status
      security:
        - JWT_Auth: []
      responses:
        '200':
          description: System health retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SystemHealth'

components:
  securitySchemes:
    JWT_Auth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    API_Key:
      type: apiKey
      in: header
      name: X-API-Key

  schemas:
    # Core message schemas from specification
    WorkloadAnnouncement:
      type: object
      required:
        - PSWD_version
        - message_type
        - timestamp
        - workload_id
        - workload_type
        - power_profile
      properties:
        PSWD_version:
          type: string
          enum: ["1.0"]
        message_type:
          type: string
          enum: ["workload_announcement"]
        timestamp:
          type: string
          format: date-time
        workload_id:
          type: string
          example: "wl_ai_training_001"
        workload_type:
          type: string
          enum: ["ai_training", "ai_inference", "hpc", "traditional_compute"]
        power_profile:
          type: object
          required:
            - peak_power_mw
            - baseline_power_mw
            - ramp_rate_mw_per_sec
          properties:
            peak_power_mw:
              type: number
              minimum: 0
              example: 150.5
            baseline_power_mw:
              type: number
              minimum: 0
              example: 50.2
            ramp_rate_mw_per_sec:
              type: number
              minimum: 0
              example: 25.0
            duration_estimate_sec:
              type: integer
              minimum: 0
              example: 7200
            temporal_resolution_ms:
              type: integer
              minimum: 100
              example: 100
        thermal_profile:
          type: object
          properties:
            heat_generation_kw:
              type: number
              minimum: 0
              example: 120000
            preferred_operating_temp_c:
              type: number
              example: 65
            critical_temp_threshold_c:
              type: number
              example: 85
        flexibility_parameters:
          type: object
          properties:
            throttling_capability:
              type: boolean
              example: true
            delay_tolerance_sec:
              type: integer
              minimum: 0
              example: 300
            migration_capable:
              type: boolean
              example: false
            priority_level:
              type: string
              enum: ["critical", "high", "normal", "low"]
              example: "high"
        timing_constraints:
          type: object
          properties:
            earliest_start_time:
              type: string
              format: date-time
            latest_completion_time:
              type: string
              format: date-time
            deadline:
              type: string
              format: date-time

    InfrastructureResponse:
      type: object
      required:
        - PSWD_version
        - message_type
        - timestamp
        - workload_id
        - approval_status
      properties:
        PSWD_version:
          type: string
          enum: ["1.0"]
        message_type:
          type: string
          enum: ["infrastructure_response"]
        timestamp:
          type: string
          format: date-time
        workload_id:
          type: string
        approval_status:
          type: string
          enum: ["approved", "approved_with_conditions", "rejected"]
        approved_power_mw:
          type: number
          minimum: 0
        infrastructure_capacity:
          type: object
          properties:
            available_power_mw:
              type: number
              minimum: 0
            cooling_capacity_kw:
              type: number
              minimum: 0
            battery_storage_available:
              type: boolean
        thermal_coordination:
          type: object
          properties:
            cooling_system_type:
              type: string
              enum: ["air", "single_phase_liquid", "two_phase_liquid"]
            heat_recovery_available:
              type: boolean
            municipal_heat_integration:
              type: boolean
        grid_status:
          type: object
          properties:
            carbon_intensity_g_co2_kwh:
              type: number
              minimum: 0
            renewable_energy_available:
              type: boolean
            demand_response_required:
              type: boolean
        conditions:
          type: array
          items:
            type: string

    WorkloadControl:
      type: object
      required:
        - command_type
        - timestamp
      properties:
        command_type:
          type: string
          enum: ["throttle", "pause", "resume", "terminate", "migrate"]
        timestamp:
          type: string
          format: date-time
        target_power_mw:
          type: number
          minimum: 0
          description: "Required for throttle commands"
        ramp_rate_mw_per_sec:
          type: number
          minimum: 0
        pause_duration_sec:
          type: integer
          minimum: 0
          description: "Maximum pause duration for pause commands"
        migration_target:
          type: string
          description: "Target infrastructure for migration commands"

    WorkloadStatus:
      type: object
      properties:
        workload_id:
          type: string
        current_status:
          type: string
          enum: ["running", "paused", "throttled", "terminated", "migrating"]
        current_power_mw:
          type: number
        peak_power_mw:
          type: number
        average_power_mw:
          type: number
        current_temperature_c:
          type: number
        progress_percent:
          type: number
          minimum: 0
          maximum: 100
        estimated_completion_time:
          type: string
          format: date-time
        timestamp:
          type: string
          format: date-time

    PowerMeasurement:
      type: object
      properties:
        facility_id:
          type: string
        measurement_interval_ms:
          type: integer
        measurements:
          type: array
          items:
            type: object
            properties:
              timestamp:
                type: string
                format: date-time
              total_power_mw:
                type: number
              power_quality:
                type: object
                properties:
                  thd_percent:
                    type: number
                  power_factor:
                    type: number
                  voltage_stability:
                    type: number
              circuit_breakdown:
                type: array
                items:
                  type: object
                  properties:
                    circuit_id:
                      type: string
                    power_mw:
                      type: number

    PowerForecast:
      type: object
      properties:
        facility_id:
          type: string
        forecast_horizon_hours:
          type: integer
        confidence_level_percent:
          type: number
        forecasts:
          type: array
          items:
            type: object
            properties:
              timestamp:
                type: string
                format: date-time
              predicted_power_mw:
                type: number
              confidence_interval_lower:
                type: number
              confidence_interval_upper:
                type: number
              flexibility_upward_mw:
                type: number
              flexibility_downward_mw:
                type: number

    BatteryControl:
      type: object
      required:
        - command_type
        - timestamp
      properties:
        command_type:
          type: string
          enum: ["charge", "discharge", "standby", "load_smooth"]
        timestamp:
          type: string
          format: date-time
        target_power_mw:
          type: number
          description: "Positive for discharge, negative for charge"
        duration_sec:
          type: integer
          minimum: 0
        ramp_rate_mw_per_sec:
          type: number
          minimum: 0

    BatteryStatus:
      type: object
      properties:
        battery_id:
          type: string
        current_charge_level_percent:
          type: number
          minimum: 0
          maximum: 100
        current_power_mw:
          type: number
        max_charge_rate_mw:
          type: number
        max_discharge_rate_mw:
          type: number
        estimated_runtime_hours:
          type: number
        operating_status:
          type: string
          enum: ["charging", "discharging", "standby", "maintenance", "fault"]
        temperature_c:
          type: number
        timestamp:
          type: string
          format: date-time

    ThermalStatus:
      type: object
      properties:
        cooling_system_type:
          type: string
          enum: ["air", "single_phase_liquid", "two_phase_liquid", "hybrid"]
        current_load_percent:
          type: number
          minimum: 0
          maximum: 100
        inlet_temperature_c:
          type: number
        outlet_temperature_c:
          type: number
        flow_rate_l_per_min:
          type: number
        pressure_bar:
          type: number
        heat_recovery_active:
          type: boolean
        municipal_heat_delivery_kw:
          type: number
        phase_change_efficiency_percent:
          type: number
          description: "For two-phase systems only"
        timestamp:
          type: string
          format: date-time

    ThermalControl:
      type: object
      required:
        - command_type
        - timestamp
      properties:
        command_type:
          type: string
          enum: ["set_temperature", "adjust_flow", "enable_heat_recovery", "phase_optimization"]
        timestamp:
          type: string
          format: date-time
        target_temperature_c:
          type: number
        target_flow_rate_l_per_min:
          type: number
        heat_recovery_enabled:
          type: boolean
        ramp_rate_c_per_sec:
          type: number

    GridStatus:
      type: object
      properties:
        grid_operator_id:
          type: string
        carbon_intensity_g_co2_kwh:
          type: number
          minimum: 0
        renewable_energy_percent:
          type: number
          minimum: 0
          maximum: 100
        grid_frequency_hz:
          type: number
        demand_response_active:
          type: boolean
        market_price_per_mwh:
          type: number
        grid_stability_index:
          type: number
          minimum: 0
          maximum: 10
        timestamp:
          type: string
          format: date-time

    GridSignal:
      type: object
      required:
        - signal_type
        - timestamp
      properties:
        signal_type:
          type: string
          enum: ["load_forecast", "demand_response", "frequency_regulation", "capacity_available"]
        timestamp:
          type: string
          format: date-time
        load_forecast:
          type: object
          properties:
            forecast_horizon_hours:
              type: integer
            predicted_load_mw:
              type: array
              items:
                type: object
                properties:
                  timestamp:
                    type: string
                    format: date-time
                  load_mw:
                    type: number
        demand_response:
          type: object
          properties:
            available_reduction_mw:
              type: number
            response_time_sec:
              type: integer
            duration_hours:
              type: number

    MunicipalHeatStatus:
      type: object
      properties:
        municipal_network_id:
          type: string
        heat_delivery_active:
          type: boolean
        current_heat_output_kw:
          type: number
        supply_temperature_c:
          type: number
        return_temperature_c:
          type: number
        flow_rate_l_per_min:
          type: number
        heat_quality_index:
          type: number
          minimum: 0
          maximum: 10
        revenue_per_hour:
          type: number
        timestamp:
          type: string
          format: date-time

    MunicipalHeatControl:
      type: object
      required:
        - command_type
        - timestamp
      properties:
        command_type:
          type: string
          enum: ["enable_delivery", "disable_delivery", "adjust_temperature", "adjust_flow"]
        timestamp:
          type: string
          format: date-time
        target_temperature_c:
          type: number
          minimum: 70
          maximum: 90
        target_flow_rate_l_per_min:
          type: number
        priority_level:
          type: string
          enum: ["emergency", "high", "normal", "low"]

    SystemHealth:
      type: object
      properties:
        overall_status:
          type: string
          enum: ["healthy", "degraded", "critical", "offline"]
        component_status:
          type: object
          properties:
            workload_interface:
              type: string
              enum: ["healthy", "degraded", "critical", "offline"]
            power_management:
              type: string
              enum: ["healthy", "degraded", "critical", "offline"]
            thermal_management:
              type: string
              enum: ["healthy", "degraded", "critical", "offline"]
            grid_integration:
              type: string
              enum: ["healthy", "degraded", "critical", "offline"]
            battery_systems:
              type: string
              enum: ["healthy", "degraded", "critical", "offline"]
        performance_metrics:
          type: object
          properties:
            average_response_time_ms:
              type: number
            uptime_percent:
              type: number
            error_rate_percent:
              type: number
        timestamp:
          type: string
          format: date-time

    Error:
      type: object
      required:
        - error_code
        - message
        - timestamp
      properties:
        error_code:
          type: string
          example: "INSUFFICIENT_CAPACITY"
        message:
          type: string
          example: "Insufficient infrastructure capacity for requested workload"
        details:
          type: string
        timestamp:
          type: string
          format: date-time
        request_id:
          type: string
