import React, { useCallback, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { EmployeeData } from '../data/orgData';
import OrganizationalNode from './OrganizationalNode';
import EmployeeModal from './EmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';
import { useToast } from "../hooks/use-toast";

// Define nodeTypes outside component to prevent recreation on every render
const nodeTypes = {
  organizational: (props: any) => (
    <OrganizationalNode 
      {...props} 
      onClick={props.data.onNodeClick}
    />
  ),
};

const OrganizationalChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editInitialData, setEditInitialData] = useState<EmployeeData | null>(null);
  const [editParentId, setEditParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to normalize skills to string for backend
  const normalizeSkillsForBackend = (skills: string[] | string | undefined): string => {
    if (!skills) return '';
    if (Array.isArray(skills)) return skills.join(',');
    return skills;
  };

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsModalOpen(true);
  }, []);

  const handleNodeClickWithData = useCallback((nodeId: string, employeeData: any) => {
    setSelectedEmployee(employeeData as unknown as EmployeeData);
    setSelectedNodeId(nodeId);
    setIsModalOpen(true);
  }, []);

  // Helper function to calculate hierarchy levels for proper positioning
  const calculateLevel = useCallback((empId: string, employees: any[], visited = new Set()): number => {
    if (visited.has(empId)) return 0; // Prevent circular references
    visited.add(empId);
    
    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.parent_id) return 0;
    
    return 1 + calculateLevel(emp.parent_id, employees, visited);
  }, []);

  // Helper function to build nodes with proper positioning
  const buildNodes = useCallback((data: any[], nodeClickHandler: (nodeId: string, employeeData: any) => void) => {
    return data.map((emp: any) => {
      // Calculate Y position based on hierarchy level
      const level = calculateLevel(emp.id, data);
      const yPosition = 100 + (level * 200);
      
      // Calculate X position based on siblings at the same level
      const siblings = data.filter(e => {
        if (level === 0) return !e.parent_id; // Root level
        return e.parent_id === emp.parent_id; // Same parent
      });
      const siblingIndex = siblings.findIndex(e => e.id === emp.id);
      const xPosition = 200 + (siblingIndex * 300); // Increased spacing
      
      // Create a wrapper function that includes the employee data
      const nodeClickWrapper = () => nodeClickHandler(`employee-${emp.id}`, emp);
      
      return {
        id: `employee-${emp.id}`,
        type: 'organizational',
        position: { x: xPosition, y: yPosition },
        data: { ...emp, onNodeClick: nodeClickWrapper },
        // Add some styling based on hierarchy level
        style: {
          zIndex: level === 0 ? 10 : 5, // Root nodes on top
        },
      };
    });
  }, [calculateLevel]);

  // Helper function to build edges
  const buildEdges = useCallback((data: any[], employeeIds: Set<string>) => {
    return data
      .filter(emp => {
        // Only create edges for employees that have a valid parent_id (not null)
        const hasParent = emp.parent_id && emp.parent_id !== null && emp.parent_id !== 0;
        if (!hasParent) {
          console.log(`[DEBUG] Edge check for ${emp.id}: parent_id=${emp.parent_id}, hasParent=${hasParent}, parent_id type=${typeof emp.parent_id} - skipping (no parent)`);
          return false;
        }
        
        // Check if the parent exists in our employee list
        const parentExists = employeeIds.has(emp.parent_id);
        console.log(`[DEBUG] Edge check for ${emp.id}: parent_id=${emp.parent_id}, hasParent=${hasParent}, parentExists=${parentExists}, parent_id type=${typeof emp.parent_id}`);
        return parentExists;
      })
      .map(emp => {
        return {
          id: `edge-${emp.parent_id}-${emp.id}`,
          source: `employee-${emp.parent_id}`,
          target: `employee-${emp.id}`,
          type: 'default',
          style: { stroke: '#333', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed },
        };
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/employees')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch employees');
        return res.json();
      })
      .then((data: any[]) => {
        console.log('[DEBUG] Employee data from backend:', data);
        console.log('[DEBUG] Employee IDs and parent_ids:');
        data.forEach(emp => {
          console.log(`  Employee ${emp.id}: parent_id = ${emp.parent_id} (type: ${typeof emp.parent_id})`);
        });
        
        // Create a map of employee IDs for validation
        const employeeIds = new Set<string>(data.map(emp => emp.id));
        console.log('[DEBUG] Available employee IDs:', Array.from(employeeIds));
        
        // Transform flat employee list into nodes with hierarchical positioning
        // Calculate hierarchy levels for proper positioning
        const nodes = buildNodes(data, handleNodeClickWithData);
        
        // Build edges based on parent_id
        const edges = buildEdges(data, employeeIds);
        console.log('[DEBUG] Built edges:', edges);
        console.log('[DEBUG] Built nodes:', nodes);
        setNodes(nodes);
        setEdges(edges);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [setNodes, setEdges, toast, buildNodes, buildEdges]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setSelectedNodeId(null);
  }, []);

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
    setIsEditMode(false);
    setEditInitialData(null);
    setEditParentId(null);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditInitialData(null);
    setEditParentId(null);
  }, []);

  const addEmployee = useCallback(async (employeeData: EmployeeData, parentId: string | null) => {
    setLoading(true);
    setError(null);
    try {
      // Prepare payload for backend
      const payload: any = {
        name: employeeData.label,
        title: employeeData.title,
        department: employeeData.department,
        email: employeeData.email,
        phone: employeeData.phone,
        location: employeeData.location,
        bio: employeeData.bio,
        start_date: employeeData.startDate || null,
        skills: employeeData.skills ? normalizeSkillsForBackend(employeeData.skills) : '',
        parent_id: parentId || null,
      };
      
      // Only include avatar if it's not empty
      if (employeeData.avatar && employeeData.avatar.trim() !== '') {
        payload.avatar = employeeData.avatar;
      }
      console.debug('[DEBUG] Add employee payload:', payload);
      const response = await fetch('http://localhost:4000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let errMsg = '';
      if (!response.ok) {
        try {
          const errorJson = await response.json();
          errMsg = errorJson.errors || JSON.stringify(errorJson);
          console.debug('[DEBUG] Backend 422 error:', errorJson);
        } catch (e) {
          errMsg = 'Failed to add employee';
          console.debug('[DEBUG] Backend 422 error: Could not parse JSON');
        }
        toast({ title: 'Error', description: errMsg, variant: 'destructive' });
        throw new Error(errMsg);
      }
      toast({ title: 'Success', description: 'Employee added successfully!' });
      // Reload employees from backend
      const res = await fetch('http://localhost:4000/api/employees');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      // Create a map of employee IDs for validation
      const employeeIds = new Set<string>(data.map((emp: any) => emp.id));
      
      // Calculate hierarchy levels for proper positioning
      const nodes = buildNodes(data, handleNodeClickWithData);
      // Build edges based on parent_id
      const edges = buildEdges(data, employeeIds);
      setNodes(nodes);
      setEdges(edges);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      toast({ title: 'Error', description: err.message || 'Unknown error', variant: 'destructive' });
    }
    setLoading(false);
    setIsAddModalOpen(false);
  }, [setNodes, setEdges, toast, buildNodes, buildEdges, handleNodeClickWithData]);

  // Edit employee logic
  const handleEditEmployee = useCallback(() => {
    if (!selectedNodeId) return;
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return;
    // Find parent (edge where target is selectedNodeId)
    const parentEdge = edges.find(e => e.target === selectedNodeId);
    setEditInitialData(node.data as unknown as EmployeeData);
    setEditParentId(parentEdge ? parentEdge.source : null);
    setIsEditMode(true);
    setIsAddModalOpen(true);
    setIsModalOpen(false);
  }, [selectedNodeId, nodes, edges]);

  // PATCH employee in backend
  const editEmployee = useCallback(async (employeeData: EmployeeData, parentId: string | null) => {
    console.log('[DEBUG] editEmployee called with:', { employeeData, parentId, selectedNodeId });
    if (!selectedNodeId) return;
    setLoading(true);
    setError(null);
    try {
      const id = selectedNodeId.replace('employee-', '');
      const payload: any = {
        name: employeeData.label,
        title: employeeData.title,
        department: employeeData.department,
        email: employeeData.email,
        phone: employeeData.phone,
        location: employeeData.location,
        bio: employeeData.bio,
        start_date: employeeData.startDate || null,
        skills: employeeData.skills ? normalizeSkillsForBackend(employeeData.skills) : '',
        parent_id: parentId || null,
      };
      
      // Only include avatar if it's not empty
      if (employeeData.avatar && employeeData.avatar.trim() !== '') {
        payload.avatar = employeeData.avatar;
      }
      const response = await fetch(`http://localhost:4000/api/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errMsg = (await response.json()).errors || 'Failed to update employee';
        toast({ title: 'Error', description: errMsg, variant: 'destructive' });
        throw new Error(errMsg);
      }
      toast({ title: 'Success', description: 'Employee updated successfully!' });
      // Reload employees from backend
      const res = await fetch('http://localhost:4000/api/employees');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      // Create a map of employee IDs for validation
      const employeeIds = new Set<string>(data.map((emp: any) => emp.id));
      
      const nodes = buildNodes(data, handleNodeClickWithData);
      // Build edges based on parent_id
      const edges = buildEdges(data, employeeIds);
      setNodes(nodes);
      setEdges(edges);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      toast({ title: 'Error', description: err.message || 'Unknown error', variant: 'destructive' });
    }
    setLoading(false);
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditInitialData(null);
    setEditParentId(null);
    setSelectedNodeId(null);
    setSelectedEmployee(null);
  }, [selectedNodeId, setNodes, setEdges, toast, buildNodes, buildEdges]);

  // Delete employee logic
  const handleDeleteEmployee = useCallback(async () => {
    if (!selectedNodeId) return;
    setLoading(true);
    setError(null);
    try {
      const id = selectedNodeId.replace('employee-', '');
      const response = await fetch(`http://localhost:4000/api/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errMsg = (await response.json()).errors || 'Failed to delete employee';
        toast({ title: 'Error', description: errMsg, variant: 'destructive' });
        throw new Error(errMsg);
      }
      toast({ title: 'Success', description: 'Employee deleted successfully!' });
      // Reload employees from backend
      const res = await fetch('http://localhost:4000/api/employees');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      // Create a map of employee IDs for validation
      const employeeIds = new Set<string>(data.map((emp: any) => emp.id));
      
      const nodes = buildNodes(data, handleNodeClickWithData);
      // Build edges based on parent_id
      const edges = buildEdges(data, employeeIds);
      setNodes(nodes);
      setEdges(edges);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      toast({ title: 'Error', description: err.message || 'Unknown error', variant: 'destructive' });
    }
    setLoading(false);
    setIsModalOpen(false);
    setSelectedNodeId(null);
    setSelectedEmployee(null);
  }, [selectedNodeId, setNodes, setEdges, toast, buildNodes, buildEdges]);



  const onConnect = useCallback(
    async (params: Edge | Connection) => {
      // Add the edge to the UI immediately
      setEdges((eds) => addEdge(params, eds));
      
      // Update the parent_id in the backend
      try {
        const targetId = params.target?.replace('employee-', '');
        const sourceId = params.source?.replace('employee-', '');
        
        if (targetId && sourceId) {
          const response = await fetch(`http://localhost:4000/api/employees/${targetId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parent_id: sourceId }),
          });
          
          if (!response.ok) {
            console.error('Failed to update parent_id in backend');
            // Remove the edge if backend update failed
            const edgeId = `edge-${sourceId}-${targetId}`;
            setEdges((eds) => eds.filter(edge => edge.id !== edgeId));
          } else {
            toast({ title: 'Success', description: 'Reporting relationship updated!' });
          }
        }
      } catch (error) {
        console.error('Error updating parent_id:', error);
        // Remove the edge if backend update failed
        const targetId = params.target?.replace('employee-', '');
        const sourceId = params.source?.replace('employee-', '');
        const edgeId = `edge-${sourceId}-${targetId}`;
        setEdges((eds) => eds.filter(edge => edge.id !== edgeId));
      }
    },
    [setEdges, toast],
  );

  const onEdgesChangeCustom = useCallback(
    async (changes: any[]) => {
      // Handle edge removal
      for (const change of changes) {
        if (change.type === 'remove') {
          const edge = change.item;
          const targetId = edge.target?.replace('employee-', '');
          
          if (targetId) {
            try {
              const response = await fetch(`http://localhost:4000/api/employees/${targetId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parent_id: null }),
              });
              
              if (!response.ok) {
                console.error('Failed to remove parent_id in backend');
                // Re-add the edge if backend update failed
                setEdges((eds) => [...eds, edge]);
              } else {
                toast({ title: 'Success', description: 'Reporting relationship removed!' });
              }
            } catch (error) {
              console.error('Error removing parent_id:', error);
              // Re-add the edge if backend update failed
              setEdges((eds) => [...eds, edge]);
            }
          }
        }
      }
      
      // Apply other changes normally
      onEdgesChange(changes);
    },
    [onEdgesChange, setEdges, toast],
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><span>Loading organization data...</span></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-screen text-destructive"><span>Error: {error}</span></div>;
  }

  return (
    <div className="w-full h-screen relative">
      {/* Add Employee Button */}
      <div className="absolute left-4 top-36 z-20 flex space-x-2">
        <button
          onClick={openAddModal}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
        
        {/* Help Tooltip */}
        <div className="relative group">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-secondary/90 transition-colors flex items-center space-x-2">
            <span>?</span>
            <span>Help</span>
          </button>
          <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-20">
            <h3 className="font-semibold mb-2">How to use the organizational chart:</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Click on employees</strong> to view/edit details</li>
              <li>• <strong>Drag from green handle</strong> (bottom) to blue handle (top) to create reporting relationships</li>
              <li>• <strong>Delete edges</strong> to remove reporting relationships</li>
              <li>• <strong>Use controls</strong> to zoom and pan</li>
            </ul>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChangeCustom}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-background"
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        connectOnClick={true}
      >
        <Background
          gap={20}
          size={1}
          color="hsl(var(--border))"
          className="opacity-30"
        />
        <Controls 
          position="top-left"
          className="bg-card border border-border rounded-lg shadow-lg"
        />
        <MiniMap
          position="top-right"
          className="bg-card border border-border rounded-lg shadow-lg"
          nodeClassName={(node) => `minimap-node-${node.data.department}`}
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>
      
      <EmployeeModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={closeModal}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddEmployee={isEditMode ? editEmployee : addEmployee}
        existingNodes={nodes.map(node => ({ id: node.id, data: node.data as unknown as EmployeeData }))}
        {...(isEditMode && editInitialData ? { initialData: editInitialData, initialParentId: editParentId } : {})}
      />
    </div>
  );
};

export default OrganizationalChart;