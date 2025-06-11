"use client"

import { useCallback } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  Background,
  type Connection,
  ConnectionMode,
  Controls,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "reactflow"
import "reactflow/dist/style.css"

const initialNodes: Node[] = [
  // Workload Layer
  {
    id: "ai-training",
    type: "input",
    data: { label: "AI Training\nWorkloads" },
    position: { x: 50, y: 50 },
    style: { backgroundColor: "#ff6b6b", color: "white", width: 120 },
  },
  {
    id: "ai-inference",
    type: "input",
    data: { label: "AI Inference\nWorkloads" },
    position: { x: 200, y: 50 },
    style: { backgroundColor: "#ff6b6b", color: "white", width: 120 },
  },
  {
    id: "hpc",
    type: "input",
    data: { label: "HPC\nApplications" },
    position: { x: 350, y: 50 },
    style: { backgroundColor: "#ff6b6b", color: "white", width: 120 },
  },
  {
    id: "traditional",
    type: "input",
    data: { label: "Traditional\nCompute" },
    position: { x: 500, y: 50 },
    style: { backgroundColor: "#ff6b6b", color: "white", width: 120 },
  },

  // Workload Interface Layer
  {
    id: "workload-interface",
    data: {
      label:
        "Workload Interface Layer\n• Event-driven messaging\n• Power profiling (100ms)\n• Predictive signaling\n• Flexibility parameters",
    },
    position: { x: 200, y: 180 },
    style: { backgroundColor: "#4ecdc4", color: "white", width: 280, height: 80 },
  },

  // Infrastructure Control Layer
  {
    id: "infrastructure-control",
    data: {
      label:
        "Infrastructure Control Layer\n• Real-time optimization\n• Battery coordination\n• Cooling orchestration\n• Multi-system coordination",
    },
    position: { x: 200, y: 320 },
    style: { backgroundColor: "#45b7d1", color: "white", width: 280, height: 80 },
  },

  // Power Management Systems
  {
    id: "power-distribution",
    data: { label: "Power Distribution\nSystems" },
    position: { x: 50, y: 460 },
    style: { backgroundColor: "#f39c12", color: "white", width: 120 },
  },
  {
    id: "battery-storage",
    data: { label: "Battery Energy\nStorage (250ms)" },
    position: { x: 200, y: 460 },
    style: { backgroundColor: "#e74c3c", color: "white", width: 120 },
  },
  {
    id: "ups-systems",
    data: { label: "UPS Systems" },
    position: { x: 350, y: 460 },
    style: { backgroundColor: "#9b59b6", color: "white", width: 120 },
  },

  // Thermal Management Systems
  {
    id: "air-cooling",
    data: { label: "Air-based\nCooling" },
    position: { x: 50, y: 580 },
    style: { backgroundColor: "#1abc9c", color: "white", width: 120 },
  },
  {
    id: "liquid-cooling",
    data: { label: "Liquid Cooling\n(Single/Two-phase)" },
    position: { x: 200, y: 580 },
    style: { backgroundColor: "#16a085", color: "white", width: 120 },
  },
  {
    id: "heat-recovery",
    data: { label: "Heat Recovery\nSystems" },
    position: { x: 350, y: 580 },
    style: { backgroundColor: "#27ae60", color: "white", width: 120 },
  },

  // Hardware Abstraction Layer
  {
    id: "bmc-systems",
    data: { label: "BMC Systems\n• PSWD API endpoints\n• Sub-second monitoring\n• Sensor aggregation" },
    position: { x: 50, y: 720 },
    style: { backgroundColor: "#34495e", color: "white", width: 150, height: 80 },
  },
  {
    id: "sensors",
    data: { label: "Sensors\n• Temperature (±0.1°C)\n• Flow (±1%)\n• Pressure (±0.25%)" },
    position: { x: 250, y: 720 },
    style: { backgroundColor: "#2c3e50", color: "white", width: 150, height: 80 },
  },
  {
    id: "power-meters",
    data: { label: "Power Meters\n• 100ms resolution\n• ±0.5% accuracy\n• THD monitoring" },
    position: { x: 450, y: 720 },
    style: { backgroundColor: "#7f8c8d", color: "white", width: 150, height: 80 },
  },

  // External Integration Layer
  {
    id: "external-integration",
    data: {
      label:
        "External Integration Layer\n• Grid operator communication\n• Municipal utility integration\n• Renewable energy coordination",
    },
    position: { x: 650, y: 320 },
    style: { backgroundColor: "#8e44ad", color: "white", width: 280, height: 80 },
  },

  // Grid Systems
  {
    id: "grid-operator",
    data: { label: "Grid Operator\n• IEC 61850-90-4\n• Demand response\n• Load forecasting" },
    position: { x: 650, y: 180 },
    style: { backgroundColor: "#d35400", color: "white", width: 140, height: 80 },
  },
  {
    id: "renewable-energy",
    data: { label: "Renewable Energy\n• Carbon intensity\n• Availability signals" },
    position: { x: 820, y: 180 },
    style: { backgroundColor: "#27ae60", color: "white", width: 140, height: 80 },
  },

  // Municipal Systems
  {
    id: "municipal-heat",
    data: { label: "Municipal Heat\nNetwork (70-90°C)" },
    position: { x: 650, y: 460 },
    style: { backgroundColor: "#e67e22", color: "white", width: 140 },
  },
  {
    id: "district-heating",
    data: { label: "District Heating\nSystems" },
    position: { x: 820, y: 460 },
    style: { backgroundColor: "#d68910", color: "white", width: 140 },
  },

  // Security & Monitoring
  {
    id: "security-layer",
    data: { label: "Security Framework\n• IEC 62443-3-3\n• X.509 certificates\n• TLS 1.3+\n• Network segmentation" },
    position: { x: 650, y: 580 },
    style: { backgroundColor: "#c0392b", color: "white", width: 180, height: 100 },
  },

  // Time Synchronization
  {
    id: "time-sync",
    data: { label: "Time Sync\n±1ms accuracy\nNTP/PTP" },
    position: { x: 500, y: 320 },
    style: { backgroundColor: "#6c5ce7", color: "white", width: 120, height: 60 },
  },
]

const initialEdges: Edge[] = [
  // Workloads to Interface Layer
  { id: "e1", source: "ai-training", target: "workload-interface", animated: true, style: { stroke: "#ff6b6b" } },
  { id: "e2", source: "ai-inference", target: "workload-interface", animated: true, style: { stroke: "#ff6b6b" } },
  { id: "e3", source: "hpc", target: "workload-interface", animated: true, style: { stroke: "#ff6b6b" } },
  { id: "e4", source: "traditional", target: "workload-interface", animated: true, style: { stroke: "#ff6b6b" } },

  // Interface to Infrastructure Control
  {
    id: "e5",
    source: "workload-interface",
    target: "infrastructure-control",
    animated: true,
    style: { stroke: "#4ecdc4", strokeWidth: 3 },
  },

  // Infrastructure Control to Systems
  { id: "e6", source: "infrastructure-control", target: "power-distribution", animated: true },
  { id: "e7", source: "infrastructure-control", target: "battery-storage", animated: true },
  { id: "e8", source: "infrastructure-control", target: "ups-systems", animated: true },
  { id: "e9", source: "infrastructure-control", target: "air-cooling", animated: true },
  { id: "e10", source: "infrastructure-control", target: "liquid-cooling", animated: true },
  { id: "e11", source: "infrastructure-control", target: "heat-recovery", animated: true },

  // Hardware Abstraction connections
  { id: "e12", source: "power-distribution", target: "bmc-systems", style: { strokeDasharray: "5,5" } },
  { id: "e13", source: "battery-storage", target: "power-meters", style: { strokeDasharray: "5,5" } },
  { id: "e14", source: "liquid-cooling", target: "sensors", style: { strokeDasharray: "5,5" } },
  { id: "e15", source: "air-cooling", target: "sensors", style: { strokeDasharray: "5,5" } },

  // External Integration connections
  {
    id: "e16",
    source: "infrastructure-control",
    target: "external-integration",
    animated: true,
    style: { stroke: "#45b7d1", strokeWidth: 3 },
  },
  { id: "e17", source: "external-integration", target: "grid-operator", animated: true },
  { id: "e18", source: "external-integration", target: "renewable-energy", animated: true },
  { id: "e19", source: "external-integration", target: "municipal-heat", animated: true },
  { id: "e20", source: "municipal-heat", target: "district-heating", animated: true },

  // Heat Recovery to Municipal
  { id: "e21", source: "heat-recovery", target: "municipal-heat", animated: true, style: { stroke: "#27ae60" } },

  // Time Sync connections
  {
    id: "e22",
    source: "time-sync",
    target: "infrastructure-control",
    style: { strokeDasharray: "3,3", stroke: "#6c5ce7" },
  },
  {
    id: "e23",
    source: "time-sync",
    target: "external-integration",
    style: { strokeDasharray: "3,3", stroke: "#6c5ce7" },
  },

  // Security connections (monitoring)
  {
    id: "e24",
    source: "security-layer",
    target: "external-integration",
    style: { strokeDasharray: "2,2", stroke: "#c0392b" },
  },
  {
    id: "e25",
    source: "security-layer",
    target: "infrastructure-control",
    style: { strokeDasharray: "2,2", stroke: "#c0392b" },
  },
]

export default function PSWDFlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b">
        <h1 className="text-2xl font-bold text-gray-800">Power Source to Workload Dynamics (PSWD) Architecture</h1>
        <p className="text-gray-600 mt-1">
          Intelligent coordination between computational workloads, infrastructure systems, and external utility
          networks
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <span className="font-medium">Key Features:</span> Sub-second response (100ms), 200+ MW power coordination,
          Grid stability services, Municipal heat integration
        </div>
      </div>
      <div className="h-[calc(100vh-120px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.1 }}
        >
          <Background variant="dots" gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => node.style?.backgroundColor || "#e2e8f0"}
            position="top-right"
            style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          />
        </ReactFlow>
      </div>
      <div className="p-4 bg-white border-t text-sm text-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="font-medium text-gray-800 mb-2">Communication Flows</div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span>Workload Signaling</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span>Infrastructure Control</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-purple-500"></div>
              <span>External Integration</span>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-800 mb-2">Response Times</div>
            <div className="text-xs">
              <div>Workload Signaling: 500ms</div>
              <div>Power Monitoring: 100ms</div>
              <div>Battery Control: 250ms</div>
              <div>Thermal Control: 1s</div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-800 mb-2">Accuracy Requirements</div>
            <div className="text-xs">
              <div>Power: ±0.5%</div>
              <div>Temperature: ±0.1°C</div>
              <div>Flow Rate: ±1.0%</div>
              <div>Pressure: ±0.25%</div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-800 mb-2">Standards</div>
            <div className="text-xs">
              <div>IEC 61850-90-4 (Grid)</div>
              <div>IEC 62443-3-3 (Security)</div>
              <div>DMTF Redfish (BMC)</div>
              <div>ITU-T G.8275.1 (Time Sync)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
